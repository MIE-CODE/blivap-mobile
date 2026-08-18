import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { useAppSelector } from "../../../stores/hooks";

export default function AuthLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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
