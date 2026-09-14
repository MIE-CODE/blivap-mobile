import notifee, {
  AndroidImportance,
  EventType,
  type Event as NotifeeEvent,
} from "@notifee/react-native";
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
  type RemoteMessage,
} from "@react-native-firebase/messaging";
import { Href, router } from "expo-router";
import { PermissionsAndroid, Platform } from "react-native";
import { PushNotificationData } from "../types/push-notification";
import { getRouteForPushEvent } from "../src/utils/notification-routes";
import { $api } from "./api-client";

const ANDROID_CHANNEL_ID = "blivap-default";

let tokenRefreshUnsubscribe: (() => void) | null = null;
let foregroundUnsubscribe: (() => void) | null = null;
let openedAppUnsubscribe: (() => void) | null = null;
let listenersReady = false;

function messaging() {
  return getMessaging();
}

function getUserAgent() {
  return `${Platform.OS} ${Platform.Version}`;
}

function asData(remoteMessage: RemoteMessage): PushNotificationData {
  const data = remoteMessage.data ?? {};
  const normalized: PushNotificationData = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      normalized[key] = value;
    }
  }

  return normalized;
}

function getPresentation(remoteMessage: RemoteMessage): {
  title: string;
  body: string;
} {
  const data = asData(remoteMessage);
  const title =
    remoteMessage.notification?.title ?? data.title ?? "Blivap";
  const body =
    remoteMessage.notification?.body ??
    data.body ??
    data.message ??
    "";

  return { title, body };
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: "General",
    importance: AndroidImportance.HIGH,
  });
}

/**
 * Returns true when notifications are already authorized.
 * Does not prompt the user.
 */
export async function hasNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android" && Number(Platform.Version) >= 33) {
    return (
      (await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )) === true
    );
  }

  const status = await hasPermission(messaging());
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Requests notification permission only when not already decided/denied.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      if (Number(Platform.Version) >= 33) {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (alreadyGranted) return true;

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }

    const current = await hasPermission(messaging());
    if (
      current === AuthorizationStatus.AUTHORIZED ||
      current === AuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    // Don't re-prompt after an explicit denial.
    if (current === AuthorizationStatus.DENIED) {
      return false;
    }

    const next = await requestPermission(messaging());
    return (
      next === AuthorizationStatus.AUTHORIZED ||
      next === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.warn("[push] permission request failed", error);
    return false;
  }
}

async function registerTokenWithBackend(fcmToken: string) {
  await $api.notifications.registerFcmSubscription({
    fcmToken,
    userAgent: getUserAgent(),
  });
}

/**
 * Requests permission (if needed), fetches the raw FCM token,
 * and upserts it with the backend. Failures are logged, never thrown.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (Platform.OS === "web") return null;

    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn("[push] notification permission not granted");
      return null;
    }

    // Required on iOS before getToken().
    if (Platform.OS === "ios") {
      await registerDeviceForRemoteMessages(messaging());
    }

    const fcmToken = await getToken(messaging());
    if (!fcmToken) {
      console.warn("[push] empty FCM token");
      return null;
    }

    await registerTokenWithBackend(fcmToken);
    ensureTokenRefreshListener();

    return fcmToken;
  } catch (error) {
    console.warn("[push] registration failed", error);
    return null;
  }
}

function ensureTokenRefreshListener() {
  if (tokenRefreshUnsubscribe) return;

  tokenRefreshUnsubscribe = onTokenRefresh(messaging(), async (token) => {
    try {
      await registerTokenWithBackend(token);
    } catch (error) {
      console.warn("[push] token refresh re-register failed", error);
    }
  });
}

export async function displayForegroundNotification(
  remoteMessage: RemoteMessage,
) {
  try {
    await ensureAndroidChannel();
    const { title, body } = getPresentation(remoteMessage);
    const data = asData(remoteMessage);

    const notifeeData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") notifeeData[key] = value;
    }

    await notifee.displayNotification({
      title,
      body,
      data: notifeeData,
      android: {
        channelId: ANDROID_CHANNEL_ID,
        pressAction: { id: "default" },
      },
      ios: {
        sound: "default",
      },
    });
  } catch (error) {
    console.warn("[push] foreground display failed", error);
  }
}

function navigateFromData(data: PushNotificationData) {
  try {
    const href = getRouteForPushEvent(data.event, data);
    router.push(href as Href);
  } catch (error) {
    console.warn("[push] navigation failed", error);
  }
}

/**
 * Background/quit handler lives in `push-notifications-background.ts`
 * and is registered from root `index.js` (before Expo Router boots).
 */

/**
 * Sets up foreground message display + notification-open navigation.
 * Safe to call multiple times; listeners are only attached once.
 */
export function initPushNotificationListeners() {
  if (Platform.OS === "web" || listenersReady) return () => {};

  listenersReady = true;
  ensureTokenRefreshListener();

  foregroundUnsubscribe = onMessage(messaging(), async (remoteMessage) => {
    await displayForegroundNotification(remoteMessage);
  });

  openedAppUnsubscribe = onNotificationOpenedApp(
    messaging(),
    (remoteMessage) => {
      navigateFromData(asData(remoteMessage));
    },
  );

  // Cold start from a notification tap (FCM).
  getInitialNotification(messaging())
    .then((remoteMessage) => {
      if (remoteMessage) {
        navigateFromData(asData(remoteMessage));
      }
    })
    .catch((error) => {
      console.warn("[push] getInitialNotification failed", error);
    });

  // Cold start from a Notifee-displayed notification tap.
  notifee
    .getInitialNotification()
    .then((initial) => {
      if (initial?.notification?.data) {
        navigateFromData(initial.notification.data as PushNotificationData);
      }
    })
    .catch((error) => {
      console.warn("[push] notifee getInitialNotification failed", error);
    });

  // Notifee foreground press (local notifications shown while app is open).
  const notifeeUnsubscribe = notifee.onForegroundEvent(
    ({ type, detail }: NotifeeEvent) => {
      if (type !== EventType.PRESS) return;
      const data = (detail.notification?.data ?? {}) as PushNotificationData;
      navigateFromData(data);
    },
  );

  return () => {
    foregroundUnsubscribe?.();
    openedAppUnsubscribe?.();
    notifeeUnsubscribe();
    foregroundUnsubscribe = null;
    openedAppUnsubscribe = null;
    listenersReady = false;
  };
}
