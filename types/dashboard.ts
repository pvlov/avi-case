import { InsuranceCardData } from './medical';

export interface TimelineItem {
  id: string;
  date: Date;
  type: 'document' | 'prescription' | 'vaccination' | 'labresult';
  title: string;
  description: string;
  doctorName: string;
  documentId: string;
  isHighlighted?: boolean;
}

export interface CategoryItem {
  id: string;
  title: string;
  date: Date;
  type: string;
  documentId: string;
  // Vaccination specific fields
  trade_name?: string;
  batch_number?: string;
  doctor?: string;
  location?: string;
  notes?: string;
  // Medication specific fields
  dosage?: string;
  frequency?: string;
  duration?: string;
  // Procedure specific fields
  indication?: string;
  findings?: string;
}

export interface PersonalInfoItem {
  insuranceData: InsuranceCardData;
} 