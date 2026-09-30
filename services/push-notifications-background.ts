import { Platform } from "react-native";
import { getFirebaseMessagingModule, isFirebaseConfigured } from "./firebase";

/** PNG of https://blivap.com/bimi/blivap-bimi.svg. Android cannot render the SVG. */
const PUSH_NOTIFICATION_IMAGE_URL = "https://blivap.com/icon1.png";
import { getNotifee } from "./notifee";
import { pushLog, pushLogError } from "./push-log";

const ANDROID_CHANNEL_ID = "blivap-default";

type RemoteMessage = {
  messageId?: string;
  notification?: { title?: string; body?: string };
  data?: { [key: string]: string | object };
};

/**
 * Background/quit FCM handler. Kept free of Expo Router imports so it can
 * register from `index.js` before `expo-router/entry` boots.
 */
async function handleBackgroundMessage(remoteMessage: RemoteMessage) {
  pushLog("info", "message.background", {
    messageId: remoteMessage.messageId,
    hasNotification: !!remoteMessage.notification,
    data: remoteMessage.data ?? {},
  });

  if (remoteMessage.notification) {
    pushLog("info", "message.background.os_will_display");
    return;
  }

  const notifeeModule = getNotifee();
  if (!notifeeModule) {
    pushLog("warn", "message.background.display_skipped", {
      reason: "notifee_unavailable",
    });
    return;
  }

  const notifee = notifeeModule.default;
  const { AndroidImportance } = notifeeModule;

  try {
    if (Platform.OS === "android") {
      await notifee.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: "General",
        importance: AndroidImportance.HIGH,
      });
    }

    const data = remoteMessage.data ?? {};
    const title =
      (typeof data.title === "string" && data.title) || "Blivap";
    const body =
      (typeof data.body === "string" && data.body) ||
      (typeof data.message === "string" && data.message) ||
      "";

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
        largeIcon:
          (typeof data.image === "string" && data.image) ||
          PUSH_NOTIFICATION_IMAGE_URL,
      },
      ios: {
        sound: "default",
        attachments: [
          {
            url:
              (typeof data.image === "string" && data.image) ||
              PUSH_NOTIFICATION_IMAGE_URL,
          },
        ],
      },
    });
    pushLog("info", "message.background.display_success", {
      messageId: remoteMessage.messageId,
      title,
    });
  } catch (error) {
    pushLogError("message.background.display_failed", error);
  }
}

export function registerBackgroundMessageHandler() {
  if (Platform.OS === "web") return;

  const messaging = getFirebaseMessagingModule();
  if (!messaging || !isFirebaseConfigured()) {
    pushLog("warn", "background_handler.skipped", {
      reason: !messaging ? "messaging_unavailable" : "firebase_not_configured",
    });
    return;
  }

  messaging.setBackgroundMessageHandler(
    messaging.getMessaging(),
    handleBackgroundMessage,
  );
  pushLog("info", "background_handler.registered");
}
