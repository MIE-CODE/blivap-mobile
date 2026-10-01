import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

function isLocalHost(url: string) {
  return url.includes("://localhost") || url.includes("://127.0.0.1");
}

function replaceLocalHost(url: string, host: string) {
  return url
    .replace("://127.0.0.1", `://${host}`)
    .replace("://localhost", `://${host}`);
}

/** Metro's host is this Mac's LAN address when a phone is connected. */
function packagerHost() {
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (!host || host === "localhost" || host === "127.0.0.1") return null;
  return host;
}

function apiUrlForDevice(url: string | undefined) {
  // Simulator, emulator, and physical phones share the hosted dev API when set.
  if (process.env.EXPO_PUBLIC_DEVICE_API_URL) {
    return process.env.EXPO_PUBLIC_DEVICE_API_URL;
  }

  if (!url || !isLocalHost(url)) return url;

  if (Device.isDevice) {
    const host = packagerHost();
    if (host) return replaceLocalHost(url, host);
  }

  // Android emulator localhost is the emulator, not the Mac running the API.
  if (Platform.OS === "android") return replaceLocalHost(url, "10.0.2.2");
  return url;
}

export const config = {
  apiUrl: apiUrlForDevice(process.env.EXPO_PUBLIC_API_URL),
  env: process.env.EXPO_PUBLIC_APP_ENV,
} as const;

for (const key of Object.keys(config)) {
  if (!config[key as keyof typeof config]) {
    throw new Error(`EXPO_PUBLIC_${key} is not set — check your .env file`);
  }
}
