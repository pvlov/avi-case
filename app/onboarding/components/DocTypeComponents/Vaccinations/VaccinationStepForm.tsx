"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { VaccinationPass } from "@/types/medical";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

// Create a schema for a single vaccination entry (for form input)
const vaccinationEntrySchema = z.object({
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

// Create a schema for the entire form
const formSchema = z.object({
  vaccination: vaccinationEntrySchema,
  special_tests: z.array(z.any()).optional(),
  allergies_or_medical_notes: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

// Helper to convert VaccinationPass to form compatible values for a single vaccination
const getFormDefaultValues = (data?: VaccinationPass, vaccinationIndex?: number): FormSchema => {
  // Default empty form values
  const emptyValues: FormSchema = {
    vaccination: {
      vaccine: "",
      date: "",
      trade_name: "",
      batch_number: "",
      doctor: "",
      location: "",
      notes: "",
    },
    special_tests: [],
    allergies_or_medical_notes: [],
  };

  // If no data or it's for adding a new vaccination, return empty values
  if (!data || vaccinationIndex === undefined) {
    return emptyValues;
  }

  // For editing, extract the specific vaccination
  const vaccination = data.vaccinations[vaccinationIndex];
  if (!vaccination) {
    return emptyValues;
  }

  return {
    vaccination: {
      vaccine: vaccination.vaccine,
      date:
        vaccination.date instanceof Date
          ? vaccination.date.toISOString().split("T")[0]
          : typeof vaccination.date === "string"
            ? vaccination.date
            : "",
      trade_name: vaccination.trade_name || "",
      batch_number: vaccination.batch_number || "",
      doctor: vaccination.doctor || "",
      location: vaccination.location || "",
      notes: vaccination.notes || "",
    },
    special_tests: data.special_tests || [],
    allergies_or_medical_notes: data.allergies_or_medical_notes || [],
  };
};

interface VaccinationStepFormProps {
  onSubmit?: (data: VaccinationPass) => void;
  defaultValues?: VaccinationPass;
  isEdit?: boolean;
  vaccinationIndex?: number;
}

export function VaccinationStepForm({
  onSubmit,
  defaultValues,
  isEdit = false,
  vaccinationIndex,
}: VaccinationStepFormProps) {
  // Initialize form with processed default values for a single vaccination
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaultValues(defaultValues, vaccinationIndex),
  });

  const handleSubmit: SubmitHandler<FormSchema> = (values) => {
    // If editing, update the existing vaccination
    const formattedDate = values.vaccination.date
      ? new Date(values.vaccination.date).toISOString().split("T")[0]
      : "";

    if (isEdit && defaultValues && vaccinationIndex !== undefined) {
      const updatedVaccinations = [...defaultValues.vaccinations];
      updatedVaccinations[vaccinationIndex] = {
        ...values.vaccination,
        date: formattedDate,
      };

      const data: VaccinationPass = {
        person: defaultValues.person,
        vaccinations: updatedVaccinations,
        special_tests: defaultValues.special_tests,
        allergies_or_medical_notes: defaultValues.allergies_or_medical_notes,
      };

      if (onSubmit) {
        onSubmit(data);
      }
    }
    // If adding a new vaccination
    else if (defaultValues) {
      // Add the new vaccination to existing ones
      const data: VaccinationPass = {
        person: defaultValues.person,
        vaccinations: [
          ...defaultValues.vaccinations,
          {
            ...values.vaccination,
            date: new Date(values.vaccination.date),
          },
        ],
        special_tests: defaultValues.special_tests,
        allergies_or_medical_notes: defaultValues.allergies_or_medical_notes,
      };

      if (onSubmit) {
        onSubmit(data);
      }
    }
    // If this is the first vaccination
    else {
      const data: VaccinationPass = {
        person: {
          name: null,
          date_of_birth: null,
          gender: null,
        },
        vaccinations: [
          {
            ...values.vaccination,
            date: new Date(values.vaccination.date),
          },
        ],
        special_tests: [],
        allergies_or_medical_notes: [],
      };

      if (onSubmit) {
        onSubmit(data);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isEdit ? "Vaccination Details" : "New Vaccination"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vaccination.vaccine"
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
                  name="vaccination.trade_name"
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
                  name="vaccination.batch_number"
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

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vaccination.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaccination Date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString().split("T")[0] : "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vaccination.doctor"
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
                  name="vaccination.location"
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

            <div className="mt-4">
              <FormField
                control={form.control}
                name="vaccination.notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about the vaccination..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2">
          <Save className="h-4 w-4" />
          {isEdit ? "Save Changes" : "Add Vaccination"}
        </Button>
      </form>
    </Form>
  );
}
