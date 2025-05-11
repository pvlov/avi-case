"use client";

import { MedicalDocument } from "@/types/medical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMedicalStore } from "@/lib/store";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface MedicalDocumentStepFormProps {
  onSubmit: (data: MedicalDocument) => void;
  defaultValues?: MedicalDocument;
  isEdit?: boolean;
  batchId?: string;
  formId?: string;
}

export function MedicalDocumentStepForm({
  onSubmit,
  defaultValues,
  isEdit = false,
  batchId,
  formId,
}: MedicalDocumentStepFormProps) {
  const updateRecord = useMedicalStore(state => state.updateRecord);
  
  // Set up React Hook Form
  const form = useForm<MedicalDocument>({
    defaultValues: defaultValues || {
      dateIssued: null,
      doctorName: null,
      patient: {
        name: null,
        birth_date: null,
        gender: null,
        height_cm: null,
        weight_kg: null,
        bmi: null,
      },
      vitals: {
        blood_pressure: null,
        heart_rate: null,
        temperature_c: null,
        respiratory_rate: null,
      },
      anamnesis: null,
      statusAtAdmission: null,
      diagnosis: [],
      therapy: [],
      progress: null,
      ekg: {
        date: null,
        details: null,
      },
      lab_parameters: [],
      procedures: [],
      medications: [],
      discharge_notes: null,
    }
  });

  // Handle form submission
  const handleFormSubmit = (data: MedicalDocument) => {
    onSubmit(data);
    
    // Show success toast notification
    toast.success("Document updated successfully", {
      description: `${data.generatedTitle || "Document"} has been saved.`,
      duration: 3000,
    });
  };
  
  // Handle field changes by directly updating the document data
  const handleFieldChange = async (field: string, value: any) => {
    // Update form state
    form.setValue(field as any, value, { shouldValidate: true, shouldDirty: true });
    
    // If editing an existing document and we have a batch ID
    if (isEdit && defaultValues && batchId) {
      // Get current values from form
      const currentData = form.getValues();
      
      // Use path-based update to modify just the specific field in the store
      // This prevents creating a new document object on each change
      updateRecord(batchId, { 
        data: currentData,
        updatedAt: new Date()
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        id={formId} 
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="doctorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter doctor name" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("doctorName", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateIssued"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Document Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : "Select a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        const dateStr = date ? date.toISOString().split("T")[0] : null;
                        field.onChange(dateStr);
                        handleFieldChange("dateIssued", dateStr);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium flex-shrink-0">Patient Information</h3>
            <Separator className="flex-grow" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="patient.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter patient name" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("patient.name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patient.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter gender" 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("patient.gender", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patient.birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Select date of birth"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("patient.birth_date", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patient.height_cm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter height"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        field.onChange(value);
                        handleFieldChange("patient.height_cm", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patient.weight_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter weight"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        field.onChange(value);
                        handleFieldChange("patient.weight_kg", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium flex-shrink-0">Vitals</h3>
            <Separator className="flex-grow" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="vitals.blood_pressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Pressure</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 120/80"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleFieldChange("vitals.blood_pressure", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vitals.heart_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate (bpm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter heart rate"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        field.onChange(value);
                        handleFieldChange("vitals.heart_rate", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vitals.temperature_c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter temperature"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        field.onChange(value);
                        handleFieldChange("vitals.temperature_c", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vitals.respiratory_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Respiratory Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter respiratory rate"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        field.onChange(value);
                        handleFieldChange("vitals.respiratory_rate", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium flex-shrink-0">Medical Assessment</h3>
            <Separator className="flex-grow" />
          </div>
          <FormField
            control={form.control}
            name="anamnesis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anamnesis</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter anamnesis details"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("anamnesis", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="statusAtAdmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status at Admission</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe status at admission"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("statusAtAdmission", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium flex-shrink-0">Diagnosis & Treatment</h3>
            <Separator className="flex-grow" />
          </div>
          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnoses (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter diagnoses, one per line"
                    rows={3}
                    value={field.value?.join("\n") || ""}
                    onChange={(e) => {
                      const items = e.target.value.split("\n").filter((item) => item.trim() !== "");
                      field.onChange(items);
                      handleFieldChange("diagnosis", items);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="therapy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Therapy (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter therapies, one per line"
                    rows={3}
                    value={field.value?.join("\n") || ""}
                    onChange={(e) => {
                      const items = e.target.value.split("\n").filter((item) => item.trim() !== "");
                      field.onChange(items);
                      handleFieldChange("therapy", items);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium flex-shrink-0">Progress & Discharge</h3>
            <Separator className="flex-grow" />
          </div>
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter progress notes"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("progress", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discharge_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discharge Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter discharge notes"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("discharge_notes", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
} 