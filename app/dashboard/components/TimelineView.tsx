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
      <div className="relative pl-8">
        {/* Vertical Timeline Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-[1px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
              <Card 
                className={cn(
                  "transition-colors duration-200 hover:bg-accent/50",
                  item.isHighlighted && "ring-2 ring-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {format(item.date, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {item.doctorName}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 