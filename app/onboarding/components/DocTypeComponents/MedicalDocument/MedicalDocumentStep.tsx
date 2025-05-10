"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef, useMemo } from "react";
import { FilePhotoUpload } from "@/components/FilePhotoUpload";
import { DocType, MedicalDocument } from "@/types/medical";
import { Button } from "@/components/ui/button";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { parseDocuments } from "@/actions/gemini";
import { Spinner } from "@/components/ui/spinner";
import { useFormWithStore } from "@/lib/useFormWithStore";
import { useMedicalStore } from "@/lib/store";
import { MedicalDocumentStepForm } from "./MedicalDocumentStepForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Simple stable selectors
const selectRecords = (state: any) => state.records;
const selectUpdateRecord = (state: any) => state.updateRecord;
const selectAddRecord = (state: any) => state.addRecord;

// Interface for batch tracking
interface FileBatch {
  id: string;
  files: File[];
  isProcessing: boolean;
  isProcessed: boolean;
  documentData?: MedicalDocument;
}

export default function MedicalDocumentStep() {
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [fileBatches, setFileBatches] = useState<FileBatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("upload");
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Get records with a stable selector
  const allRecords = useMedicalStore(selectRecords);
  const addRecord = useMedicalStore(selectAddRecord);
  
  // Memoize the filtered records
  const medicalDocRecords = useMemo(() => 
    allRecords.filter((record: any) => record.docType === DocType.DOCUMENT),
    [allRecords]
  );
  
  // Force tab to "manual" when records exist
  useEffect(() => {
    if (medicalDocRecords.length > 0 && fileBatches.length === 0) {
      // If we have records but no batches, load them as batches
      const loadedBatches = medicalDocRecords.map((record: any) => ({
        id: record.id as string,
        files: [],
        isProcessing: false,
        isProcessed: true,
        documentData: record.data as MedicalDocument
      }));
      
      setFileBatches(loadedBatches);
      setActiveTab("manual");
    }
  }, [medicalDocRecords, fileBatches.length]);

  // Set up store integration
  const { handleSubmit, isSubmitting, error } = useFormWithStore<MedicalDocument>(
    DocType.DOCUMENT,
    {
      title: "Medical Document",
      onSuccess: () => {}
    }
  );

  const handleFilesChange = (newFiles: File[]) => {
    setCurrentFiles(newFiles);
  };

  const generateBatchId = () => {
    return `batch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const addNewBatch = async () => {
    if (currentFiles.length === 0) return;
    
    const newBatch: FileBatch = {
      id: generateBatchId(),
      files: [...currentFiles],
      isProcessing: true, // Start as processing
      isProcessed: false
    };
    
    // Update state with new batch
    setFileBatches(prev => [...prev, newBatch]);
    setCurrentFiles([]);
    
    // Process directly using the newBatch object's files
    const formData = new FormData();
    newBatch.files.forEach((file) => formData.append("image", file));
    formData.append("documentType", DocType.DOCUMENT);
    
    try {
      const medicalDocResult = await parseDocuments<MedicalDocument>(formData);
      
      if (medicalDocResult.value) {
        const newData = medicalDocResult.value;
        
        // Save to store
        const recordId = await handleSubmit(newData);
        
        // Update batch with processed data
        setFileBatches(prev => 
          prev.map(b => 
            b.id === newBatch.id 
              ? {...b, isProcessing: false, isProcessed: true, documentData: newData} 
              : b
          )
        );
        
        // Update batch id to match record id for consistency
        if (recordId && typeof recordId === 'string') {
          setFileBatches(prev => 
            prev.map(b => 
              b.id === newBatch.id 
                ? {...b, id: recordId} 
                : b
            )
          );
        }
      } else {
        console.error("Error parsing medical document data:", medicalDocResult.error);
        setFileBatches(prev => 
          prev.map(b => 
            b.id === newBatch.id 
              ? {...b, isProcessing: false} 
              : b
          )
        );
      }
    } catch (err) {
      console.error("Error processing batch:", err);
      setFileBatches(prev => 
        prev.map(b => 
          b.id === newBatch.id 
            ? {...b, isProcessing: false} 
            : b
        )
      );
    }
  };

  const removeBatch = (batchId: string) => {
    setFileBatches(prev => prev.filter(batch => batch.id !== batchId));
  };

  // Simplified processBatch function for manual processing and the "Process All" button
  const processBatch = async (batchId: string) => {
    const batch = fileBatches.find(b => b.id === batchId);
    if (!batch || batch.isProcessed || batch.files.length === 0) {
      // Make sure to reset processing state if the batch is already processed
      setFileBatches(prev => 
        prev.map(b => 
          b.id === batchId 
            ? {...b, isProcessing: false} 
            : b
        )
      );
      return;
    }
    
    // Mark as processing
    setFileBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? {...batch, isProcessing: true} 
          : batch
      )
    );

    const formData = new FormData();
    batch.files.forEach((file) => formData.append("image", file));
    formData.append("documentType", DocType.DOCUMENT);
    
    try {
      const medicalDocResult = await parseDocuments<MedicalDocument>(formData);
      
      if (medicalDocResult.value) {
        const newData = medicalDocResult.value;
        
        // Save to store
        const recordId = await handleSubmit(newData);
        
        // Update batch with processed data
        setFileBatches(prev => 
          prev.map(b => 
            b.id === batchId 
              ? {...b, isProcessing: false, isProcessed: true, documentData: newData} 
              : b
          )
        );
        
        // Update batch id to match record id for consistency
        if (recordId && typeof recordId === 'string') {
          setFileBatches(prev => 
            prev.map(b => 
              b.id === batchId 
                ? {...b, id: recordId} 
                : b
            )
          );
        }
      } else {
        console.error("Error parsing medical document data:", medicalDocResult.error);
        setFileBatches(prev => 
          prev.map(b => 
            b.id === batchId 
              ? {...b, isProcessing: false} 
              : b
          )
        );
      }
    } catch (err) {
      console.error("Error processing batch:", err);
      setFileBatches(prev => 
        prev.map(b => 
          b.id === batchId 
            ? {...b, isProcessing: false} 
            : b
        )
      );
    }
  };

  const processAllBatches = async () => {
    const unprocessedBatches = fileBatches.filter(batch => !batch.isProcessed);
    
    for (const batch of unprocessedBatches) {
      await processBatch(batch.id);
    }
    
    // After processing, switch to manual tab
    setActiveTab("manual");
  };

  const handleFormSubmit = async (data: MedicalDocument) => {
    // Find if there's an existing batch to update
    const existingBatchIndex = fileBatches.findIndex(batch => batch.isProcessed && batch.documentData);
    
    if (existingBatchIndex >= 0) {
      // Update existing batch
      const batch = fileBatches[existingBatchIndex];
      
      // Add or update record in store
      await handleSubmit(data);
      
      // Update batch data
      setFileBatches(prev => 
        prev.map((b, i) => 
          i === existingBatchIndex 
            ? {...b, documentData: data} 
            : b
        )
      );
    } else {
      // Create new batch from manual entry
      const recordId = await handleSubmit(data);
      
      const newBatch: FileBatch = {
        id: typeof recordId === 'string' ? recordId : generateBatchId(),
        files: [],
        isProcessing: false,
        isProcessed: true,
        documentData: data
      };
      
      setFileBatches(prev => [...prev, newBatch]);
    }
  };

  return (
    <Tabs 
      ref={tabsRef}
      defaultValue={medicalDocRecords.length > 0 ? "manual" : "upload"} 
      className="flex h-full flex-col"
      onValueChange={setActiveTab}
      value={activeTab}
    >
      <TabsList className="w-full">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      
      {error && (
        <div className="bg-destructive/20 p-3 mt-2 rounded-md text-destructive">
          {error}
        </div>
      )}
      
      <TabsContent value="upload" className="flex flex-col gap-4">
        <div className="space-y-4">
          {/* Current file upload area */}
          <FilePhotoUpload
            onFilesChange={handleFilesChange}
            title=""
            subtitle="PDF, JPG, or PNG (max 10 files)"
          />
          <div className="flex justify-end">
            <Button 
              variant="outline"
              onClick={addNewBatch}
              disabled={currentFiles.length === 0}
              className="gap-1"
            >
              <Plus className="size-4" /> Add to Queue
            </Button>
          </div>

          {/* Queued batches */}
          {fileBatches.length > 0 && (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {fileBatches.map((batch, index) => (
                    <Card key={batch.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge>{index + 1}</Badge>
                          <div className="text-sm text-muted-foreground">
                            {batch.files.length > 0 
                              ? `${batch.files.length} file(s)` 
                              : "Added manually"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {batch.isProcessed ? (
                            <Badge variant="outline" className="bg-green-50">Processed</Badge>
                          ) : batch.isProcessing ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => processBatch(batch.id)}
                            >
                              Process
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeBatch(batch.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={processAllBatches}
                  disabled={isSubmitting || fileBatches.every(b => b.isProcessed)}
                >
                  Process All Documents
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="manual" className="p-4">
        <ScrollArea className="h-[600px] w-full">
          {fileBatches.length > 0 ? (
            <div className="space-y-8">
              {fileBatches.map((batch, index) => (
                <div key={batch.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Document {index + 1}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeBatch(batch.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <MedicalDocumentStepForm 
                    onSubmit={handleFormSubmit} 
                    defaultValues={batch.documentData}
                    isEdit={!!batch.documentData}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-4 text-muted-foreground">No documents added yet</p>
              <Button onClick={() => setActiveTab("upload")}>
                Upload Document
              </Button>
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
} 