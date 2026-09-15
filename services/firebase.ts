import { NativeModules, Platform, TurboModuleRegistry } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { pushLog } from "./push-log";

type FirebaseAppModule = typeof import("@react-native-firebase/app");
type FirebaseMessagingModule = typeof import("@react-native-firebase/messaging");

let appModule: FirebaseAppModule | null | undefined;
let messagingModule: FirebaseMessagingModule | null | undefined;
let diagnosticsLogged = false;

/**
 * True when the React Native Firebase native TurboModule is linked into
 * the current binary (custom dev client / production build).
 * False in Expo Go and outdated binaries.
 */
export function isRnfbNativeAvailable(): boolean {
  if (Platform.OS === "web") return false;

  try {
    return (
      TurboModuleRegistry.get("NativeRNFBTurboApp") != null ||
      NativeModules.RNFBAppModule != null
    );
  } catch {
    return false;
  }
}

export function getFirebaseAppModule(): FirebaseAppModule | null {
  if (appModule !== undefined) return appModule;
  if (!isRnfbNativeAvailable()) {
    appModule = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    appModule = require("@react-native-firebase/app") as FirebaseAppModule;
    return appModule;
  } catch (error) {
    pushLog("warn", "firebase.app.require_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    appModule = null;
    return null;
  }
}

export function getFirebaseMessagingModule(): FirebaseMessagingModule | null {
  if (messagingModule !== undefined) return messagingModule;
  if (!isRnfbNativeAvailable()) {
    messagingModule = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    messagingModule =
      require("@react-native-firebase/messaging") as FirebaseMessagingModule;
    return messagingModule;
  } catch (error) {
    pushLog("warn", "firebase.messaging.require_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    messagingModule = null;
    return null;
  }
}

/**
 * Native Firebase is configured when RNFB is linked AND a default app exists
 * (GoogleService-Info.plist / google-services.json present at build time).
 */
export function isFirebaseConfigured(): boolean {
  const app = getFirebaseAppModule();
  if (!app) return false;

  try {
    return app.getApps().length > 0;
  } catch {
    return false;
  }
}

/**
 * One-shot environment dump so Metro shows why push is enabled/disabled.
 */
export function logPushEnvironment(reason: string) {
  if (diagnosticsLogged && reason !== "force") return;
  diagnosticsLogged = true;

  const rnfbAvailable = isRnfbNativeAvailable();
  let appCount = 0;
  let configured = false;

  if (rnfbAvailable) {
    try {
      const app = getFirebaseAppModule();
      appCount = app?.getApps().length ?? 0;
      configured = appCount > 0;
    } catch (error) {
      pushLog("warn", "diagnostics.getApps_failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  pushLog("info", "diagnostics", {
    reason,
    platform: Platform.OS,
    platformVersion: String(Platform.Version),
    appOwnership: Constants.appOwnership,
    executionEnvironment: Constants.executionEnvironment,
    isDevice: Device.isDevice,
    deviceName: Device.deviceName,
    modelName: Device.modelName,
    expoConfigExtra: Constants.expoConfig?.extra ?? null,
    bundleId:
      Constants.expoConfig?.ios?.bundleIdentifier ??
      Constants.expoConfig?.android?.package ??
      null,
    rnfbNativeAvailable: rnfbAvailable,
    turboModulePresent:
      Platform.OS !== "web"
        ? TurboModuleRegistry.get("NativeRNFBTurboApp") != null
        : false,
    legacyModulePresent:
      Platform.OS !== "web" ? NativeModules.RNFBAppModule != null : false,
    firebaseAppCount: appCount,
    firebaseConfigured: configured,
    nextSteps: !rnfbAvailable
      ? "Install a custom EAS development build that includes @react-native-firebase + Notifee (not Expo Go)."
      : !configured
        ? "Rebuild after adding GoogleService-Info.plist / google-services.json so FirebaseApp.configure() runs."
        : "Native Firebase looks ready — check permission + token registration logs next.",
  });
}
