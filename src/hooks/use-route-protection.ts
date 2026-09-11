import { useAppSelector } from "../../stores/hooks";
import {
  AUTH_ENTRY_SCREENS,
  AUTH_ONBOARDING_SCREENS,
  getPostAuthRoute,
} from "@/utils/auth-routes";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const PROTECTED_AUTH_SCREENS = new Set(["verify-otp", "avatar"]);

export function useRouteProtection(
  hasOnboarded: boolean,
  onboardingReady: boolean,
) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isInitialized || !onboardingReady || !navigationState?.key) return;

    if (!hasOnboarded) return;

    const rootSegment = segments[0];
    const authScreen = segments[1];
    const inAuthGroup = rootSegment === "(auth)";
    const inDashboard = rootSegment === "(dashboard)";
    const onWelcome = !rootSegment;

    if (!isAuthenticated) {
      const needsAuth =
        inDashboard ||
        (inAuthGroup && PROTECTED_AUTH_SCREENS.has(authScreen ?? ""));

      if (needsAuth) {
        router.replace("/login");
      }
      return;
    }

    if (!user) return;

    if (!user.emailVerified) {
      if (!(inAuthGroup && authScreen === "verify-otp")) {
        router.replace("/verify-otp");
      }
      return;
    }

    if (!user.profileImage) {
      if (!(inAuthGroup && authScreen === "avatar")) {
        router.replace("/avatar");
      }
      return;
    }

    if (onWelcome) {
      router.replace("/home");
      return;
    }

    if (
      inAuthGroup &&
      (AUTH_ONBOARDING_SCREENS.has(authScreen ?? "") ||
        AUTH_ENTRY_SCREENS.has(authScreen ?? ""))
    ) {
      router.replace(getPostAuthRoute(user));
    }
  }, [
    hasOnboarded,
    isAuthenticated,
    isInitialized,
    navigationState?.key,
    onboardingReady,
    router,
    segments,
    user,
  ]);
}
