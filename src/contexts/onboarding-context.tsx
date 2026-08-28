import { createContext, PropsWithChildren, useContext } from "react";

type OnboardingContextValue = {
  completeOnboardingFlow: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({
  children,
  completeOnboardingFlow,
}: PropsWithChildren<OnboardingContextValue>) {
  return (
    <OnboardingContext.Provider value={{ completeOnboardingFlow }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
