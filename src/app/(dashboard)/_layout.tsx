import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function DashboardLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
