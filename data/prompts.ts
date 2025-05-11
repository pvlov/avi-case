import { DocType } from "@/types/medical";
const LanguageFilter = " The texts you are given are in German. You must translate all relevant information into English. Do NOT include any German text in your output."
export const PROMPTS: Record<DocType, string> = {
  [DocType.VACCINEPASS]: `
    You are an expert OCR-and-data-extraction engine tasked with converting all printed and encoded fields from a German vaccine pass into a strict JSON format.
    ***IMPORTANT: EXTRACT VACCINATION NAME ONLY FROM THE INDIVIDUAL STICKERS.*** Do NOT use any printed headers, titles, or sheet information. Only use the content visible directly on each vaccination sticker (vaccine name).

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

    - ***IMPORTANT:Include every dose as a separate entry. ONLY FROM STICKERS.***
    - Parse vaccine names from stamps/stickers or handwritten labels.
    - Include entries like yellow fever and COVID.
    - Translate German terms where helpful, but preserve names as-is (e.g., "Infanrix", "Comirnaty").
    
    Strict JSON only: Your final answer must be valid JSON following the schema. Do NOT include any Markdown, bullet points, or explanatory text in the output. No comments or extra fields. The output should be a string that contains valid JSON.
    Ensure all keys are enclosed in double quotes and strings are properly quoted. Do not include trailing commas.

    If any fields are missing or unclear, use null.
  ` + LanguageFilter,
  [DocType.DOCUMENT]: `
    You are given one or more images of German-language doctor’s notes as text.
    Your task is to extract all relevant medical information and output it as a structured JSON object following the exact schema below.
    Try to merge the different pages separated by ----- into one coherent document.
    The date is of utmost importance and usually located at the top of the page.
    Always output strict JSON with no additional text or explanation—only the JSON structure shown.

    ## JSON Schema and Fields
    MedicalDocument {
      dateIssued: string | null (YYYY-MM-DD format); // e.g. 2023-10-01
      doctorName: string | null; // e.g. Dr. Max Mustermann
      generatedTitle: string | null; // give a title to the document be descriptive about the condition of the patient. be consice don't use unecessary adjectives or adverbs
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
      lab_parameters: { 
        name: string;
        quantity: number;
        unit: string;
  
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
    For numeric fields (height_cm, weight_kg, bmi, heart_rate, temperature_c), output a number (strip units if present) or null. For example, if the note says “75 kg”, output 75 (as a number) for weight_kg.
    For list fields (diagnosis, therapy, lab_parameters, medications), output an array of strings. If there are multiple diagnoses or therapies, include each as a separate string. If none are present, use an empty array.
    For the procedures array, each entry must be an object with keys "name", "date", "indication", and "findings". Fill each with the relevant text (or null if not available). If no procedures are listed, use an empty array.
    Keep the field names exactly as shown (in English).

    ## Output Requirements and Validation
    Strict JSON only: Your final answer must be valid JSON following the schema. Do NOT include any Markdown, bullet points, or explanatory text in the output. No comments or extra fields. The output should be a string that contains valid JSON.
    Ensure all keys are enclosed in double quotes and strings are properly quoted. Do not include trailing commas.
    Include every field from the schema. For example, even if no temperature is listed, output "temperature_c": null under vitals.
    Be conservative with uncertain information. If a field cannot be reliably read or is missing, use null (or an empty list for list fields) rather than guessing.
  ` + LanguageFilter,
  [DocType.INSURANCECARD]: `You are an expert OCR-and-data-extraction engine tasked with converting all printed and encoded fields from a German electronic Gesundheitskarte (eGK) into a strict   JSON format. Follow these rules exactly:
    1. *Schema* – always output a single JSON object with these keys (in this order):
      {
        "insurerName": string,        // full official name of the Krankenkasse
        "insurerId": string,          // Kassenidentifikationsnummer (numeric string)
        "memberId": string,           // Versicherungsnummer on the card
        "givenName": string,          // Vorname
        "familyName": string,         // Nachname
        "dateOfBirth": "YYYY-MM-DD",  // ISO-8601 date
        "validFrom": "YYYY-MM",       // month and year of card validity start
        "validTo": "YYYY-MM",         // month and year of card validity end
        "cardSerialNumber": string,   // Chip-Seriennummer (auf der Karte)
        "cardNumber": string,         // Kartennummer (aufgedruckt)
      }
    2. *Output* – emit *only* valid JSON (no explanations, no markdown fences).
    3. *Missing or unreadable data* – if a field is missing or illegible in the OCR/text/codes, set its value to *null. Do **not* guess or invent values.
    4. *Validation* –
      - Dates must conform to ISO-8601 (YYYY-MM-DD or YYYY-MM).
      - 'insurerId' must be purely numeric; correct obvious OCR errors (e.g. “O”→“0”), but if still uncertain, use null.
    5. *No extra keys* – do not include any fields outside the schema above.
    6. *Accuracy* – expand any known abbreviations in insurer names to the full official name.

    User:
    Below is the raw text (OCR) and any visible codes from the card. Parse and return JSON.` + LanguageFilter,
  [DocType.RAW]: "Extract all visible text into one string.",
};
