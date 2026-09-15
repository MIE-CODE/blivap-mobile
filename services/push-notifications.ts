import { Href, router } from "expo-router";
import * as Device from "expo-device";
import { PermissionsAndroid, Platform } from "react-native";
import { PushNotificationData } from "../types/push-notification";
import { getRouteForPushEvent } from "../src/utils/notification-routes";
import { $api } from "./api-client";
import {
  getFirebaseMessagingModule,
  isFirebaseConfigured,
  isRnfbNativeAvailable,
  logPushEnvironment,
} from "./firebase";
import { getNotifee } from "./notifee";
import { maskToken, pushLog, pushLogError, sleep } from "./push-log";

const ANDROID_CHANNEL_ID = "blivap-default";

type RemoteMessage = {
  messageId?: string;
  notification?: { title?: string; body?: string };
  data?: { [key: string]: string | object };
};

let tokenRefreshUnsubscribe: (() => void) | null = null;
let foregroundUnsubscribe: (() => void) | null = null;
let openedAppUnsubscribe: (() => void) | null = null;
let listenersReady = false;

function messagingApi() {
  const messaging = getFirebaseMessagingModule();
  if (!messaging || !isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }
  return messaging;
}

function messagingInstance() {
  const messaging = messagingApi();
  return messaging.getMessaging();
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

  const notifeeModule = getNotifee();
  if (!notifeeModule) {
    pushLog("warn", "android.channel.skipped", { reason: "notifee_unavailable" });
    return;
  }

  await notifeeModule.default.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: "General",
    importance: notifeeModule.AndroidImportance.HIGH,
  });
  pushLog("info", "android.channel.ready", { channelId: ANDROID_CHANNEL_ID });
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    pushLog("warn", "permission.check.skipped", { reason: "firebase_not_configured" });
    return false;
  }

  if (Platform.OS === "android" && Number(Platform.Version) >= 33) {
    const granted =
      (await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )) === true;
    pushLog("info", "permission.check.android", { granted });
    return granted;
  }

  const messaging = messagingApi();
  const status = await messaging.hasPermission(messagingInstance());
  const granted =
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL;
  pushLog("info", "permission.check.ios", { status, granted });
  return granted;
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) {
      pushLog("warn", "permission.request.skipped", {
        reason: "firebase_not_configured",
      });
      return false;
    }

    if (Platform.OS === "android") {
      if (Number(Platform.Version) >= 33) {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (alreadyGranted) {
          pushLog("info", "permission.request.android", {
            result: "already_granted",
          });
          return true;
        }

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        pushLog(granted ? "info" : "warn", "permission.request.android", {
          result,
          granted,
        });
        return granted;
      }
      pushLog("info", "permission.request.android", {
        result: "pre_33_auto_granted",
      });
      return true;
    }

    const messaging = messagingApi();
    const instance = messagingInstance();
    const current = await messaging.hasPermission(instance);
    pushLog("info", "permission.status.before_request", { status: current });

    if (
      current === messaging.AuthorizationStatus.AUTHORIZED ||
      current === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    if (current === messaging.AuthorizationStatus.DENIED) {
      pushLog("warn", "permission.request.ios", {
        result: "previously_denied_no_reprompt",
      });
      return false;
    }

    const next = await messaging.requestPermission(instance);
    const granted =
      next === messaging.AuthorizationStatus.AUTHORIZED ||
      next === messaging.AuthorizationStatus.PROVISIONAL;
    pushLog(granted ? "info" : "warn", "permission.request.ios", {
      status: next,
      granted,
    });
    return granted;
  } catch (error) {
    pushLogError("permission.request.failed", error);
    return false;
  }
}

async function registerTokenWithBackend(fcmToken: string) {
  pushLog("info", "backend.register.start", {
    token: maskToken(fcmToken),
    userAgent: getUserAgent(),
  });

  try {
    const res = await $api.notifications.registerFcmSubscription({
      fcmToken,
      userAgent: getUserAgent(),
    });
    pushLog("info", "backend.register.success", {
      token: maskToken(fcmToken),
      response: res,
    });
  } catch (error) {
    pushLogError("backend.register.failed", error, {
      token: maskToken(fcmToken),
      endpoint: "/notifications/push-subscriptions/fcm",
    });
    throw error;
  }
}

