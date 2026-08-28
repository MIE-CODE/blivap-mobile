import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function WalletLayout() {
  const theme = useTheme();

  return (
    <Stack
      initialRouteName="wallet"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
