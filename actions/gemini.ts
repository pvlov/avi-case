"use server";

import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { ContentListUnion } from "@google/genai/node";
import { randomUUID, UUID } from "crypto";
import { Result, ok, err, UploadInfo, flatten } from "../types/util";
import { DocType } from "../types/medical";

enum FileState {
  PROCESSING = "PROCESSING",
  FAILED = "FAILED",
}

const PROMPTS: Record<DocType, string> = {
  [DocType.VACCINEPASS]: `
    You are a medical data assistant. Analyze the attached images of a German vaccination pass (Impfpass).
    ***IMPORTANT: EXTRACT VACCINATION NAME ONLY FROM THE INDIVIDUAL STICKERS.*** Do NOT use any printed headers, titles, or sheet information. Only use the content visible directly on each vaccination sticker (vaccine name).
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
          "reaction": "string or null",
          "issuer": "string or null"
        }
      ],
      "allergies_or_medical_notes": [
        "string"
      ]
    }

    Please:
    - ***IMPORTANT:Include every dose as a separate entry. ONLY FROM STICKERS.***
    - Parse vaccine names from stamps/stickers or handwritten labels.
    - Include entries like yellow fever and COVID.
    - Translate German terms where helpful, but preserve names as-is (e.g., "Infanrix", "Comirnaty").
    - Only output the JSON. No explanation or comments.

    If any fields are missing or unclear, use null.
  `,
  [DocType.DOCUMENT]: `
    You are given one or more images of German-language doctor's notes as text.
    Your task is to extract all relevant medical information and output it as a structured JSON object following the exact schema below.
    Try to merge the different pages separated by ----- into one coherent document.
    The date is of utmost importance and usually located at the top of the page.
    Always output strict JSON with no additional text or explanation—only the JSON structure shown.

    ## JSON Schema and Fields
    MedicalDocument {
      dateIssued: string | null (YYYY-MM-DD format); // e.g. 2023-10-01
      doctorName: string | null; // e.g. Dr. Max Mustermann
      patient: {
        name: string | null;
        birth_date: string | null;
        gender: string | null;
        height_cm: number | null;
        weight_kg: number | null;
        bmi: number | null;
      };
      vitals: {
        blood_pressure: string | null;
        heart_rate: number | null;
        temperature_c: number | null;
      };
      anamnesis: string | null;
      statusAtAdmission: string | null;
      diagnosis: string[];
      therapy: string[];
      progress: string | null;
      ekg: {
        date: string | null;
        details: string | null;
      };
      lab_parameters: string[];
      procedures: {
        name: string;
        date: string | null;
        indication: string | null;
        findings: string | null;
      }[];
      planned_procedures: {
        name: string;
        date: string | null;
        indication: string | null;
      }[];
      medications: {
        name: string;
        dosage: string | null;
        frequency: string | null;
        duration: string | null;
      }[];
      discharge_notes: string | null;
    }
    All fields must be present. If a particular piece of information is missing or cannot be determined, use null for string or number fields, and use an empty array ([]) for list fields.
    For numeric fields (height_cm, weight_kg, bmi, heart_rate, temperature_c), output a number (strip units if present) or null. For example, if the note says "75 kg", output 75 (as a number) for weight_kg.
    For list fields (diagnosis, therapy, lab_parameters, medications), output an array of strings. If there are multiple diagnoses or therapies, include each as a separate string. If none are present, use an empty array.
    For the procedures array, each entry must be an object with keys "name", "date", "indication", and "findings". Fill each with the relevant text (or null if not available). If no procedures are listed, use an empty array.
    Keep the field names exactly as shown (in English).

    ## Output Requirements and Validation
    Strict JSON only: Your final answer must be valid JSON following the schema. Do NOT include any Markdown, bullet points, or explanatory text in the output. No comments or extra fields. The output should be a string that contains valid JSON.
    Ensure all keys are enclosed in double quotes and strings are properly quoted. Do not include trailing commas.
    Include every field from the schema. For example, even if no temperature is listed, output "temperature_c": null under vitals.
    Be conservative with uncertain information. If a field cannot be reliably read or is missing, use null (or an empty list for list fields) rather than guessing.
  `,
  [DocType.INSURANCECARD]: `You are an expert OCR-and-data-extraction engine tasked with converting all printed and encoded fields from a German electronic Gesundheitskarte (eGK) into a strict JSON format. Follow these rules exactly:
    1. *Schema* – always output a single JSON object with these keys (in this order):
      {
        givenName: string; // Name
        familyName: string; // Vorname
        dateOfBirth: Date; // Geburtsdatum
        personalNumber: string; // Persönliche Kennnummer
        insuranceNumber: string; // Kennnummer des Trägers
        insuranceName: string; // Name der Versicherung
        cardNumber: string; // Kennnummer der Karte
        validUntil: Date; // Ablaufdatum
      }
    2. *Output* – emit *only* valid JSON (no explanations, no markdown fences).
    3. *Missing or unreadable data* – if a field is missing or illegible in the OCR/text/codes, set its value to *null. Do **not* guess or invent values.
    4. *Validation* –
      - Dates must conform to ISO-8601 (YYYY-MM-DD or YYYY-MM).
      - 'insurerId' must be purely numeric; correct obvious OCR errors (e.g. "O"→"0"), but if still uncertain, use null.
    5. *No extra keys* – do not include any fields outside the schema above.
    6. *Accuracy* – expand any known abbreviations in insurer names to the full official name.

    User:
    Below is the raw text (OCR) and any visible codes from the card. Parse and return JSON.`,
  [DocType.RAW]: "Extract all visible text into one string.",
};

const MODEL = "gemini-2.0-flash";
const RETRY_TIMEOUT = 5000;

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
  } catch (error) {
    // Short-circuit on first failure
    return err(error instanceof Error ? error.message : 'Unknown error occurred');
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
    return err(text.error);
  }

  const content: ContentListUnion = [PROMPTS[documentType] || PROMPTS[DocType.RAW], text.value!];

  // Send it all off to Gemini
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: content,
  });

  if (!response?.text) {
    return err("No response from Gemini");
  }

  try {
    let parsedData = JSON.parse(stripFirstAndLastLine(response.text)) as any;
    
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
      if (parsedData.validUntil) {
        parsedData.validUntil = new Date(parsedData.validUntil);
      }
    }
    
    return ok(parsedData as T);
  } catch (e) {
    console.log(response.text);
    return err("Invalid JSON response from Gemini: " + e);
  }
};
