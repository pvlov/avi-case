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
      <div className="relative">
        {/* Container for line and dots */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border">
          {/* This is the vertical line */}
        </div>
        
        <div className="space-y-6 pl-12">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
              <Card 
                className={cn(
                  "hover:bg-accent/50 transition-colors duration-200",
                  item.isHighlighted && "ring-primary ring-2",
                )}
              >
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {format(item.date, "MMM dd, yyyy")}
                      </span>
                    </div>
                    {item.doctorName && (
                      <div className="text-sm text-muted-foreground truncate">
                        {item.doctorName}
                      </div>
                    )}
                    <h3 className="text-sm font-medium pt-1">{item.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
