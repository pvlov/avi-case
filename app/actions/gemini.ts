"use server";

import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { ContentListUnion } from "@google/genai/node";
import { randomUUID, UUID } from "crypto";
import { Result, ok, err, UploadInfo, flatten } from "../types/util";

enum FileState {
  PROCESSING = "PROCESSING",
  FAILED = "FAILED",
}

const PROMPTS: Record<string, string> = {
  vaccinepass: `
    You are a medical data assistant. Analyze the attached images of a German vaccination pass (Impfpass).

    Extract all vaccination entries and present them in valid JSON format.

    Please follow this structure:

    {
      "person": {
        "name": "string or null",
        "date_of_birth": "YYYY-MM-DD or null",
        "gender": "string or null"
      },
      "vaccinations": [
        {
          "vaccine": "string",         // e.g. MMR, Tetanus, COVID-19
          "date": "YYYY-MM-DD",
          "trade_name": "string or null", // e.g. Infanrix, Comirnaty
          "batch_number": "string or null", // from the sticker (Ch.-B. or similar)
          "doctor": "string or null",  // doctor or practice name
          "location": "string or null", // practice, city, stamp
          "notes": "string or null"    // optional handwritten comments, remarks, booster info
        }
      ],
      "special_tests": [
        {
          "type": "Tuberculosis" | "Yellow Fever" | "Hepatitis B" | ...,
          "date": "YYYY-MM-DD",
          "result": "string or null",
          "issuer": "string or null"
        }
      ],
      "allergies_or_medical_notes": [
        "string"
      ]
    }

    Please:
    - Include every dose as a separate entry.
    - Parse vaccine names from stamps/stickers or handwritten labels.
    - Include entries like yellow fever and COVID.
    - Translate German terms where helpful, but preserve names as-is (e.g., "Infanrix", "Comirnaty").
    - Only output the JSON. No explanation or comments.

    If any fields are missing or unclear, use null.
  `,
  document: `
    You are given one or more images of German-language doctor’s notes as text.
    Your task is to extract all relevant medical information and output it as a structured JSON object following the exact schema below.
    Try to merge the different pages separated by ----- into one coherent document.
    The date is of utmost importance and usually located at the top of the page.
    Always output strict JSON with no additional text or explanation—only the JSON structure shown.
    ## JSON Schema and Fields
    {
      "date": "YYYY-MM-DD",
      "patient": {
        "name": "string | null",
        "birth_date": "string | null",
        "gender": "string | null",
        "height_cm": "number | null",
        "weight_kg": "number | null",
        "bmi": "number | null"
      },
      "vitals": {
        "blood_pressure": "string | null",
        "heart_rate": "number | null",
        "temperature_c": "number | null"
      },
      "anamnesis": "string | null",
      "diagnosis": ["string"],
      "therapy": ["string"],
      "ekg": {
        "date": "string | null",
        "details": "string | null"
      },
      "lab_parameters": ["string"],
      "laboratory_results": [
        {
          "test_name": "string",                // e.g. "Hemoglobin", "CRP"
          "value": "number or string",          // numeric if possible, else string
          "unit": "string or null",             // e.g. "g/dL", "mg/L"
          "reference_range": "string or null",  // e.g. "12–16 g/dL"
        }
      ],
      "procedures": [
        {
          "name": "string",
          "date": "string | null",
          "indication": "string | null",
          "findings": "string | null"
        }
      ],
      "medications": [
        {
          name: "string"
          dosis: "string | null",
          frequency: "string | null",
        }
      ],
      "discharge_notes": "string | null"
    }
    All fields must be present. If a particular piece of information is missing or cannot be determined, use null for string or number fields, and use an empty array ([]) for list fields.
    For numeric fields (height_cm, weight_kg, bmi, heart_rate, temperature_c), output a number (strip units if present) or null. For example, if the note says “75 kg”, output 75 (as a number) for weight_kg.
    For list fields (diagnosis, therapy, lab_parameters, medications), output an array of strings. If there are multiple diagnoses or therapies, include each as a separate string. If none are present, use an empty array.
    For the procedures array, each entry must be an object with keys "name", "date", "indication", and "findings". Fill each with the relevant text (or null if not available). If no procedures are listed, use an empty array.
    Keep the field names exactly as shown (in English).
    ## Output Requirements and Validation
    Strict JSON only: Your final answer must be valid JSON following the schema. Do NOT include any Markdown, bullet points, or explanatory text in the output. No comments or extra fields. The Output needs to be a valid JSON object.
    Ensure all keys are enclosed in double quotes and strings are properly quoted. Do not include trailing commas.
    Include every field from the schema. For example, even if no temperature is listed, output "temperature_c": null under vitals.
    Be conservative with uncertain information. If a field cannot be reliably read or is missing, use null (or an empty list for list fields) rather than guessing.
  `,
  raw: "Extract all visible text into one string.",
  extractText: "Extract all visible text into one string",
};

const MODEL = "gemini-2.0-flash";
const RETRY_TIMEOUT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  } catch (error) {
    // Short-circuit on first failure
    return err(error.message);
  }
};

const extractAndMerge = async (uploadInfos: UploadInfo[]): Promise<Result<string, string>> => {
  const extractedTexts = await Promise.all(
    uploadInfos.map((info) => {
      const content: ContentListUnion = [
        PROMPTS.extractText,
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

export const parseDocuments = async (formData: FormData): Promise<Result<string, string>> => {
  const blobs = formData.getAll("image") as Blob[];
  const documentType = formData.get("documentType") as string;
  const text = await extractTextFromDocuments(blobs);

  if (text.error) {
    return err(text.error);
  }

  const content: ContentListUnion = [PROMPTS[documentType] || PROMPTS.raw, text.value!];

  // Send it all off to Gemini
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: content,
  });

  if (!response?.text) {
    return err("No response from Gemini");
  }

  return ok(response.text);
};
