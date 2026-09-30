const { withProjectBuildGradle } = require("@expo/config-plugins");

const NOTIFEE_MAVEN =
  'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';

/**
 * Notifee publishes app.notifee:core inside the package, not Maven Central.
 * Gradle 9 resolves :app dependencies before Notifee's build.gradle can
 * register that local repo, so the repo has to live on the root project.
 */
function withNotifeeMaven(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("@notifee/react-native/android/libs")) {
      return config;
    }

    config.modResults.contents = config.modResults.contents.replace(
      /maven\s*\{\s*url\s*'https:\/\/www\.jitpack\.io'\s*\}/,
      `maven { url 'https://www.jitpack.io' }\n    ${NOTIFEE_MAVEN}`,
    );

    return config;
  });
}

module.exports = withNotifeeMaven;
