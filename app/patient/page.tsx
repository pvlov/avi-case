"use client";

import { Section } from "@/components/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from "@/types/patient";
import StepProgressIndicator from "./components/StepProgressIndicator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import InsuranceStep from "./components/InsuranceStep";
import MedicalHistoryStep from "./components/MedicalHistoryStep";
import VaccinationStep from "./components/VaccinationStep";
import PrescriptionStep from "./components/PrescriptionStep";

const steps: Step[] = [
  {
    stepNum: 1,
    label: "Insurance Information",
    description: "Upload your insurance details and coverage information",
  },
  {
    stepNum: 2,
    label: "Medical History",
    description: "Upload your medical history, including any previous illnesses or conditions",
  },
  {
    stepNum: 3,
    label: "Vaccination Records",
    description: "Upload your vaccination records, including any previous vaccinations or boosters",
  },
  {
    stepNum: 4,
    label: "Prescription Records",
    description:
      "Upload your prescription records, including any previous medications or treatments",
  },
];

export default function Patient() {
  const [currentStepNum, setCurrentStepNum] = useState(1);
  const currentStep = steps.find((step) => step.stepNum === currentStepNum)!;

  const handleNext = () => {
    if (currentStepNum < steps.length) {
      setCurrentStepNum(currentStepNum + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepNum > 1) {
      setCurrentStepNum(currentStepNum - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStepNum) {
      case 1:
        return <InsuranceStep />;
      case 2:
        return <MedicalHistoryStep />;
      case 3:
        return <VaccinationStep />;
      case 4:
        return <PrescriptionStep />;
      default:
        return null;
    }
  };

  return (
    <Section className="flex flex-col gap-4 h-[calc(100vh-3.5rem)] py-4">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold">Patient</h1>
          <p className="text-muted-foreground">
            Upload and manage your medical information securely
          </p>
        </div>
        <StepProgressIndicator steps={steps} currentStep={currentStep} />
      </div>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>{currentStep.label}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {renderStepContent()}
        </CardContent>
      </Card>
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStepNum === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          disabled={currentStepNum === steps.length}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
