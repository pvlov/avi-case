import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";
import { InsuranceCard } from "@/types/medical";
import { InsuranceStepForm } from "./InsuranceStepForm";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { DocType } from "../../../../../types/medical";
import { parseDocuments } from "../../../../../actions/gemini";
import SwirlingEffectSpinner, { Spinner } from "../../../../../components/ui/spinner";
import { CircleCheck } from "lucide-react";

export default function InsuranceStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [insuranceData, setInsuranceData] = useState<InsuranceCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
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
    setInsuranceData(insuranceCardData);
    console.log("Insurance card data:", insuranceCardData);

    setIsLoading(false);
  };

  const handleFormSubmit = (data: InsuranceCard) => {
    setInsuranceData(data);
    console.log("Insurance data submitted:", data);
  };

  const submitElements = isLoading ? (
    <div className="flex items-center justify-center">
      <Spinner className="mt-12 mb-12 size-16" />
    </div>
  ) : (
    <FilePhotoUpload
      onFilesChange={handleFilesChange}
      title=""
      subtitle="PDF, JPG, or PNG (max 10 files)"
    />
  );

  return (
    <Tabs defaultValue="upload" className="flex h-full flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="upload" className="flex flex-col">
        {insuranceData ? (
          <div className="flex items-center justify-center">
            <CircleCheck className="mt-12 mb-12 size-16" />
          </div>
        ) : (
          submitElements
        )}
        {!insuranceData && (
          <Button className="mt-4 w-full" onClick={handleFileUploadSubmit}>
            Submit
          </Button>
        )}
      </TabsContent>
      <TabsContent value="manual" className="p-4">
        <InsuranceStepForm onSubmit={handleFormSubmit} />
      </TabsContent>
    </Tabs>
  );
}
