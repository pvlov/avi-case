import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Step } from "@/types/patient";
import { ReactNode } from "react";

// Extend Step type locally to match the one in patient/page.tsx
interface StepWithComponent extends Step {
  component: ReactNode;
}

interface StepProgressIndicatorProps {
  steps: StepWithComponent[];
  currentStep: StepWithComponent;
}

export default function StepProgressIndicator({ steps, currentStep }: StepProgressIndicatorProps) {
  const progress = ((currentStep.stepNum - 1) / (steps.length - 1)) * 100;
  const nextStep = steps.find((step) => step.stepNum === currentStep.stepNum + 1);

  // Styles for step dots
  const dotStyles = {
    base: "h-3 w-3 rounded-full border-2 transition-colors",
    completed: "bg-primary border-primary",
    current: "border-primary bg-white",
    upcoming: "border-gray-300 bg-white",
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {/* Step counter and current step label */}
      <div className="flex justify-between">
        <p className="text-muted-foreground text-sm font-medium">
          Step {currentStep.stepNum} of {steps.length}
        </p>
        <p className="text-sm font-medium">{currentStep.label}</p>
      </div>

      {/* Progress bar with step indicators */}
      <div className="relative">
        <Progress value={progress} />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.label}
                className={cn(
                  "flex flex-col items-center",
                  step.stepNum === 1 && "items-start",
                  step.stepNum === steps.length && "items-end",
                )}
              >
                <div
                  className={cn(
                    dotStyles.base,
                    step.stepNum < currentStep.stepNum && dotStyles.completed,
                    step.stepNum === currentStep.stepNum && dotStyles.current,
                    step.stepNum > currentStep.stepNum && dotStyles.upcoming,
                  )}
                  aria-label={`Step ${step.stepNum}: ${step.label}`}
                />
                <span className="sr-only">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next step indicator */}
      {nextStep ? (
        <p className="text-muted-foreground flex justify-end text-xs">Next: {nextStep.label}</p>
      ) : (
        <p className="text-muted-foreground flex justify-end text-xs">Done 🎉</p>
      )}
    </div>
  );
}
