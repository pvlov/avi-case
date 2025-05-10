"use client";

import { Section } from "@/components/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from "@/types/patient";
import StepProgressIndicator from "./components/StepProgressIndicator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import InsuranceStep from "./components/DocTypeComponents/InsuranceCard/InsuranceStep";
import MedicalHistoryStep from "./components/DocTypeComponents/MedicalHistoryStep";
import VaccinationStep from "./components/DocTypeComponents/Vaccinations/VaccinationStep";
import PrescriptionStep from "./components/DocTypeComponents/PrescriptionStep";
import { ReactNode } from "react";

// Extend Step type locally for components
interface StepWithComponent extends Step {
  component: ReactNode;
}

const steps: StepWithComponent[] = [
  {
    stepNum: 1,
    label: "Insurance Information",
    description: "Upload your insurance details and coverage information",
    component: <InsuranceStep />,
  },
  {
    stepNum: 2,
    label: "Vaccination Records",
    description: "Upload your vaccination records, including any previous vaccinations or boosters",
    component: <VaccinationStep />,
  },
  {
    stepNum: 3,
    label: "Medical History",
    description: "Upload your medical history, including any previous illnesses or conditions",
    component: <MedicalHistoryStep />,
  },
  {
    stepNum: 4,
    label: "Prescription Records",
    description:
      "Upload your prescription records, including any previous medications or treatments",
    component: <PrescriptionStep />,
  },
];

export default function Onboarding() {
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

  return (
    <Section className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Patient</h1>
        <StepProgressIndicator steps={steps} currentStep={currentStep} />
      </div>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>{currentStep.label}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">{currentStep.component}</CardContent>
      </Card>
      <div className="flex justify-between">
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
