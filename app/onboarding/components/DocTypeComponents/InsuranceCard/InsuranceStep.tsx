import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef, useMemo } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";
import { DocType, InsuranceCard } from "@/types/medical";
import { InsuranceStepForm } from "./InsuranceStepForm";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { CircleCheck } from "lucide-react";
import { parseDocuments } from "@/actions/gemini";
import { Spinner } from "@/components/ui/spinner";
import { useFormWithStore } from "@/lib/useFormWithStore";
import { useMedicalStore } from "@/lib/store";

// Simple stable selectors
const selectRecords = (state: any) => state.records;
const selectUpdateRecord = (state: any) => state.updateRecord;

export default function InsuranceStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [insuranceData, setInsuranceData] = useState<InsuranceCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("upload");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Get records with a stable selector
  const allRecords = useMedicalStore(selectRecords);

  // Memoize the filtered records
  const insuranceRecords = useMemo(
    () => allRecords.filter((record: any) => record.docType === DocType.INSURANCECARD),
    [allRecords],
  );

  const existingRecord = useMemo(
    () => (insuranceRecords.length > 0 ? insuranceRecords[0] : null),
    [insuranceRecords],
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
      setInsuranceData(existingRecord.data as InsuranceCard);
    }
  }, [existingRecord]);

  // Set up store integration
  const { handleSubmit, isSubmitting, error } = useFormWithStore<InsuranceCard>(
    DocType.INSURANCECARD,
    {
      title: "Insurance Card",
      onSuccess: () => {
        setSuccess(true);
      },
    },
  );

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    // If files were removed, you might want to clear success state
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
    formData.append("documentType", DocType.INSURANCECARD);
    const insuranceCardData = await parseDocuments<InsuranceCard>(formData);

    if (insuranceCardData.value) {
      const newData = insuranceCardData.value;
      setInsuranceData(newData);

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
      console.error("Error parsing insurance card data:", insuranceCardData.error);
    }

    setIsLoading(false);
  };

  const handleFormSubmit = async (data: InsuranceCard) => {
    setInsuranceData(data);

    // Update existing record or create new one
    if (existingRecord) {
      updateRecord(existingRecord.id, { data });
      setSuccess(true);
    } else {
      await handleSubmit(data);
    }

    console.log("Insurance data submitted and saved to store:", data);
  };

  return (
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
      <TabsContent value="manual" className="p-4">
        <InsuranceStepForm
          onSubmit={handleFormSubmit}
          defaultValues={existingRecord ? (existingRecord.data as InsuranceCard) : undefined}
          isEdit={!!existingRecord}
        />
      </TabsContent>
    </Tabs>
  );
}
