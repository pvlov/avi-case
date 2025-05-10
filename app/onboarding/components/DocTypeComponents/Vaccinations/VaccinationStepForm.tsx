"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Vaccination } from "@/types/medical";
import { Textarea } from "@/components/ui/textarea";

// Create a schema for form validation
const formSchema = z.object({
  vaccine: z.string().min(2, {
    message: "Vaccine name must be at least 2 characters.",
  }),
  date: z.string().min(1, {
    message: "Vaccination date is required.",
  }),
  trade_name: z.string().optional(),
  batch_number: z.string().optional(),
  doctor: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface VaccinationStepFormProps {
  onSubmit?: (data: Vaccination) => void;
}

export function VaccinationStepForm({ onSubmit }: VaccinationStepFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vaccine: "",
      date: "",
      trade_name: "",
      batch_number: "",
      doctor: "",
      location: "",
      notes: "",
    },
  });

  function handleSubmit(values: FormValues) {
    const data: Vaccination = {
      ...values,
      date: new Date(values.date),
    };

    if (onSubmit) {
      onSubmit(data);
    }

    console.log("Form submitted:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Vaccine Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vaccine Information</h3>

            <FormField
              control={form.control}
              name="vaccine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. COVID-19, Influenza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trade_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Pfizer, Moderna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BX6738" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Administration Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Administration Details</h3>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccination Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administering Doctor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. City Medical Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information about the vaccination..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Vaccination Record</Button>
        </div>
      </form>
    </Form>
  );
}
