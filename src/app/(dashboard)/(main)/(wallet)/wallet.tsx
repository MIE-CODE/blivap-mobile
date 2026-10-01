import NotificationsIcon from "@/assets/icons/notification.svg";
import { Spacer } from "@/components/spacer";
import TabSwitcher, { Tab } from "@/components/tab";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EarningsTab } from "@/components/ui/wallet/earnings-tab";
import { OverviewTab } from "@/components/ui/wallet/overview-tab";
import { WalletWidget } from "@/components/wallet-widget";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { openRoute } from "@/utils/open-route";
import { Pressable, ScrollView, StyleSheet } from "react-native";

export default function Wallet() {
  const theme = useTheme();

  return (
    <ThemedView safe style={[styles.container, { paddingHorizontal: 0 }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Wallet</ThemedText>
        <Pressable
          style={[styles.bell, { borderColor: theme.primary }]}
          onPress={() => openRoute("/notification")}
        >
          <NotificationsIcon color={theme.text} width={22} height={22} />
        </Pressable>
      </ThemedView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={{ paddingHorizontal: 20 }}>
          <WalletWidget />
        </ThemedView>
        <Spacer height={24} />
        <TabSwitcher triggerStyle={{ paddingHorizontal: 20 }}>
          <Tab title="Overview">
            <OverviewTab />
          </Tab>
          <Tab title="Earnings">
            <EarningsTab />
          </Tab>
        </TabSwitcher>
      </ScrollView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 32,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
