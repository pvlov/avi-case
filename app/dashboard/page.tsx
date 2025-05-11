"use client";

import { useState, useEffect } from "react";
import { TimelineView } from "./components/TimelineView";
import { CategoryView } from "./components/CategoryView";
import { transformStoreDataToDashboard } from "./datatransfer";
import { TimelineItem, CategoryItem, PersonalInfoItem } from "@/types/dashboard";
import { printStoreState } from '@/lib/store';

export default function Dashboard() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [categories, setCategories] = useState({
    medications: [] as CategoryItem[],
    vaccinations: [] as CategoryItem[],
    procedures: [] as CategoryItem[],
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoItem | null>(null);

  useEffect(() => {
    // Load data from store
    const data = transformStoreDataToDashboard();
    setTimelineItems(data.documents);
    setCategories({
      medications: data.medications,
      vaccinations: data.vaccinations,
      procedures: data.procedures,
    });
    setPersonalInfo(data.personalInfo);
  }, []);

  const handleHover = (documentId: string | null) => {
    setTimelineItems((items) =>
      items.map((item) => ({
        ...item,
        isHighlighted: documentId ? item.documentId === documentId : false,
      })),
    );
  };

  if (!personalInfo) return null;

  return (
    <div className="bg-background flex h-screen">
      <div className="w-1/2 overflow-y-auto">
        <TimelineView items={timelineItems} />
      </div>
      <div className="border-border w-1/2 overflow-y-auto border-l">
        <CategoryView
          personalInfo={personalInfo}
          categories={categories}
          onHoverCategory={handleHover}
        />
      </div>
    </div>
  );
}
