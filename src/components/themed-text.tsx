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
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
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
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  xSmall: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: 400,
    letterSpacing: -0.41,
  },
  xSmallBold: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: 700,
  },
  xSmallMedium: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: 500,
  },
  xSmallSemiBold: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: 600,
  },
  small: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    fontWeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 32,
    letterSpacing: -0.41,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 400,
    letterSpacing: -0.41,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
