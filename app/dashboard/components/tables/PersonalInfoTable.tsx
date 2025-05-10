"use client";

import { InsuranceCardData } from "@/types/medical";
import { format } from "date-fns";

interface PersonalInfoTableProps {
  info: InsuranceCardData;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function PersonalInfoTable({ info }: PersonalInfoTableProps) {
  const personalInfoRows: InfoRowProps[] = [
    {
      label: "Name",
      value: `${info.givenName} ${info.familyName}`,
    },
    {
      label: "Date of Birth",
      value: format(info.dateOfBirth, "MMM dd, yyyy"),
    },
    {
      label: "Insurance",
      value: info.insurerName,
    },
    {
      label: "Insurance ID",
      value: info.insurerId,
    },
    {
      label: "Member ID",
      value: info.memberId,
    },
    {
      label: "Card Number",
      value: info.cardNumber,
    },
    {
      label: "Valid Until",
      value: format(info.validTo, "MMM dd, yyyy"),
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-16">
      {personalInfoRows.map((row, index) => (
        <InfoRow key={index} {...row} />
      ))}
    </div>
  );
} 