"use client";

import { VaccinationPass } from "@/types/medical";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface VaccinationTableProps {
  data: VaccinationPass | null;
  onEditVaccination: (index: number) => void;
  onAddVaccination: () => void;
  editable?: boolean;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export function VaccinationTable({
  data,
  onEditVaccination,
  onAddVaccination,
  editable = true
}: VaccinationTableProps) {
  if (!data || data.vaccinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">No vaccination records found.</p>
        {editable && (
          <Button onClick={onAddVaccination} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vaccinations</h3>
        {editable && (
          <Button
            onClick={onAddVaccination}
            variant="outline"
            size="sm"
            className="ml-auto h-7 w-7 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Mobile Accordion (hidden on md and above) */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          {data.vaccinations.map((vax, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b">
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
                  <Badge variant="outline" className="px-2 py-1">
                    {vax.vaccine}
                  </Badge>
                  {editable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVaccination(index);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="rounded-md pt-1 pb-3">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Date</span>
                      <span>{vax.date ? formatDate(vax.date) : "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Trade Name</span>
                      <span>{vax.trade_name || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Batch Number</span>
                      <span>{vax.batch_number || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Doctor</span>
                      <span>{vax.doctor || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Desktop Table (hidden on small screens) */}
      <div className="hidden max-w-full overflow-x-auto md:block">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Vaccine</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Trade Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Doctor</TableHead>
              {editable && <TableHead className="w-[50px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.vaccinations.map((vax, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Badge variant="outline" className="px-2 py-1">
                    {vax.vaccine}
                  </Badge>
                </TableCell>
                <TableCell>{vax.date ? formatDate(vax.date) : "N/A"}</TableCell>
                <TableCell>{vax.trade_name || "N/A"}</TableCell>
                <TableCell>{vax.batch_number || "N/A"}</TableCell>
                <TableCell>{vax.doctor || "N/A"}</TableCell>
                {editable && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditVaccination(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}