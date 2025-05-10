import { MedicalDocument, Vitals } from "@/types/medical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MedicalDocumentStepFormProps {
  onSubmit: (data: MedicalDocument) => void;
  defaultValues?: MedicalDocument;
  isEdit?: boolean;
}

export function MedicalDocumentStepForm({
  onSubmit,
  defaultValues,
  isEdit = false,
}: MedicalDocumentStepFormProps) {
  const [formData, setFormData] = useState<MedicalDocument>(
    defaultValues || {
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
  );

  const [dateIssued, setDateIssued] = useState<Date | undefined>(
    formData.dateIssued ? new Date(formData.dateIssued) : undefined
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    field?: string
  ) => {
    const { name, value } = e.target;
    
    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof MedicalDocument] as any),
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePatientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        [name]: value
      }
    }));
  };

  const handleVitalsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const numValue = name === 'blood_pressure' ? value : (value ? parseFloat(value) : null);
    
    setFormData((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: numValue
      }
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDateIssued(date);
    setFormData((prev) => ({
      ...prev,
      dateIssued: date ? date.toISOString().split("T")[0] : null,
    }));
  };

  const handleListChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: "diagnosis" | "therapy"
  ) => {
    const items = e.target.value.split("\n").filter((item) => item.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            name="doctorName"
            value={formData.doctorName || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="dateIssued">Document Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateIssued && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateIssued ? format(dateIssued, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateIssued}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Patient Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="patient.name">Patient Name</Label>
            <Input
              id="patient.name"
              name="name"
              value={formData.patient.name || ""}
              onChange={handlePatientChange}
            />
          </div>

          <div>
            <Label htmlFor="patient.gender">Gender</Label>
            <Input
              id="patient.gender"
              name="gender"
              value={formData.patient.gender || ""}
              onChange={handlePatientChange}
            />
          </div>
          
          <div>
            <Label htmlFor="patient.birth_date">Date of Birth</Label>
            <Input
              id="patient.birth_date"
              name="birth_date"
              type="date"
              value={formData.patient.birth_date || ""}
              onChange={handlePatientChange}
            />
          </div>
          
          <div>
            <Label htmlFor="patient.height_cm">Height (cm)</Label>
            <Input
              id="patient.height_cm"
              name="height_cm"
              type="number"
              value={formData.patient.height_cm || ""}
              onChange={handlePatientChange}
            />
          </div>
          
          <div>
            <Label htmlFor="patient.weight_kg">Weight (kg)</Label>
            <Input
              id="patient.weight_kg"
              name="weight_kg"
              type="number"
              value={formData.patient.weight_kg || ""}
              onChange={handlePatientChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Vitals</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="vitals.blood_pressure">Blood Pressure</Label>
            <Input
              id="vitals.blood_pressure"
              name="blood_pressure"
              value={formData.vitals.blood_pressure || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 120/80"
            />
          </div>
          
          <div>
            <Label htmlFor="vitals.heart_rate">Heart Rate (bpm)</Label>
            <Input
              id="vitals.heart_rate"
              name="heart_rate"
              type="number"
              value={formData.vitals.heart_rate || ""}
              onChange={handleVitalsChange}
            />
          </div>
          
          <div>
            <Label htmlFor="vitals.temperature_c">Temperature (°C)</Label>
            <Input
              id="vitals.temperature_c"
              name="temperature_c"
              type="number"
              step="0.1"
              value={formData.vitals.temperature_c || ""}
              onChange={handleVitalsChange}
            />
          </div>
          
          <div>
            <Label htmlFor="vitals.respiratory_rate">Respiratory Rate</Label>
            <Input
              id="vitals.respiratory_rate"
              name="respiratory_rate"
              type="number"
              value={formData.vitals.respiratory_rate || ""}
              onChange={handleVitalsChange}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="anamnesis">Anamnesis</Label>
        <Textarea
          id="anamnesis"
          name="anamnesis"
          value={formData.anamnesis || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="statusAtAdmission">Status at Admission</Label>
        <Textarea
          id="statusAtAdmission"
          name="statusAtAdmission"
          value={formData.statusAtAdmission || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="diagnosis">Diagnoses (one per line)</Label>
        <Textarea
          id="diagnosis"
          value={formData.diagnosis?.join("\n") || ""}
          onChange={(e) => handleListChange(e, "diagnosis")}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="therapy">Therapy (one per line)</Label>
        <Textarea
          id="therapy"
          value={formData.therapy?.join("\n") || ""}
          onChange={(e) => handleListChange(e, "therapy")}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="progress">Progress</Label>
        <Textarea
          id="progress"
          name="progress"
          value={formData.progress || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="discharge_notes">Discharge Notes</Label>
        <Textarea
          id="discharge_notes"
          name="discharge_notes"
          value={formData.discharge_notes || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
} 