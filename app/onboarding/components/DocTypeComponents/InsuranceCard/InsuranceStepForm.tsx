"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InsuranceCard } from "@/types/medical";
import * as React from "react";

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
  validUntil: z.string().min(1, {
    message: "Valid to date is required.",
  }),
  cardNumber: z.string().min(1, {
    message: "Card number is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface InsuranceStepFormProps {
  onSubmit?: (data: InsuranceCard) => void;
  defaultValues?: InsuranceCard;
  isEdit?: boolean;
}

export function InsuranceStepForm({
  onSubmit,
  defaultValues,
  isEdit = false,
}: InsuranceStepFormProps) {
  // Format dates properly for the form
  const formattedDefaultValues = defaultValues
    ? {
        insurerName: defaultValues.insurerName,
        insurerId: defaultValues.insurerId,
        memberId: defaultValues.memberId,
        givenName: defaultValues.givenName,
        familyName: defaultValues.familyName,
        dateOfBirth: defaultValues.dateOfBirth
          ? new Date(defaultValues.dateOfBirth).toISOString().split("T")[0]
          : "",
        validUntil: defaultValues.validTo
          ? new Date(defaultValues.validTo).toISOString().split("T")[0]
          : "",
        cardNumber: defaultValues.cardNumber,
      }
    : {
        insurerName: "",
        insurerId: "",
        memberId: "",
        givenName: "",
        familyName: "",
        dateOfBirth: "",
        validUntil: "",
        cardNumber: "",
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedDefaultValues,
  });

  const handleFieldChange = (fieldName: keyof FormValues, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {
      ...defaultValues,
      [fieldName]: value,
    };

    // Map form fields to data model fields
    if (fieldName === 'validUntil') {
      updatedData.validTo = value ? new Date(value) : null;
    } else if (fieldName === 'dateOfBirth') {
      updatedData.dateOfBirth = value ? new Date(value) : null;
    }

    if (onSubmit) {
      onSubmit(updatedData);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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
                    <Input
                      placeholder="e.g. Blue Cross"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("insurerName", e.target.value);
                      }}
                    />
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
                    <Input
                      placeholder="e.g. BC1234"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("insurerId", e.target.value);
                      }}
                    />
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
                    <Input
                      placeholder="e.g. 123456789"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("memberId", e.target.value);
                      }}
                    />
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
                    <Input
                      placeholder="e.g. 987654321"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("cardNumber", e.target.value);
                      }}
                    />
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
                    <Input
                      placeholder="e.g. John"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("givenName", e.target.value);
                      }}
                    />
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
                    <Input
                      placeholder="e.g. Doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("familyName", e.target.value);
                      }}
                    />
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
                    <Input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("dateOfBirth", e.target.value);
                      }}
                    />
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
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("validUntil", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
