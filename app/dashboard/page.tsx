'use client';

import { useState } from 'react';
import { TimelineView } from './components/TimelineView';
import { CategoryView } from './components/CategoryView';
import { fetchMedicalData } from './datatransfer';
import { useEffect } from 'react';
import { TimelineItem, CategoryItem, PersonalInfoItem } from '@/types/dashboard';

export default function Dashboard() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [categories, setCategories] = useState({
    medications: [] as CategoryItem[],
    vaccinations: [] as CategoryItem[],
    procedures: [] as CategoryItem[]
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMedicalData();
      setTimelineItems(data.documents);
      setCategories({
        medications: data.medications,
        vaccinations: data.vaccinations,
        procedures: data.procedures
      });
      setPersonalInfo(data.personalInfo);
    };
    loadData();
  }, []);

  const handleHover = (documentId: string | null) => {
    setTimelineItems(items =>
      items.map(item => ({
        ...item,
        isHighlighted: documentId ? item.documentId === documentId : false
      }))
    );
  };

  if (!personalInfo) return null;

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/2 overflow-y-auto">
        <TimelineView items={timelineItems} />
      </div>
      <div className="w-1/2 overflow-y-auto border-l border-border">
        <CategoryView 
          personalInfo={personalInfo}
          categories={categories}
          onHoverCategory={handleHover}
        />
      </div>
    </div>
  );
}
