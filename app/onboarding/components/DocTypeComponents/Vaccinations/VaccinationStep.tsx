"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef, useMemo } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";
import { DocType, VaccinationPass, VaccinationEntry } from "@/types/medical";
import { VaccinationStepForm } from "./VaccinationStepForm";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { parseDocuments } from "@/actions/gemini";
import { Spinner } from "@/components/ui/spinner";
import { useFormWithStore } from "@/lib/useFormWithStore";
import { useMedicalStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { VaccinationTable } from "./VaccinationTable";
import { VaccinationEditDialog } from "./VaccinationEditDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simple stable selectors
const selectRecords = (state: any) => state.records;
const selectUpdateRecord = (state: any) => state.updateRecord;

export default function VaccinationStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [vaccinationData, setVaccinationData] = useState<VaccinationPass | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("upload");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaccinationIndex, setSelectedVaccinationIndex] = useState<number | undefined>(
    undefined,
  );

  // Get records with a stable selector
  const allRecords = useMedicalStore(selectRecords);

  // Memoize the filtered records
  const vaccinationRecords = useMemo(
    () => allRecords.filter((record: any) => record.docType === DocType.VACCINEPASS),
    [allRecords],
  );

  const existingRecord = useMemo(
    () => (vaccinationRecords.length > 0 ? vaccinationRecords[0] : null),
    [vaccinationRecords],
  );

  const updateRecord = useMedicalStore(selectUpdateRecord);

  // Force tab to "manual" when records exist
  useEffect(() => {
    if (existingRecord) {
      setActiveTab("manual");
    }
  }, [existingRecord]);

  // If we have existing data, load it
  useEffect(() => {
    if (existingRecord) {
      setVaccinationData(existingRecord.data as VaccinationPass);
    }
  }, [existingRecord]);

  // Set up store integration with VaccinationPass
  const { handleSubmit, isSubmitting, error } = useFormWithStore<VaccinationPass>(
    DocType.VACCINEPASS,
    {
      title: "Vaccination Record",
      onSuccess: () => {
        setSuccess(true);
      },
    },
  );

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);

    if (newFiles.length === 0) {
      setSuccess(false);
    }
  };

  const handleFileUploadSubmit = async () => {
    if (!files.length) {
      console.error("No files selected");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));
    formData.append("documentType", DocType.VACCINEPASS);
    const vaccinationResult = await parseDocuments<VaccinationPass>(formData);

    if (vaccinationResult.value) {
      const newData = vaccinationResult.value;
      setVaccinationData(newData);

      // Update existing record or create new one
      if (existingRecord) {
        updateRecord(existingRecord.id, { data: newData });
      } else {
        await handleSubmit(newData);
      }

      setSuccess(true);

      // Switch to manual tab after successful processing
      setActiveTab("manual");

      // Use setTimeout to ensure the tab content is rendered before scrolling
      setTimeout(() => {
        if (tabsRef.current) {
          tabsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      console.error("Error parsing vaccination data:", vaccinationResult.error);
    }

    setIsLoading(false);
  };

  const handleEditVaccination = (index: number) => {
    setSelectedVaccinationIndex(index);
    setIsDialogOpen(true);
  };

  const handleAddVaccination = () => {
    setSelectedVaccinationIndex(undefined);
    setIsDialogOpen(true);
  };

  const handleSaveVaccination = (updatedData: VaccinationPass) => {
    if (existingRecord) {
      updateRecord(existingRecord.id, { data: updatedData });
    } else {
      handleSubmit(updatedData);
    }
    setVaccinationData(updatedData);
  };

  // Initialize empty vaccination data if none exists
  const getEmptyVaccinationData = (): VaccinationPass => ({
    person: {
      name: null,
      date_of_birth: null,
      gender: null,
    },
    vaccinations: [],
    special_tests: [],
    allergies_or_medical_notes: [],
  });

  return (
    <>
      <Tabs
        ref={tabsRef}
        defaultValue={existingRecord ? "manual" : "upload"}
        className="flex h-full flex-col"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="w-full">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        {error && (
          <div className="bg-destructive/20 text-destructive mt-2 rounded-md p-3">{error}</div>
        )}

        <TabsContent value="upload" className="flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner className="mt-12 mb-12 size-16" />
            </div>
          ) : (
            <FilePhotoUpload
              onFilesChange={handleFilesChange}
              title=""
              subtitle="PDF, JPG, or PNG (max 10 files)"
            />
          )}
          <Button
            className="mt-4 w-full"
            onClick={handleFileUploadSubmit}
            disabled={isLoading || isSubmitting || files.length === 0}
          >
            Submit
          </Button>
        </TabsContent>
        <TabsContent value="manual">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <VaccinationTable
              data={vaccinationData || getEmptyVaccinationData()}
              onEditVaccination={handleEditVaccination}
              onAddVaccination={handleAddVaccination}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <VaccinationEditDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={vaccinationData || getEmptyVaccinationData()}
        onSave={handleSaveVaccination}
        selectedVaccinationIndex={selectedVaccinationIndex}
      />
    </>
  );
}
