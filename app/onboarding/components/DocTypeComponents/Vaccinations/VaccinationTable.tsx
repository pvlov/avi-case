"use client";

import { useState } from "react";
import { VaccinationEntry, VaccinationPass } from "@/types/medical";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit2, Plus } from "lucide-react";

interface VaccinationTableProps {
  data: VaccinationPass | null;
  onEditVaccination: (index: number) => void;
  onAddVaccination: () => void;
}

export function VaccinationTable({ 
  data, 
  onEditVaccination,
  onAddVaccination 
}: VaccinationTableProps) {
  if (!data || data.vaccinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">No vaccination records found.</p>
        <Button onClick={onAddVaccination} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vaccination
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button 
          onClick={onAddVaccination} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vaccination
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vaccine</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
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
              <TableCell>
                {vax.date instanceof Date 
                  ? format(vax.date, 'MMM d, yyyy')
                  : typeof vax.date === 'string' 
                    ? vax.date
                    : 'Unknown date'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {vax.trade_name && (
                    <Badge variant="secondary" className="text-xs">
                      {vax.trade_name}
                    </Badge>
                  )}
                  {vax.batch_number && (
                    <Badge variant="secondary" className="text-xs">
                      Batch: {vax.batch_number}
                    </Badge>
                  )}
                  {vax.doctor && (
                    <Badge variant="secondary" className="text-xs">
                      Dr: {vax.doctor}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditVaccination(index)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {data.special_tests && data.special_tests.length > 0 && (
        <div className="pt-4">
          <h4 className="text-md font-medium mb-2">Special Tests</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.special_tests.map((test, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Badge variant="outline">{test.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {test.date instanceof Date 
                      ? format(test.date, 'MMM d, yyyy')
                      : typeof test.date === 'string' 
                        ? test.date
                        : 'Unknown date'}
                  </TableCell>
                  <TableCell>
                    {test.reaction && <span className="text-sm">{test.reaction}</span>}
                    {test.issuer && <span className="text-sm ml-2">by {test.issuer}</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 