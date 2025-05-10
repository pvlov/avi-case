import { Medication } from "@/types/medical";
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

interface MedicationTableProps {
  medications: Medication[];
  onEditMedication: (index: number) => void;
  onAddMedication: () => void;
  editable?: boolean;
}

export function MedicationTable({ 
  medications, 
  onEditMedication,
  onAddMedication,
  editable = true
}: MedicationTableProps) {
  if (!medications || medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">No medication records found.</p>
        {editable && (
          <Button onClick={onAddMedication} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Medication
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
            onClick={onAddMedication} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead className="w-[80px]">Dosage</TableHead>
            <TableHead>Details</TableHead>
            {editable && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((med, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Badge variant="outline" className="px-2 py-1">
                  {med.name}
                </Badge>
              </TableCell>
              <TableCell className="w-[80px]">
                {med.dosage}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {med.frequency && (
                    <Badge variant="secondary" className="text-xs">
                      {med.frequency}
                    </Badge>
                  )}
                  {med.duration && (
                    <Badge variant="secondary" className="text-xs">
                      {med.duration}
                    </Badge>
                  )}
                </div>
              </TableCell>
              {editable && (
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditMedication(index)}
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
