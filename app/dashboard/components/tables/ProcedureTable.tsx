"use client";

import { Procedure } from "@/types/medical";
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

interface ProcedureTableProps {
  procedures: Procedure[];
  onEditProcedure: (index: number) => void;
  onAddProcedure: () => void;
  editable?: boolean;
  onHover?: (documentId: string | null) => void;
}

export function ProcedureTable({ 
  procedures, 
  onEditProcedure,
  onAddProcedure,
  editable = true,
  onHover
}: ProcedureTableProps) {
  if (!procedures || procedures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">No procedure records found.</p>
        {editable && (
          <Button onClick={onAddProcedure} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Procedure
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end items-center">
          <Button 
            onClick={onAddProcedure} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Procedure
          </Button>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Procedure</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
            {editable && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {procedures.map((proc, index) => (
            <TableRow 
              key={index}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onMouseEnter={() => onHover?.(proc.documentId || null)}
              onMouseLeave={() => onHover?.(null)}
            >
              <TableCell className="font-medium">
                <Badge variant="outline" className="px-2 py-1">
                  {proc.name}
                </Badge>
              </TableCell>
              <TableCell>
                {proc.date ? format(new Date(proc.date), "MMM d, yyyy") : "-"}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {proc.indication && (
                    <Badge variant="secondary" className="text-xs">
                      Indication: {proc.indication}
                    </Badge>
                  )}
                  {proc.findings && (
                    <Badge variant="secondary" className="text-xs">
                      Findings: {proc.findings}
                    </Badge>
                  )}
                </div>
              </TableCell>
              {editable && (
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditProcedure(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 