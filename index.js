import { Platform } from "react-native";

// FCM / Notifee are native-only. Skip on web so Expo web can boot.
if (Platform.OS !== "web") {
  const notifee = require("@notifee/react-native").default;
  const { EventType } = require("@notifee/react-native");
  const {
    registerBackgroundMessageHandler,
  } = require("./services/push-notifications-background");

  // Must run before Expo Router mounts so FCM can wake a quit/background app.
  registerBackgroundMessageHandler();

  // Keep the JS context alive for Notifee presses on data-only notifications.
  notifee.onBackgroundEvent(async ({ type }) => {
    if (type === EventType.PRESS) {
      // Navigation is handled on the next launch via getInitialNotification.
    }
  });
}

import "expo-router/entry";
