import { Platform } from "react-native";

// FCM / Notifee are native-only and must not be required unless linked.
if (Platform.OS !== "web") {
  try {
    const {
      isRnfbNativeAvailable,
      logPushEnvironment,
    } = require("./services/firebase");
    const { pushLog } = require("./services/push-log");

    logPushEnvironment("index.js");

    if (isRnfbNativeAvailable()) {
      const {
        registerBackgroundMessageHandler,
      } = require("./services/push-notifications-background");
      registerBackgroundMessageHandler();

      const { getNotifee } = require("./services/notifee");
      const notifeeModule = getNotifee();
      if (notifeeModule) {
        const { EventType } = notifeeModule;
        notifeeModule.default.onBackgroundEvent(async ({ type }) => {
          pushLog("info", "notifee.background_event", { type });
          if (type === EventType.PRESS) {
            // Navigation is handled on the next launch via getInitialNotification.
          }
        });
        pushLog("info", "notifee.background_events.registered");
      }
    } else {
      pushLog("warn", "index.push_native.skipped", {
        reason: "rnfb_native_unavailable",
        hint: "You opened Expo Go or an old binary. Install the EAS development build, then open THAT app (not Expo Go).",
      });
    }
  } catch (error) {
    console.warn(
      "[push] index.push_native.failed",
      error instanceof Error ? error.message : String(error),
    );
  }
}

import "expo-router/entry";
