import { Spacer } from "@/components/spacer";
import TabSwitcher, { Tab } from "@/components/tab";
import { ThemedView } from "@/components/themed-view";
import { EarningsTab } from "@/components/ui/wallet/earnings-tab";
import { OverviewTab } from "@/components/ui/wallet/overview-tab";
import { WalletWidget } from "@/components/wallet-widget";
import { ScrollView, StyleSheet } from "react-native";

export default function Wallet() {
  return (
    <ThemedView safe style={[styles.container, { paddingHorizontal: 0 }]}>
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
    marginTop: 24,
  },
});
