"use server";

import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { ContentListUnion } from "@google/genai/node";
import { randomUUID, UUID } from "crypto";
import { Result, ok, err, UploadInfo, flatten } from "../types/util";
import { PROMPTS } from '@/data/prompts'
import { DocType }from "@/types/medical";

enum FileState {
  PROCESSING = "PROCESSING",
  FAILED = "FAILED",
}

const MODEL = "gemini-2.0-flash";
const RETRY_TIMEOUT = 1000;
const RETRY_AMOUNT = 3;


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripFirstAndLastLine(str: string) {
  const lines = str.split("\n");
  if (lines.length <= 2) return ""; // Nothing to return if there are 2 or fewer lines
  return lines.slice(1, -1).join("\n");
}

const uploadAndFetch = async (
  blob: Blob,
  id: UUID,
  idx: number,
): Promise<Result<UploadInfo, string>> => {
  const file = await ai.files.upload({
    file: blob,
    config: { displayName: `avi-doc-${id}-${idx}` },
  });

  if (!file || !file.name) {
    return err("Failed to Upload File");
  }

  // Poll for completion
  let info;
  do {
    info = await ai.files.get({ name: file.name });
    if (info.state === FileState.PROCESSING) {
      await sleep(RETRY_TIMEOUT);
    }
  } while (info.state === FileState.PROCESSING);

  // Handle errors
  if (info.state === FileState.FAILED) {
    throw new Error(`Upload failed for ${file.name}`);
  }
  if (!info.uri || !info.mimeType) {
    throw new Error(`Missing URI or MIME type for ${file.name}`);
  }

  return ok({ uri: info.uri, mimeType: info.mimeType });
};

export const uploadFiles = async (blobs: Blob[]): Promise<Result<UploadInfo[], string>> => {
  if (!blobs.length) {
    return err("No files uploaded");
  }

  try {
    const id = randomUUID();
    // Start all uploads and polling in parallel
    const uploadPromises = blobs.map((blob, idx) => uploadAndFetch(blob, id, idx));

    // Wait for all to finish
    const uploadedFiles = await Promise.all(uploadPromises);

    return flatten(uploadedFiles);
  } catch (error: unknown) {
    // Short-circuit on first failure
    return err(error instanceof Error ? error.message : "Unknown error occurred");
  }
};

const extractAndMerge = async (uploadInfos: UploadInfo[]): Promise<Result<string, string>> => {
  const extractedTexts = await Promise.all(
    uploadInfos.map((info) => {
      const content: ContentListUnion = [
        PROMPTS[DocType.RAW],
        createPartFromUri(info.uri, info.mimeType),
      ];

      return ai.models.generateContent({
        model: MODEL,
        contents: content,
      });
    }),
  );

  // Check for errors
  const errors = extractedTexts.filter((response) => !response?.text);
  if (errors.length > 0) {
    return err("Failed to extract text from some files");
  }

  return ok(extractedTexts.map((response) => response.text).join("\n-----\n"));
};

export const extractTextFromDocuments = async (blobs: Blob[]): Promise<Result<string, string>> => {
  const uploadedFiles = await uploadFiles(blobs);

  if (uploadedFiles.error) {
    return err(uploadedFiles.error);
  }

  const extractedTexts = await extractAndMerge(uploadedFiles.value!);

  if (extractedTexts.error) {
    return err(extractedTexts.error);
  }

  return ok(extractedTexts.value!);
};

export const parseDocuments = async <T>(formData: FormData): Promise<Result<T, string>> => {
  const blobs = formData.getAll("image") as Blob[];
  const documentType = formData.get("documentType") as DocType;
  const text = await extractTextFromDocuments(blobs);
  if (text.error) {
    console.log(documentType);
    return err(text.error);
  }

  const content: ContentListUnion = [PROMPTS[documentType] || PROMPTS[DocType.RAW], text.value!];

  // Retry logic for JSON extraction
  let retries = 0;
  let parsedData = null;
  let lastError = "";

  while (retries < RETRY_AMOUNT) {
    try {
      // Send it all off to Gemini
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: content,
      });

      if (!response?.text) {
        retries++;
        if (retries >= RETRY_AMOUNT) {
          return err("No response from Gemini after multiple attempts");
        }
        await sleep(RETRY_TIMEOUT);
        continue;
      }

      parsedData = JSON.parse(stripFirstAndLastLine(response.text)) as any;

      // Successfully parsed JSON, proceed with transformations

      // Transform date strings to Date objects based on document type
      if (documentType === DocType.VACCINEPASS) {
        if (parsedData.vaccinations && Array.isArray(parsedData.vaccinations)) {
          // Convert date strings to Date objects in vaccinations array
          parsedData.vaccinations = parsedData.vaccinations.map((vaccination: any) => ({
            ...vaccination,
            date: vaccination.date ? new Date(vaccination.date) : null,
          }));
        }

        if (parsedData.special_tests && Array.isArray(parsedData.special_tests)) {
          // Convert date strings to Date objects in special_tests array
          parsedData.special_tests = parsedData.special_tests.map((test: any) => ({
            ...test,
            date: test.date ? new Date(test.date) : null,
          }));
        }
      } else if (documentType === DocType.INSURANCECARD) {
        // Handle insurance card dates
        if (parsedData.dateOfBirth) {
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        }
        if (parsedData.validFrom) {
          parsedData.validFrom = new Date(parsedData.validFrom);
        }
        if (parsedData.validTo) {
          parsedData.validTo = new Date(parsedData.validTo);
        }
      }

      // Successfully parsed and transformed data
      return ok(parsedData as T);

    } catch (e) {
      lastError = String(e);
      console.log(`Attempt ${retries + 1}/${RETRY_AMOUNT} failed: ${lastError}`);
      retries++;
    }
  }

  // If we get here, all retries failed
  return err(`Failed to parse JSON after ${RETRY_AMOUNT} attempts. Last error: ${lastError}`);
};
