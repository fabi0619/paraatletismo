import { Check, LoaderCircle } from "lucide-react";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperNav,
} from "@/components/reui/stepper";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string }[];
}

function StepIndicatorBar({ currentStep, steps }: StepIndicatorProps) {
  return (
    <Stepper
      value={currentStep + 1}
      indicators={{
        completed: <Check className="size-3.5" />,
        loading: <LoaderCircle className="size-3.5 animate-spin" />,
      }}
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={step.label} step={index + 1}>
            <StepperTrigger asChild>
              <StepperIndicator />
            </StepperTrigger>
            <div className="hidden sm:block">
              <StepperTitle>{step.label}</StepperTitle>
            </div>
            {index < steps.length - 1 && <StepperSeparator />}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  );
}

export { StepIndicatorBar as StepIndicator };