export async function registerForPushNotifications(): Promise<string | null> {
  pushLog("info", "register.start");
  logPushEnvironment("registerForPushNotifications");

  try {
    if (Platform.OS === "web") {
      pushLog("warn", "register.skipped", { reason: "web" });
      return null;
    }

    const rnfbOk = isRnfbNativeAvailable();
    const firebaseOk = isFirebaseConfigured();
    if (!rnfbOk || !firebaseOk) {
      pushLog("warn", "register.skipped", {
        reason: !rnfbOk ? "rnfb_native_unavailable" : "firebase_not_configured",
        rnfbOk,
        firebaseOk,
        hint: "Build/install a custom dev client with GoogleService-Info.plist baked in.",
      });
      return null;
    }

    const messaging = messagingApi();
    const instance = messagingInstance();

    const granted = await requestNotificationPermission();
    if (!granted) {
      pushLog("warn", "register.aborted", { reason: "permission_denied" });
      return null;
    }

    // Auto-registration is enabled by default — do not call
    // registerDeviceForRemoteMessages(); it warns and can throw.

    if (Platform.OS === "ios") {
      const isPhysicalDevice = Device.isDevice;
      pushLog("info", "register.ios_environment", {
        isPhysicalDevice,
        deviceName: Device.deviceName,
        modelName: Device.modelName,
      });

      if (!isPhysicalDevice) {
        pushLog("warn", "register.aborted", {
          reason: "ios_simulator",
          hint: "FCM needs APNs. Use a physical iPhone running your EAS development build (not Expo Go, not Simulator).",
        });
        return null;
      }

      // FCM getToken() needs an APNs token first on iOS.
      let apnsToken: string | null = null;
      for (let attempt = 1; attempt <= 6; attempt++) {
        try {
          apnsToken = await messaging.getAPNSToken(instance);
        } catch (error) {
          pushLog("warn", "register.apns_token.poll_error", {
            attempt,
            errorMessage:
              error instanceof Error ? error.message : String(error ?? "null"),
          });
        }

        pushLog("info", "register.apns_token.poll", {
          attempt,
          apnsToken: maskToken(apnsToken),
        });

        if (apnsToken) break;
        await sleep(1000);
      }

      if (!apnsToken) {
        pushLog("warn", "register.aborted", {
          reason: "no_apns_token",
          isPhysicalDevice,
          hint: "Upload an APNs Auth Key (.p8) in Firebase → Project settings → Cloud Messaging, enable Push Notifications capability, and rebuild the dev client.",
        });
        return null;
      }
    }

    pushLog("info", "register.get_token.start");
    let fcmToken: string | null = null;
    try {
      fcmToken = await messaging.getToken(instance);
    } catch (error) {
      pushLogError("register.get_token.failed", error, {
        isPhysicalDevice: Device.isDevice,
        hint: "Usually means APNs is missing/misconfigured, or you're on a simulator.",
      });
      throw error;
    }

    if (!fcmToken) {
      pushLog("warn", "register.aborted", { reason: "empty_fcm_token" });
      return null;
    }
    pushLog("info", "register.get_token.success", {
      token: maskToken(fcmToken),
    });

    await registerTokenWithBackend(fcmToken);
    ensureTokenRefreshListener();

    pushLog("info", "register.complete", { token: maskToken(fcmToken) });
    return fcmToken;
  } catch (error) {
    pushLogError("register.failed", error);
    return null;
  }
}

function ensureTokenRefreshListener() {
  if (tokenRefreshUnsubscribe || !isFirebaseConfigured()) return;

  const messaging = messagingApi();
  tokenRefreshUnsubscribe = messaging.onTokenRefresh(
    messagingInstance(),
    async (token) => {
      pushLog("info", "token.refresh", { token: maskToken(token) });
      try {
        await registerTokenWithBackend(token);
      } catch (error) {
        pushLogError("token.refresh.backend_failed", error);
      }
    },
  );
  pushLog("info", "token.refresh.listener_attached");
}

