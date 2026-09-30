import { Platform } from "react-native";

function apiUrlForDevice(url: string | undefined) {
  if (!url || Platform.OS !== "android") return url;
  // Android emulator localhost is the emulator, not the Mac running the API.
  return url
    .replace("://127.0.0.1", "://10.0.2.2")
    .replace("://localhost", "://10.0.2.2");
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
