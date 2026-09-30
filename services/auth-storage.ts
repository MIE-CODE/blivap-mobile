import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const AUTH_TOKEN_KEY = "blivap_auth_token";

let memoryToken: string | null = null;

async function readPersistedToken() {
  if (Platform.OS === "web") {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

async function writePersistedToken(token: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return;
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

async function deletePersistedToken() {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export async function saveAuthToken(token: string) {
  memoryToken = token;
  await writePersistedToken(token);
}

export async function getAuthToken() {
  if (memoryToken) return memoryToken;

  const stored = await readPersistedToken();
  memoryToken = stored;
  return stored;
}

export async function clearAuthToken() {
  memoryToken = null;
  await deletePersistedToken();
}
