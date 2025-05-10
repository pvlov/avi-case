"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { File, Pill, Syringe, TestTube, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { CategoryItem, PersonalInfoItem } from "@/types/dashboard";
import { InsuranceCardData, Vaccination, Medication, Procedure } from "@/types/medical";

interface CategoryViewProps {
  personalInfo: PersonalInfoItem;
  categories: {
    medications: CategoryItem[];
    vaccinations: CategoryItem[];
    procedures: CategoryItem[];
  };
  onHoverCategory: (documentId: string | null) => void;
}

export function CategoryView({ personalInfo, categories, onHoverCategory }: CategoryViewProps) {
  return (
    <div className="p-6">
      <div className="space-y-8">
        <PersonalInfoSection info={personalInfo.insuranceData} />

        <CategorySection
          title="Vaccinations"
          icon={<Syringe className="h-5 w-5" />}
          items={categories.vaccinations}
          type="vaccination"
          onHover={onHoverCategory}
        />

        <CategorySection
          title="Medications"
          icon={<Pill className="h-5 w-5" />}
          items={categories.medications}
          type="medication"
          onHover={onHoverCategory}
        />

        <CategorySection
          title="Procedures"
          icon={<Stethoscope className="h-5 w-5" />}
          items={categories.procedures}
          type="procedure"
          onHover={onHoverCategory}
        />
      </div>
    </div>
  );
}

function PersonalInfoSection({ info }: { info: InsuranceCardData }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <User className="h-5 w-5" />
          Personal Information
        </h2>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <InfoRow label="Name" value={`${info.givenName} ${info.familyName}`} />
        <InfoRow label="Date of Birth" value={format(info.dateOfBirth, "MMM dd, yyyy")} />
        <InfoRow label="Insurance" value={info.insurerName} />
        <InfoRow label="Insurer ID" value={info.insurerId} />
        <InfoRow label="Member ID" value={info.memberId} />
        <InfoRow label="Card Number" value={info.cardNumber} />
        <InfoRow label="Card Serial" value={info.cardSerialNumber} />
        <InfoRow label="Valid From" value={format(info.validFrom, "MMM dd, yyyy")} />
        <InfoRow label="Valid Until" value={format(info.validTo, "MMM dd, yyyy")} />
      </CardContent>
    </Card>
  );
}

function VaccinationItem({
  item,
  onHover,
}: {
  item: CategoryItem & Partial<Vaccination>;
  onHover: (documentId: string | null) => void;
}) {
  return (
    <Card
      onMouseEnter={() => onHover(item.documentId)}
      onMouseLeave={() => onHover(null)}
      className="hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <CardContent className="py-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <span className="text-muted-foreground text-sm">{format(item.date, "MMM dd, yyyy")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {item.trade_name && <InfoRow label="Trade Name" value={item.trade_name} />}
          {item.batch_number && <InfoRow label="Batch #" value={item.batch_number} />}
          {item.doctor && <InfoRow label="Doctor" value={item.doctor} />}
          {item.location && <InfoRow label="Location" value={item.location} />}
          {item.notes && <InfoRow label="Notes" value={item.notes} className="col-span-2" />}
        </div>
      </CardContent>
    </Card>
  );
}

function MedicationItem({
  item,
  onHover,
}: {
  item: CategoryItem & Partial<Medication>;
  onHover: (documentId: string | null) => void;
}) {
  return (
    <Card
      onMouseEnter={() => onHover(item.documentId)}
      onMouseLeave={() => onHover(null)}
      className="hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <CardContent className="py-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <span className="text-muted-foreground text-sm">{format(item.date, "MMM dd, yyyy")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoRow label="Dosage" value={item.dosage || "-"} />
          <InfoRow label="Frequency" value={item.frequency || "-"} />
          <InfoRow label="Duration" value={item.duration || "-"} />
        </div>
      </CardContent>
    </Card>
  );
}

function ProcedureItem({
  item,
  onHover,
}: {
  item: CategoryItem & Partial<Procedure>;
  onHover: (documentId: string | null) => void;
}) {
  return (
    <Card
      onMouseEnter={() => onHover(item.documentId)}
      onMouseLeave={() => onHover(null)}
      className="hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <CardContent className="py-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <span className="text-muted-foreground text-sm">{format(item.date, "MMM dd, yyyy")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoRow label="Indication" value={item.indication || "-"} />
          <InfoRow label="Findings" value={item.findings || "-"} className="col-span-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  items: CategoryItem[];
  type: string;
  onHover: (documentId: string | null) => void;
}

function CategorySection({ title, icon, items, type, onHover }: CategorySectionProps) {
  const ItemComponent = {
    vaccination: VaccinationItem as React.FC<any>,
    medication: MedicationItem as React.FC<any>,
    procedure: ProcedureItem as React.FC<any>,
  }[type];

  if (!ItemComponent) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        {icon}
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemComponent key={item.id} item={item} onHover={onHover} />
        ))}
      </div>
    </div>
  );
}
