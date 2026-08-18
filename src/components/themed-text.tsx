import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code"
    | "xSmall"
    | "xSmallBold"
    | "xSmallMedium"
    | "xSmallSemiBold";
  themeColor?: ThemeColor;
  /** Override default Poppins — e.g. `Fonts.inter.medium` */
  fontFamily?: string;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  fontFamily,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        styles.base,
        { color: theme[themeColor ?? "text"] },
        type === "xSmall" && styles.xSmall,
        type === "xSmallBold" && styles.xSmallBold,
        type === "xSmallMedium" && styles.xSmallMedium,
        type === "xSmallSemiBold" && styles.xSmallSemiBold,
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        fontFamily ? { fontFamily } : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Default app typeface — Poppins. Specific weights use matching font files
  // (don't rely on fontWeight alone with custom fonts on native).
  base: {
    fontFamily: Fonts.poppins.regular,
  },
  xSmall: {
    fontSize: 12,
    lineHeight: 22,
    fontFamily: Fonts.poppins.regular,
    letterSpacing: -0.41,
  },
  xSmallBold: {
    fontSize: 12,
    lineHeight: 22,
    fontFamily: Fonts.poppins.bold,
  },
  xSmallMedium: {
    fontSize: 12,
    lineHeight: 22,
    fontFamily: Fonts.poppins.medium,
  },
  xSmallSemiBold: {
    fontSize: 12,
    lineHeight: 22,
    fontFamily: Fonts.poppins.semiBold,
  },
  small: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.poppins.medium,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.poppins.bold,
  },
  default: {
    fontSize: 16,
    fontFamily: Fonts.poppins.medium,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.poppins.semiBold,
    lineHeight: 32,
    letterSpacing: -0.41,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.poppins.regular,
    letterSpacing: -0.41,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontFamily: Fonts.poppins.regular,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    fontFamily: Fonts.poppins.regular,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" }) ?? "500",
    fontSize: 12,
  },
});
