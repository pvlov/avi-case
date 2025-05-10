"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { File, Pill, Syringe, TestTube, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { CategoryItem, PersonalInfoItem } from "@/types/dashboard";
import { InsuranceCardData, Vaccination, Medication, Procedure, VaccinationPass } from "@/types/medical";
import { VaccinationTable } from "@/app/onboarding/components/DocTypeComponents/Vaccinations/VaccinationTable";
import { MedicationTable } from "./tables/MedicationTable";
import { ProcedureTable } from "./tables/ProcedureTable";
import { PersonalInfoTable } from "./tables/PersonalInfoTable";

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
  // Convert CategoryItem[] to VaccinationPass format
  const vaccinationPassData: VaccinationPass = {
    person: {
      name: `${personalInfo.insuranceData.givenName} ${personalInfo.insuranceData.familyName}`,
      date_of_birth: personalInfo.insuranceData.dateOfBirth.toISOString(),
      gender: null,
    },
    vaccinations: categories.vaccinations.map(item => ({
      vaccine: item.title.split('(')[0].trim(),
      date: item.date,
      trade_name: item.trade_name,
      batch_number: item.batch_number,
      doctor: item.doctor,
      location: item.location,
      notes: item.notes,
    })),
    special_tests: [],
    allergies_or_medical_notes: [],
  };

  const handleEditVaccination = (index: number) => {
    onHoverCategory(categories.vaccinations[index].documentId);
  };

  const handleAddVaccination = () => {
    console.log("Adding vaccination not supported in dashboard view");
  };

  const handleEditMedication = (index: number) => {
    onHoverCategory(categories.medications[index].documentId);
  };

  const handleAddMedication = () => {
    console.log("Adding medication not supported in dashboard view");
  };

  const handleEditProcedure = (index: number) => {
    onHoverCategory(categories.procedures[index].documentId);
  };

  const handleAddProcedure = () => {
    console.log("Adding procedure not supported in dashboard view");
  };

  // Convert CategoryItem[] to Medication[]
  const medicationsData: Medication[] = categories.medications.map(item => ({
    id: item.id,
    name: item.title,
    dosage: item.dosage || "",
    frequency: item.frequency || "",
    duration: item.duration || "",
    documentId: item.documentId,
  }));

  // Convert CategoryItem[] to Procedure[]
  const proceduresData: Procedure[] = categories.procedures.map(item => ({
    name: item.title,
    date: item.date.toISOString(),
    indication: item.indication || "",
    findings: item.findings || "",
    documentId: item.documentId,
  }));

  return (
    <div className="p-6">
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <User className="h-5 w-5" />
            Personal Information
          </h2>
          <PersonalInfoTable info={personalInfo.insuranceData} />
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Syringe className="h-5 w-5" />
            Vaccinations
          </h2>
          <VaccinationTable 
            data={vaccinationPassData}
            onEditVaccination={handleEditVaccination}
            onAddVaccination={handleAddVaccination}
            editable={false}
          />
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Pill className="h-5 w-5" />
            Medications
          </h2>
          <MedicationTable 
            medications={medicationsData}
            onEditMedication={handleEditMedication}
            onAddMedication={handleAddMedication}
            onHover={onHoverCategory}
            editable={false}
          />
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Stethoscope className="h-5 w-5" />
            Procedures
          </h2>
          <ProcedureTable 
            procedures={proceduresData}
            onEditProcedure={handleEditProcedure}
            onAddProcedure={handleAddProcedure}
            onHover={onHoverCategory}
            editable={false}
          />
        </div>
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
        <InfoRow label="Valid Until" value={format(info.validTo, "MMM dd, yyyy")} />
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
