import AsyncStorage from "@react-native-async-storage/async-storage";

const BRIEFING_KEY_PREFIX = "blivap_has_seen_briefing";

function getBriefingKey(userId: string) {
  return `${BRIEFING_KEY_PREFIX}_${userId}`;
}

export async function getHasSeenBriefing(userId: string) {
  const value = await AsyncStorage.getItem(getBriefingKey(userId));
  return value === "true";
}

export async function setHasSeenBriefing(userId: string) {
  await AsyncStorage.setItem(getBriefingKey(userId), "true");
}
