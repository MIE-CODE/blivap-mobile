import { Colors, status } from "@/constants/theme";

import { useTheme } from "@/hooks/use-theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./themed-text";

type ButtonVariant =
  | "primary"
  | "ghost"
  | "outline"
  | "danger"
  | "success"
  | "info"
  | "soft"
  | "link"
  | "disabled";
type ButtonSize = "none" | "xs" | "small" | "medium" | "large";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  icon?: React.ReactNode;
  textStyle?: TextStyle;
  loading?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "medium",
  style,
  children,
  icon,
  textStyle,
  loading = false,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  return (
    <Pressable
      style={[
        {
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        { backgroundColor: theme.primary, shadowColor: "#FF000066" },
        sizeStyles[size],
        props.disabled ? styles["disabled"] : styles[variant],
        style,
        icon
          ? {
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }
          : "",
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <>
          {icon && icon}
          <ThemedText style={[styles.text, textStyle]}>
            {children as string}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
};

const sizeStyles = StyleSheet.create({
  none: { paddingVertical: 0, paddingHorizontal: 0 },
  xs: { paddingVertical: 4, paddingHorizontal: 8 },
  small: { paddingVertical: 4, paddingHorizontal: 10 },
  medium: { paddingVertical: 8, paddingHorizontal: 16 },
  large: { paddingVertical: 16, paddingHorizontal: 24 },
});

const styles = StyleSheet.create({
  primary: {
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  ghost: {
    borderWidth: 0,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 100,
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: status.danger,
    borderRadius: 100,
  },
  success: {
    backgroundColor: status.success,
    borderRadius: 100,
  },
  info: {
    backgroundColor: status.info,
    borderRadius: 100,
  },
  soft: {
    backgroundColor: Colors.softPrimary,
    borderRadius: 20,
  },
  link: {
    backgroundColor: "transparent",
    borderRadius: 100,
  },
  disabled: {
    shadowColor: "#1D2264",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: Colors.disabled,
    borderColor: Colors.gray[4],
    borderRadius: 40,
  },
});
