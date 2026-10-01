import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function BookingsLayout() {
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
