export interface MedicalDocument {
  id?: string;
  patientName: string;
  dateIssued: Date;
  doctorName: string;
  diagnosis: string;
  medications: Medication[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  documentId?: string;
} 