import { AppDispatch } from "../stores";
import {
  setHasOnboarded,
  setOnboardingInitialized,
} from "../stores/onboarding.slice";
import { getHasOnboarded, setHasOnboarded as persistHasOnboarded } from "./onboarding-storage";

export async function bootstrapOnboarding(dispatch: AppDispatch) {
  try {
    const hasOnboarded = await getHasOnboarded();
    dispatch(setHasOnboarded(hasOnboarded));
  } catch {
    dispatch(setHasOnboarded(false));
  } finally {
    dispatch(setOnboardingInitialized());
  }
}

export async function completeOnboarding(dispatch: AppDispatch) {
  await persistHasOnboarded();
  dispatch(setHasOnboarded(true));
}
