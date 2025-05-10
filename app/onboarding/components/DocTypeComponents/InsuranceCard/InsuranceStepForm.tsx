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
import { InsuranceCardData } from "@/types/medical";

// Create a schema for form validation
const formSchema = z.object({
  insurerName: z.string().min(2, {
    message: "Insurer name must be at least 2 characters.",
  }),
  insurerId: z.string().min(1, {
    message: "Insurer ID is required.",
  }),
  memberId: z.string().min(1, {
    message: "Member ID is required.",
  }),
  givenName: z.string().min(1, {
    message: "Given name is required.",
  }),
  familyName: z.string().min(1, {
    message: "Family name is required.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required.",
  }),
  validFrom: z.string().min(1, {
    message: "Valid from date is required.",
  }),
  validTo: z.string().min(1, {
    message: "Valid to date is required.",
  }),
  cardSerialNumber: z.string(),
  cardNumber: z.string().min(1, {
    message: "Card number is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface InsuranceStepFormProps {
  onSubmit?: (data: InsuranceCardData) => void;
}

export function InsuranceStepForm({ onSubmit }: InsuranceStepFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurerName: "",
      insurerId: "",
      memberId: "",
      givenName: "",
      familyName: "",
      dateOfBirth: "",
      validFrom: "",
      validTo: "",
      cardSerialNumber: "",
      cardNumber: "",
    },
  });

  function handleSubmit(values: FormValues) {
    const data: InsuranceCardData = {
      ...values,
      dateOfBirth: new Date(values.dateOfBirth),
      validFrom: new Date(values.validFrom),
      validTo: new Date(values.validTo),
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
          {/* Insurer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Insurer Information</h3>

            <FormField
              control={form.control}
              name="insurerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Blue Cross" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurer ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BC1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Member Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Member Information</h3>

            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardSerialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SN12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>

            <FormField
              control={form.control}
              name="givenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Given Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Card Validity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Card Validity</h3>

            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid To</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Insurance Information</Button>
        </div>
      </form>
    </Form>
  );
}
