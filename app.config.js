const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const appJson = require("./app.json");

const config = {
  ...appJson.expo,
  ios: { ...appJson.expo.ios },
  android: { ...appJson.expo.android },
};

const localIosPlist = path.join(__dirname, "GoogleService-Info.plist");
const localAndroidJson = path.join(__dirname, "google-services.json");

// Prefer local files; fall back to EAS file env vars (absolute paths on the build agent).
const iosPlist =
  (fs.existsSync(localIosPlist) && localIosPlist) ||
  process.env.GOOGLE_SERVICES_PLIST ||
  null;

const androidJson =
  (fs.existsSync(localAndroidJson) && localAndroidJson) ||
  process.env.GOOGLE_SERVICES_JSON ||
  null;

if (iosPlist && fs.existsSync(iosPlist)) {
  // Expo expects a project-relative path when possible.
  config.ios.googleServicesFile = path.isAbsolute(iosPlist)
    ? iosPlist
    : "./GoogleService-Info.plist";

  // If EAS provided an absolute path, copy into project root for native plugins.
  if (path.isAbsolute(iosPlist) && iosPlist !== localIosPlist) {
    fs.copyFileSync(iosPlist, localIosPlist);
    config.ios.googleServicesFile = "./GoogleService-Info.plist";
  }
} else {
  console.warn(
    "[config] Missing GoogleService-Info.plist — iOS Firebase/FCM disabled until you add it and rebuild.",
  );
}

if (androidJson && fs.existsSync(androidJson)) {
  config.android.googleServicesFile = path.isAbsolute(androidJson)
    ? androidJson
    : "./google-services.json";

  if (path.isAbsolute(androidJson) && androidJson !== localAndroidJson) {
    fs.copyFileSync(androidJson, localAndroidJson);
    config.android.googleServicesFile = "./google-services.json";
  }
} else {
  console.warn(
    "[config] Missing google-services.json — Android Firebase/FCM disabled until you add it and rebuild.",
  );
}

function plistString(file, key) {
  if (!file || !fs.existsSync(file)) return null;
  try {
    return execFileSync(
      "/usr/bin/plutil",
      ["-extract", key, "raw", "-o", "-", file],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    try {
      const text = fs.readFileSync(file, "utf8");
      const match = text.match(
        new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`),
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}

config.ios.usesAppleSignIn = true;
config.plugins = (config.plugins || []).map((plugin) => {
  if (Array.isArray(plugin) && plugin[0] === "expo-build-properties") {
    const options = plugin[1] || {};
    const ios = options.ios || {};
    const linking = new Set(ios.forceStaticLinking || []);
    linking.add("RNFBAuth");
    return [
      "expo-build-properties",
      {
        ...options,
        ios: { ...ios, forceStaticLinking: [...linking] },
      },
    ];
  }
  return plugin;
});

config.plugins.push("@react-native-firebase/auth");
config.plugins.push("expo-apple-authentication");

const reversedClientId = plistString(
  iosPlist && fs.existsSync(iosPlist) ? iosPlist : localIosPlist,
  "REVERSED_CLIENT_ID",
);
if (reversedClientId) {
  config.plugins.push([
    "@react-native-google-signin/google-signin",
    { iosUrlScheme: reversedClientId },
  ]);
}

const facebookAppId = process.env.FACEBOOK_APP_ID || "";
const facebookClientToken = process.env.FACEBOOK_CLIENT_TOKEN || "";
if (facebookAppId && facebookClientToken) {
  config.plugins.push([
    "react-native-fbsdk-next",
    {
      appID: facebookAppId,
      clientToken: facebookClientToken,
      displayName: "Blivap",
      scheme: `fb${facebookAppId}`,
      advertiserIDCollectionEnabled: false,
      autoLogAppEventsEnabled: false,
      isAutoInitEnabled: true,
    },
  ]);
}

config.extra = {
  ...(config.extra || {}),
  googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || null,
  facebookAppId: facebookAppId || null,
  facebookClientToken: facebookClientToken || null,
};

module.exports = { expo: config };
