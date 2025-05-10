"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VaccinationPass } from "@/types/medical";
import { VaccinationStepForm } from "./VaccinationStepForm";

interface VaccinationEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: VaccinationPass | null;
  onSave: (data: VaccinationPass) => void;
  selectedVaccinationIndex?: number;
}

export function VaccinationEditDialog({
  isOpen,
  onClose,
  data,
  onSave,
  selectedVaccinationIndex,
}: VaccinationEditDialogProps) {
  // No need for a special getDefaultValues function now
  // since we're passing the index directly to the form

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {selectedVaccinationIndex !== undefined ? "Edit Vaccination" : "Add Vaccination"}
          </DialogTitle>
        </DialogHeader>

        <VaccinationStepForm
          onSubmit={onSave}
          defaultValues={data || undefined}
          isEdit={selectedVaccinationIndex !== undefined}
          vaccinationIndex={selectedVaccinationIndex}
        />
      </DialogContent>
    </Dialog>
  );
}
