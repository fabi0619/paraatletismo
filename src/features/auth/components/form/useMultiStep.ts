import { useState, useCallback } from "react";

interface UseMultiStepOptions {
  onBeforeNext?: () => Promise<boolean> | boolean;
}

function useMultiStep(totalSteps: number, options?: UseMultiStepOptions) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = useCallback(async () => {
    if (options?.onBeforeNext) {
      const canProceed = await options.onBeforeNext();
      if (!canProceed) return false;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    return true;
  }, [totalSteps, options]);

  const prev = useCallback(
    () => setCurrentStep((prev) => Math.max(prev - 1, 0)),
    [],
  );

  const goTo = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) setCurrentStep(step);
    },
    [totalSteps],
  );

  return {
    currentStep,
    totalSteps,
    next,
    prev,
    goTo,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
  };
}

export { useMultiStep };
