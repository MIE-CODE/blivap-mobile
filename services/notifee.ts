import { pushLog } from "./push-log";

type NotifeeModule = typeof import("@notifee/react-native");

let cached: NotifeeModule | null | undefined;

/**
 * Lazily loads Notifee. Returns null when the native module isn't linked
 * (Expo Go / outdated dev client). Never throws.
 */
export function getNotifee(): NotifeeModule | null {
  if (cached !== undefined) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require("@notifee/react-native") as NotifeeModule;
    pushLog("info", "notifee.available");
    return cached;
  } catch (error) {
    pushLog("warn", "notifee.unavailable", {
      errorMessage:
        error instanceof Error ? error.message : "native_module_missing",
      hint: "Install a custom EAS development build that includes @notifee/react-native (not Expo Go).",
    });
    cached = null;
    return null;
  }
}

export function isNotifeeAvailable(): boolean {
  return getNotifee() !== null;
}
