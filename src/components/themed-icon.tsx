import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type ThemedIconProps = {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
  variant?: "default" | "muted" | "accent";
};

export const ThemedIcon = ({
  name,
  size = 24,
  color,
  variant = "default",
}: ThemedIconProps) => {
  const theme = useTheme();

  const variantColor = {
    default: theme.text,
    muted: theme.textSecondary,
    accent: theme.textAccent,
  }[variant];

  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? variantColor}
      style={{ fontFamily: "thin" }}
    />
  );
};
