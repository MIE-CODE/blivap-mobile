import { OnboardingProvider } from "@/contexts/onboarding-context";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { useRouteProtection } from "@/hooks/use-route-protection";
import { bootstrapAuth } from "../../services/auth-bootstrap";
import { bootstrapOnboarding, completeOnboarding } from "../../services/onboarding-bootstrap";
import { initPushNotificationListeners } from "../../services/push-notifications";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { PropsWithChildren, useCallback, useEffect } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const isAuthInitialized = useAppSelector((state) => state.auth.isInitialized);
  const hasOnboarded = useAppSelector((state) => state.onboarding.hasOnboarded);
  const isOnboardingInitialized = useAppSelector(
    (state) => state.onboarding.isInitialized,
  );

  useEffect(() => {
    async function init() {
      await Promise.all([
        bootstrapAuth(dispatch),
        bootstrapOnboarding(dispatch),
      ]);
    }

    init();
  }, [dispatch]);

  useEffect(() => {
    try {
      console.log("[push] auth_provider.init_listeners");
      return initPushNotificationListeners();
    } catch (error) {
      console.warn("[push] auth_provider.init_listeners.failed", error);
      return () => {};
    }
  }, []);

  const completeOnboardingFlow = useCallback(async () => {
    await completeOnboarding(dispatch);
  }, [dispatch]);

  const isAppReady = isAuthInitialized && isOnboardingInitialized;

  useOnboardingGuard(hasOnboarded, isAppReady);
  useRouteProtection(hasOnboarded, isAppReady);

  if (!isAppReady) {
    return null;
  }

  return (
    <OnboardingProvider completeOnboardingFlow={completeOnboardingFlow}>
      {children}
    </OnboardingProvider>
  );
}
