import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";

export default function InsuranceStep() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
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
      <TabsContent value="manual"></TabsContent>
    </Tabs>
  );
}
