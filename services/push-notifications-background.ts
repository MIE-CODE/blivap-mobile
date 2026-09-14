import notifee, { AndroidImportance } from "@notifee/react-native";
import {
  getMessaging,
  setBackgroundMessageHandler,
  type RemoteMessage,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "blivap-default";

/**
 * Background/quit FCM handler. Kept free of Expo Router imports so it can
 * register from `index.js` before `expo-router/entry` boots.
 */
async function handleBackgroundMessage(remoteMessage: RemoteMessage) {
  // Notification payloads are already surfaced by the OS.
  if (remoteMessage.notification) return;

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
      },
      ios: { sound: "default" },
    });
  } catch (error) {
    console.warn("[push] background display failed", error);
  }
}

export function registerBackgroundMessageHandler() {
  if (Platform.OS === "web") return;

  setBackgroundMessageHandler(getMessaging(), handleBackgroundMessage);
}
