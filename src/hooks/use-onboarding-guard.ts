import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useLayoutEffect } from "react";

function isOnIndexRoute(segments: string[]) {
  return segments.length === 0;
}

export function useOnboardingGuard(
  hasOnboarded: boolean,
  isReady: boolean,
) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useLayoutEffect(() => {
    if (!isReady || !navigationState?.key) return;
    if (hasOnboarded) return;

    if (!isOnIndexRoute(segments)) {
      router.replace("/");
    }
  }, [hasOnboarded, isReady, navigationState?.key, router, segments]);
}
