'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { TimelineItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  items: TimelineItem[];
  onHover?: (documentId: string | null) => void;
}

export function TimelineView({ items, onHover }: TimelineViewProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Medical Timeline
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <Card 
            key={item.id}
            className={cn(
              "transition-colors duration-200",
              item.isHighlighted && "ring-2 ring-primary"
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(item.date, 'MMM dd, yyyy')}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.doctorName}
                </span>
              </div>
              <h3 className="font-semibold">{item.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 