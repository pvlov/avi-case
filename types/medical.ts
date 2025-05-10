export interface MedicalDocument {
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
}

export interface Vaccination {
  vaccine: string;
  date: Date;
  trade_name?: string;
  batch_number?: string;
  doctor?: string;
  location?: string;
  notes?: string;
}

export interface SpecialTest {
  type: string;
  date: Date;
  reaction?: string;
  issuer?: string;
}
