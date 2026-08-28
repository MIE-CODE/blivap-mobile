import { Platform } from "react-native";

const memoryStore = new Map<string, string>();

export async function getPersistentItem(key: string) {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    const value = localStorage.getItem(key);
    if (value) {
      memoryStore.set(key, value);
    }
    return value;
  }

  return memoryStore.get(key) ?? null;
}

export async function setPersistentItem(key: string, value: string) {
  memoryStore.set(key, value);

  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export async function removePersistentItem(key: string) {
  memoryStore.delete(key);

  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
  }
}
