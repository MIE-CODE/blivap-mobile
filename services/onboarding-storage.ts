import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "blivap_has_onboarded";

export async function getHasOnboarded() {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === "true";
}

export async function setHasOnboarded() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}
