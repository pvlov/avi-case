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

export interface InsuranceCardData {
  insurerName: string,        
  insurerId: string,          
  memberId: string,           
  givenName: string,          
  familyName: string,         
  dateOfBirth: Date 
  validFrom: Date,       
  validTo: Date,         
  cardSerialNumber: string,   
  cardNumber: string,         
}
