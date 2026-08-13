/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// CSS is web-only; importing it on native can interfere with startup.
if (Platform.OS === "web") {
  require("@/global.css");
}
export const status = {
  success: "#3EB655",
  info: "#0005F2",
  warning: "#F2C94C",
  danger: "#EB5757",
};

export const Colors = {
  disabled: "#9CA3AF",
  gray: {
    1: "#333333",
    2: "#4F4F4F",
    3: "#828282",
    4: "#BDBDBD",
    5: "#E0E0E0",
  },

  black: {
    1: "#000000",
    2: "#1D1D1D",
    3: "#282828",
  },

  softPrimary: "#B05E5E",

  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    border: "#6B7280",
    primary: "#960018",
    link: "#0005F2",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    border: "#6B7280",
    primary: "#960018",
    link: "#0005F2",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansSemiBold: "Inter_600SemiBold",
    sansBold: "Inter_700Bold",
    heading: "Poppins_600SemiBold",
    headingBold: "Poppins_700Bold",
    mono: "ui-monospace",
  },
  default: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansSemiBold: "Inter_600SemiBold",
    sansBold: "Inter_700Bold",
    heading: "Poppins_600SemiBold",
    headingBold: "Poppins_700Bold",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    sansMedium: "var(--font-display)",
    sansSemiBold: "var(--font-display)",
    sansBold: "var(--font-display)",
    heading: "var(--font-heading)",
    headingBold: "var(--font-heading)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