export async function displayForegroundNotification(
  remoteMessage: RemoteMessage,
) {
  const notifeeModule = getNotifee();
  if (!notifeeModule) {
    pushLog("warn", "foreground.display.skipped", {
      reason: "notifee_unavailable",
      messageId: remoteMessage.messageId,
    });
    return;
  }

  try {
    await ensureAndroidChannel();
    const { title, body } = getPresentation(remoteMessage);
    const data = asData(remoteMessage);

    const notifeeData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") notifeeData[key] = value;
    }

    pushLog("info", "foreground.display.start", {
      messageId: remoteMessage.messageId,
      title,
      body,
      event: data.event,
    });

    await notifeeModule.default.displayNotification({
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
    pushLog("info", "foreground.display.success", {
      messageId: remoteMessage.messageId,
    });
  } catch (error) {
    pushLogError("foreground.display.failed", error, {
      messageId: remoteMessage.messageId,
    });
  }
}

function navigateFromData(data: PushNotificationData) {
  try {
    const href = getRouteForPushEvent(data.event, data);
    pushLog("info", "navigate", { event: data.event, href, data });
    router.push(href as Href);
  } catch (error) {
    pushLogError("navigate.failed", error, { data });
  }
}

export function initPushNotificationListeners() {
  logPushEnvironment("initPushNotificationListeners");

  if (Platform.OS === "web" || listenersReady) {
    pushLog("info", "listeners.skipped", {
      reason: Platform.OS === "web" ? "web" : "already_ready",
    });
    return () => {};
  }

  if (!isRnfbNativeAvailable() || !isFirebaseConfigured()) {
    pushLog("warn", "listeners.skipped", {
      reason: !isRnfbNativeAvailable()
        ? "rnfb_native_unavailable"
        : "firebase_not_configured",
    });
    return () => {};
  }

  const messaging = messagingApi();
  const instance = messagingInstance();

  listenersReady = true;
  ensureTokenRefreshListener();

  foregroundUnsubscribe = messaging.onMessage(instance, async (remoteMessage) => {
    pushLog("info", "message.foreground", {
      messageId: remoteMessage.messageId,
      hasNotification: !!remoteMessage.notification,
      data: asData(remoteMessage),
    });
    await displayForegroundNotification(remoteMessage);
  });

  openedAppUnsubscribe = messaging.onNotificationOpenedApp(
    instance,
    (remoteMessage) => {
      pushLog("info", "message.opened_from_background", {
        messageId: remoteMessage.messageId,
        data: asData(remoteMessage),
      });
      navigateFromData(asData(remoteMessage));
    },
  );

  messaging
    .getInitialNotification(instance)
    .then((remoteMessage) => {
      if (remoteMessage) {
        pushLog("info", "message.opened_from_quit", {
          messageId: remoteMessage.messageId,
          data: asData(remoteMessage),
        });
        navigateFromData(asData(remoteMessage));
      } else {
        pushLog("info", "message.no_initial_notification");
      }
    })
    .catch((error) => {
      pushLogError("message.get_initial_failed", error);
    });

  const notifeeModule = getNotifee();
  let notifeeUnsubscribe: (() => void) | undefined;

  if (notifeeModule) {
    const { EventType } = notifeeModule;

    notifeeModule.default
      .getInitialNotification()
      .then((initial) => {
        if (initial?.notification?.data) {
          pushLog("info", "notifee.opened_from_quit", {
            data: initial.notification.data,
          });
          navigateFromData(
            initial.notification.data as PushNotificationData,
          );
        }
      })
      .catch((error) => {
        pushLogError("notifee.get_initial_failed", error);
      });

    notifeeUnsubscribe = notifeeModule.default.onForegroundEvent(
      ({ type, detail }) => {
        pushLog("info", "notifee.foreground_event", {
          type,
          data: detail.notification?.data,
        });
        if (type !== EventType.PRESS) return;
        const data = (detail.notification?.data ??
          {}) as PushNotificationData;
        navigateFromData(data);
      },
    );
  } else {
    pushLog("warn", "listeners.notifee_skipped");
  }

  pushLog("info", "listeners.ready");

  return () => {
    foregroundUnsubscribe?.();
    openedAppUnsubscribe?.();
    notifeeUnsubscribe?.();
    foregroundUnsubscribe = null;
    openedAppUnsubscribe = null;
    listenersReady = false;
    pushLog("info", "listeners.torn_down");
  };
}
