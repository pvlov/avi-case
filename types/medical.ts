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

export interface Vaccination {
  vaccine: string;      
  date: Date;          
  trade_name?: string;
  batch_number?: string;
  doctor?: string;   
  location?: string; 
  notes?: string; 
};

export interface SpecialTest {
  type: string;
  date: Date;
  reaction?: string;
  issuer?: string;
}
