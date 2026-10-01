import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function ChatLayout() {
  const theme = useTheme();

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
