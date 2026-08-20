import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { TabBar } from "./tab-bar";

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.background },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="donate" options={{ title: "Donate" }} />
      <Tabs.Screen name="(wallet)" options={{ title: "Wallet" }} />
      <Tabs.Screen name="donors" options={{ href: null }} />
    </Tabs>
  );
}
