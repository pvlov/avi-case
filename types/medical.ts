export interface MedicalDocument {
  generatedTitle?: string;
  dateIssued: string | null;
  doctorName: string | null;
  patient: {
    name: string | null;
    birth_date: string | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    bmi: number | null;
  };
  vitals: Vitals;
  anamnesis: string | null;
  statusAtAdmission: string | null;
  diagnosis: string[];
  therapy: string[];
  progress: string | null;
  ekg: {
    date: string | null;
    details: string | null;
  };
  lab_parameters: LabParameter[];
  procedures: {
    name: string;
    date: string | null;
    indication: string | null;
    findings: string | null;
  }[];
  planned_procedures?: {
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

export interface LabParameter {
  name: string;
  quantity: number;
  unit: string;
}

export interface Vitals {
  blood_pressure: string | null;
  heart_rate: number | null;
  temperature_c: number | null;
  respiratory_rate: number | null;
}

export interface Procedure {
  name: string;
  date: string | null;
  indication: string | null;
  findings: string | null;
  documentId?: string;
}

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  documentId?: string;
}

export interface InsuranceCard {
  givenName: string;
  familyName: string;
  dateOfBirth: Date;
  personalNumber: string;
  insuranceNumber: string;
  insuranceName: string;
  cardNumber: string;
  validUntil: Date;
}

export enum DocType {
  RAW = "raw",
  INSURANCECARD = "insurancecard",
  DOCUMENT = "document",
  VACCINEPASS = "vaccinepass",
  REASONFORVISIT = "reasonforvisit",
}

// Individual vaccination entry interface
export interface VaccinationEntry {
  vaccine: string; // e.g. MMR, Tetanus, COVID-19
  date: Date;
  trade_name?: string; // e.g. Infanrix, Comirnaty
  batch_number?: string; // from the sticker (Ch.-B. or similar)
  doctor?: string; // doctor or practice name
  location?: string; // practice, city, stamp
  notes?: string; // optional handwritten comments, remarks, booster info
}

// Special test interface for TB, Yellow Fever, etc.
export interface SpecialTest {
  type: string; // "Tuberculosis", "Yellow Fever", "Hepatitis B", etc.
  date: Date;
  reaction?: string;
  issuer?: string;
}

export interface VaccinationPass {
  person: {
    name: string;
    date_of_birth: string;
    gender: string | null;
  };
  vaccinations: VaccinationEntry[];
  special_tests: SpecialTest[];
  allergies_or_medical_notes: string[];
}
