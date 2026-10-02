import { StyleSheet, View } from "react-native";

/** Web: no native splash handoff. */
export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return <View style={styles.iconContainer} />;
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 128,
    height: 128,
  },
});
