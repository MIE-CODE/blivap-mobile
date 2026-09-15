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

module.exports = { expo: config };
