import { Platform } from "react-native";

const AUTH_TOKEN_KEY = "blivap_auth_token";

let memoryToken: string | null = null;

export async function saveAuthToken(token: string) {
  memoryToken = token;

  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export async function getAuthToken() {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY) ?? memoryToken;
  }

  return memoryToken;
}

export async function clearAuthToken() {
  memoryToken = null;

  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
