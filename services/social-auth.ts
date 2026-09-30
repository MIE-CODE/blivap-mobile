import Constants from "expo-constants";
import { Platform } from "react-native";

export type SocialProvider = "google" | "apple" | "facebook";

type ExpoExtra = {
  googleWebClientId?: string | null;
  facebookAppId?: string | null;
};

function extra(): ExpoExtra {
  return (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
}

function firebaseAuth() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-firebase/auth").default as typeof import("@react-native-firebase/auth").default;
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
  if (!webClientId) {
    throw new Error(
      "Google sign-in is not configured. Set GOOGLE_WEB_CLIENT_ID and rebuild the app.",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleSignin } = require("@react-native-google-signin/google-signin") as typeof import("@react-native-google-signin/google-signin");
  GoogleSignin.configure({ webClientId });
  if (Platform.OS === "android") {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (response && typeof response === "object" && "type" in response) {
    if (response.type === "cancelled") {
      throw cancelled("SIGN_IN_CANCELLED");
    }
  }

  const idToken =
    (response &&
      typeof response === "object" &&
      "data" in response &&
      response.data &&
      typeof response.data === "object" &&
      "idToken" in response.data &&
      response.data.idToken) ||
    (response &&
      typeof response === "object" &&
      "idToken" in response &&
      response.idToken) ||
    null;

  if (!idToken || typeof idToken !== "string") {
    throw new Error("Google did not return a sign-in token");
  }

  const auth = firebaseAuth();
  const credential = auth.GoogleAuthProvider.credential(idToken);
  const signedIn = await auth().signInWithCredential(credential);
  return signedIn.user.getIdToken();
}

async function appleIdToken(): Promise<string> {
  if (Platform.OS !== "ios") {
    throw new Error("Apple sign-in is available on iPhone");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AppleAuthentication = require("expo-apple-authentication") as typeof import("expo-apple-authentication");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Crypto = require("expo-crypto") as typeof import("expo-crypto");

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

  const auth = firebaseAuth();
  const credential = auth.AppleAuthProvider.credential(
    apple.identityToken,
    rawNonce,
  );
  const signedIn = await auth().signInWithCredential(credential);
  return signedIn.user.getIdToken();
}

async function facebookIdToken(): Promise<string> {
  if (!extra().facebookAppId) {
    throw new Error(
      "Facebook sign-in is not configured. Set FACEBOOK_APP_ID and FACEBOOK_CLIENT_TOKEN, then rebuild the app.",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AccessToken, LoginManager } = require("react-native-fbsdk-next") as typeof import("react-native-fbsdk-next");
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

  const auth = firebaseAuth();
  const credential = auth.FacebookAuthProvider.credential(current.accessToken);
  const signedIn = await auth().signInWithCredential(credential);
  return signedIn.user.getIdToken();
}

export async function firebaseIdToken(provider: SocialProvider): Promise<string> {
  if (provider === "google") return googleIdToken();
  if (provider === "apple") return appleIdToken();
  return facebookIdToken();
}
