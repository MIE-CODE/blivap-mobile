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
    background: "#F9FAFB",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    textAccent: "#960018",
    border: "#6B7280",
    primary: "#960018",
    link: "#0005F2",
    shadow: "#000000",
    card: "#FFFFFF",
    tint: "#FFF1F1",
    muted: "#F3F4F6",
    hairline: "#E5E7EB",
    skeleton: { base: "#e2e2e2", shimmer: "#f5f5f5" },
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    textAccent: "#D64550",
    border: "#6B7280",
    primary: "#960018",
    link: "#9AA4FF",
    shadow: "#000000",
    card: "#1C1C1E",
    tint: "#3A1A1E",
    muted: "#2C2C2E",
    hairline: "#3A3A3C",
    skeleton: { base: "#2a2a2a", shimmer: "#3d3d3d" },
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Loaded PostScript names from @expo-google-fonts (use these as fontFamily). */
export const Fonts = {
  poppins: {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semiBold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
  },
  inter: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  /** Default body/UI stack — Poppins */
  sans: "Poppins_400Regular",
  sansMedium: "Poppins_500Medium",
  sansSemiBold: "Poppins_600SemiBold",
  sansBold: "Poppins_700Bold",
  heading: "Poppins_600SemiBold",
  headingBold: "Poppins_700Bold",
  mono: Platform.select({ ios: "ui-monospace", default: "monospace" })!,
} as const;

export type FontFamily =
  | (typeof Fonts.poppins)[keyof typeof Fonts.poppins]
  | (typeof Fonts.inter)[keyof typeof Fonts.inter]
  | typeof Fonts.mono;

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
