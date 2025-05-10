import { InsuranceCardData } from '@/types/medical';

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
}

export interface PersonalInfoItem {
  insuranceData: InsuranceCardData;
} 