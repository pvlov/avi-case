import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DocType } from "@/types/medical";
import { useFormWithStore } from "@/lib/useFormWithStore";
import { useMedicalStore } from "@/lib/store";
import { CircleCheck } from "lucide-react";

// Define the schema for Reason For Visit
const reasonForVisitSchema = z.object({
  primaryReason: z.string().min(3, "Primary reason is required"),
  symptoms: z.string().optional(),
  symptomDuration: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type ReasonForVisit = z.infer<typeof reasonForVisitSchema>;

// Simple stable selectors
const selectRecords = (state: any) => state.records;
const selectUpdateRecord = (state: any) => state.updateRecord;

export default function ReasonForVisitStep() {
  const [success, setSuccess] = useState<boolean>(false);

  const allRecords = useMedicalStore(selectRecords);
  const reasonRecords = allRecords.filter((record: any) => record.docType === DocType.REASON_FOR_VISIT);
  const existingRecord = reasonRecords.length > 0 ? reasonRecords[0] : null;

  const updateRecord = useMedicalStore(selectUpdateRecord);

  const form = useForm<ReasonForVisit>({
    resolver: zodResolver(reasonForVisitSchema),
    defaultValues: existingRecord
      ? (existingRecord.data as ReasonForVisit)
      : {
        primaryReason: "",
        symptoms: "",
        symptomDuration: "",
        additionalNotes: "",
      },
  });

  const { handleSubmit: handleStoreSubmit, isSubmitting, error } = useFormWithStore<ReasonForVisit>(
    DocType.REASON_FOR_VISIT,
    {
      title: "Reason for Visit",
      onSuccess: () => {
        setSuccess(true);
      },
    }
  );

  const onSubmit = async (data: ReasonForVisit) => {
    if (existingRecord) {
      updateRecord(existingRecord.id, { data });
      setSuccess(true);
    } else {
      await handleStoreSubmit(data);
    }
    console.log("Reason for visit submitted:", data);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/20 text-destructive rounded-md p-3">{error}</div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="primaryReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary reason for visit <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Annual checkup, Stomach pain, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptoms (if any)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe any symptoms you're experiencing"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symptomDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How long have you had these symptoms?</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3 days, 2 weeks, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information you'd like to share"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {success && <CircleCheck className="h-4 w-4" />}
              {existingRecord ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}