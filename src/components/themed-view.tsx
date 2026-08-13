import {
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewProps,
} from "react-native";

import { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps &
  ScrollViewProps & {
    lightColor?: string;
    darkColor?: string;
    type?: ThemeColor;
    safe?: boolean;
  };

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  safe = false,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  if (!safe)
    return (
      <View
        style={[{ backgroundColor: theme.background }, style]}
        {...otherProps}
      />
    );
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingHorizontal: 20,
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      showsVerticalScrollIndicator={false}
      {...otherProps}
    />
  );
}
