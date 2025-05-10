"use client";

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
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Calendar className="h-6 w-6" />
        Medical Timeline
      </h2>
      <div className="relative pl-8">
        {/* Vertical Timeline Line */}
        <div className="bg-border absolute top-0 bottom-0 left-3 w-0.5" />

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-[1px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
              <Card 
                className={cn(
                  "hover:bg-accent/50 transition-colors duration-200",
                  item.isHighlighted && "ring-primary ring-2",
                )}
              >
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="text-muted-foreground">
                        {format(item.date, "MMM dd, yyyy")}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{item.doctorName}</span>
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
