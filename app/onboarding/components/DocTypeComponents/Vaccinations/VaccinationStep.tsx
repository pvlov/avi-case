import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";
import { InsuranceCardData } from "@/types/medical";
import { VaccinationStepForm } from "./VaccinationStepForm";

export default function VaccinationStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [insuranceData, setInsuranceData] = useState<InsuranceCardData | null>(null);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleFormSubmit = (data: InsuranceCardData) => {
    setInsuranceData(data);
    console.log("Insurance data submitted:", data);
  };

  return (
    <Tabs defaultValue="upload" className="flex h-full flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <FilePhotoUpload
          onFilesChange={handleFilesChange}
          title="Upload your insurance card"
          subtitle="PDF, JPG, or PNG (max 10 files)"
        />
      </TabsContent>
      <TabsContent value="manual" className="p-4">
        <VaccinationStepForm onSubmit={handleFormSubmit} />
      </TabsContent>
    </Tabs>
  );
}
