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
import { DocType } from "@/types/medical";

// Define step configuration with DocType as the single source of truth
interface OnboardingStep extends Step {
  docType: DocType;
}

// Component factory - maps document types to their components
const ComponentFactory = {
  [DocType.INSURANCECARD]: InsuranceStep,
  [DocType.VACCINEPASS]: VaccinationStep,
  [DocType.DOCUMENT]: MedicalHistoryStep,
  [DocType.RAW]: PrescriptionStep,

  // Get the component for a specific docType
  getComponent(docType: DocType) {
    const Component = this[docType];
    return Component ? <Component /> : null;
  },
};

// Define steps with DocType as the core identifier
const steps: OnboardingStep[] = [
  {
    stepNum: 1,
    label: "Insurance Information",
    description: "Upload your insurance details and coverage information",
    docType: DocType.INSURANCECARD,
  },
  {
    stepNum: 2,
    label: "Vaccination Records",
    description: "Upload your vaccination records, including any previous vaccinations or boosters",
    docType: DocType.VACCINEPASS,
  },
  {
    stepNum: 3,
    label: "Medical History",
    description: "Upload your medical history, including any previous illnesses or conditions",
    docType: DocType.DOCUMENT,
  },
  {
    stepNum: 4,
    label: "Prescription Records",
    description:
      "Upload your prescription records, including any previous medications or treatments",
    docType: DocType.RAW,
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
        <h1 className="text-3xl font-bold">Patient Onboarding</h1>
        <StepProgressIndicator steps={steps} currentStep={currentStep} />
      </div>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>{currentStep.label}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {ComponentFactory.getComponent(currentStep.docType)}
        </CardContent>
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
