import Constants from "expo-constants";
import { Platform } from "react-native";

import type { AuthCredential } from "@react-native-firebase/auth";

export type SocialProvider = "google" | "apple" | "facebook";

type ExpoExtra = {
  googleWebClientId?: string | null;
  facebookAppId?: string | null;
  facebookClientToken?: string | null;
};

type AuthModule = typeof import("@react-native-firebase/auth");

function extra(): ExpoExtra {
  return (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
}

/** Expo can deliver a missing extra value as `{}`, which is truthy. */
function configured(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function authModule(): AuthModule {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-firebase/auth") as AuthModule;
}

async function blivapIdToken(credential: AuthCredential): Promise<string> {
  const auth = authModule();
  const signedIn = await auth.signInWithCredential(auth.getAuth(), credential);
  return auth.getIdToken(signedIn.user);
}

function cancelled(code: string): Error {
  const error = new Error("cancelled");
  return Object.assign(error, { code });
}

export function isSocialCancelled(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: string }).code) : "";
  return (
    code === "SIGN_IN_CANCELLED" ||
    code === "ERR_REQUEST_CANCELED" ||
    code === "ERR_CANCELED" ||
    (error instanceof Error && error.message === "cancelled")
  );
}

async function googleIdToken(): Promise<string> {
  const webClientId = extra().googleWebClientId;
  if (!configured(webClientId)) {
    throw new Error(
      "Google sign-in is not configured. Set GOOGLE_WEB_CLIENT_ID and restart the app.",
    );
  }

  const { GoogleSignin } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@react-native-google-signin/google-signin") as typeof import("@react-native-google-signin/google-signin");
  GoogleSignin.configure({ webClientId });
  if (Platform.OS === "android") {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (response.type === "cancelled" || !response.data?.idToken) {
    if (response.type === "cancelled") {
      throw cancelled("SIGN_IN_CANCELLED");
    }
    throw new Error("Google did not return a sign-in token");
  }

  const auth = authModule();
  return blivapIdToken(auth.GoogleAuthProvider.credential(response.data.idToken));
}

async function appleIdToken(): Promise<string> {
  if (Platform.OS !== "ios") {
    throw new Error("Apple sign-in is available on iPhone");
  }

  const AppleAuthentication =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("expo-apple-authentication") as typeof import("expo-apple-authentication");
  const Crypto =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("expo-crypto") as typeof import("expo-crypto");

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error("Apple sign-in is not available on this device");
  }

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );
  const apple = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });
  if (!apple.identityToken) {
    throw new Error("Apple did not return a sign-in token");
  }

  const auth = authModule();
  const credential = auth.AppleAuthProvider.credential(
    apple.identityToken,
    rawNonce,
    apple.fullName ?? undefined,
  );
  return blivapIdToken(credential);
}

async function facebookIdToken(): Promise<string> {
  const appId = extra().facebookAppId;
  const clientToken = extra().facebookClientToken;
  if (!configured(appId) || !configured(clientToken)) {
    throw new Error(
      "Facebook sign-in is not configured. Set FACEBOOK_APP_ID and FACEBOOK_CLIENT_TOKEN, then rebuild the app.",
    );
  }

  const { NativeModules } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react-native") as typeof import("react-native");
  const settings = NativeModules.FBSettings;
  if (!settings) {
    throw new Error(
      "Facebook sign-in is not in this build. Set FACEBOOK_APP_ID and FACEBOOK_CLIENT_TOKEN, then rebuild the app.",
    );
  }
  // The package entry loads AccessToken immediately, and that native module
  // throws unless the SDK is already initialized.
  await settings.setAppID(appId);
  await settings.setClientToken(clientToken);
  await settings.initializeSDK();

  const LoginManager =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react-native-fbsdk-next/lib/module/FBLoginManager").default as typeof import("react-native-fbsdk-next").LoginManager;
  const AccessToken =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react-native-fbsdk-next/lib/module/FBAccessToken").default as typeof import("react-native-fbsdk-next").AccessToken;
  const result = await LoginManager.logInWithPermissions([
    "public_profile",
    "email",
  ]);
  if (result.isCancelled) {
    throw cancelled("ERR_CANCELED");
  }

  const current = await AccessToken.getCurrentAccessToken();
  if (!current?.accessToken) {
    throw new Error("Facebook did not return a sign-in token");
  }

  const auth = authModule();
  return blivapIdToken(
    auth.FacebookAuthProvider.credential(current.accessToken),
  );
}

export async function firebaseIdToken(
  provider: SocialProvider,
): Promise<string> {
  if (provider === "google") return googleIdToken();
  if (provider === "apple") return appleIdToken();
  return facebookIdToken();
}
