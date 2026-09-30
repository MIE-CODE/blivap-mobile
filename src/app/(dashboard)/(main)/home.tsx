import NotificationsIcon from "@/assets/icons/notification.svg";
import { Spacer } from "@/components/spacer";
import TabSwitcher, { Tab } from "@/components/tab";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ProductBriefingModal } from "@/components/ui/briefing/product-briefing-modal";
import { BloodDonorTab } from "@/components/ui/home/blood-donor-tab";
import { WalletWidget } from "@/components/wallet-widget";
import { Fonts } from "@/constants/theme";
import { useProductBriefing } from "@/hooks/use-product-briefing";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { Image, Pressable, ScrollView } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";
export default function Home() {
  const { user } = useAppSelector((s) => s.auth);
  const theme = useTheme();
  const { visible: showBriefing, dismissBriefing } = useProductBriefing();

  return (
    <ThemedView
      safe
      style={{ flex: 1, paddingBottom: 0, paddingHorizontal: 0 }}
    >
      <Spacer height={4} />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <ThemedView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Pressable onPress={() => router.push("/profile")}>
            <Image
              source={{ uri: user?.profileImage ?? "" }}
              style={{
                width: 36,
                height: 36,
                backgroundColor: "transparent",
                borderRadius: 100,
              }}
            />
          </Pressable>
          <ThemedText
            fontFamily={Fonts.inter.bold}
            style={{ color: theme.primary, fontSize: 20, fontWeight: 900 }}
          >
            Hey, {user ? user.firstname : "Will"}
          </ThemedText>
        </ThemedView>
        <Pressable
          style={{
            width: 45,
            height: 45,
            borderWidth: 1,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            borderColor: theme.primary,
          }}
          onPress={() => router.push("/notification")}
        >
          <NotificationsIcon color={theme.text} />
        </Pressable>
      </ThemedView>
      <Spacer height={24} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <WalletWidget />

        <Spacer height={16} />
        <TabSwitcher>
          <Tab title="Blood Donor">
            <BloodDonorTab />
          </Tab>
          <Tab title="Sperm Donor">
            <ThemedText>Sperm Donor</ThemedText>
          </Tab>
        </TabSwitcher>
      </ScrollView>

      <ProductBriefingModal
        visible={showBriefing}
        onDismiss={dismissBriefing}
      />
    </ThemedView>
  );
}
