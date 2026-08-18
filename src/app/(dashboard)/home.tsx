import Arrow from "@/assets/icons/arrow-back.svg";
import WithdrawIcon from "@/assets/icons/download.svg";
import EyeIcon from "@/assets/icons/eye-outline.svg";
import NotificationsIcon from "@/assets/icons/notification.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import TabSwitcher, { Tab } from "@/components/tab";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BloodDonorTab } from "@/components/ui/home/blood-donor-tab";
import { Colors, Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useAppSelector } from "../../../stores/hooks";
export default function Home() {
  const { user } = useAppSelector((s) => s.auth);
  const { logOut } = useAuth();
  const theme = useTheme();
  return (
    <ThemedView
      safe
      style={{ flex: 1, paddingBottom: 0, paddingHorizontal: 0 }}
    >
      <Spacer height={22} />
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
          <Image
            source={{ uri: user?.profileImage ?? "" }}
            style={{
              width: 36,
              height: 36,
              backgroundColor: "transparent",
              borderRadius: 100,
            }}
          />
          <ThemedText
            fontFamily={Fonts.inter.bold}
            style={{ color: theme.primary, fontSize: 20, fontWeight: 900 }}
          >
            Hey, {user ? user.firstname : "Will"}
          </ThemedText>
        </ThemedView>
        <Pressable
          style={{
            padding: 4,
            borderWidth: 0.5,
            borderColor: theme.primary,
            borderRadius: 100,
          }}
          onPress={() => {}}
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
        <ThemedView
          style={{
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 9,
            backgroundColor: theme.primary,
            gap: 25,
            position: "relative",
          }}
        >
          <Image
            source={{ uri: "@/assets/icons/home-bg.svg" }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <ThemedView style={{ backgroundColor: "transparent" }}>
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                style={{
                  color: "#FFFFFFB2",
                }}
              >
                My portfolio
              </ThemedText>
              <Button variant="ghost" size="none" onPress={() => {}}>
                <Arrow
                  width={24}
                  height={24}
                  color={"white"}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </Button>
            </ThemedView>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{
                  fontWeight: 900,
                  color: Colors.dark.text,
                  fontSize: 32,
                }}
              >
                ₦250,000
              </Text>
              <Pressable onPress={() => {}}>
                <EyeIcon />
              </Pressable>
            </View>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 16,
              backgroundColor: "transparent",
            }}
          >
            <Button
              variant="outline"
              size="small"
              style={{ borderColor: "#FFFFFF33" }}
              icon={<WithdrawIcon width={16} height={16} color={theme.text} />}
              onPress={() => logOut()}
            >
              <ThemedText
                style={{ color: "white", fontSize: 12, fontWeight: 400 }}
              >
                Withdraw
              </ThemedText>
            </Button>
            <Button
              variant="outline"
              size="small"
              style={{ borderColor: "#FFFFFF33" }}
              icon={<PlusIcon width={16} height={16} />}
            >
              <ThemedText
                style={{ color: "white", fontSize: 12, fontWeight: 400 }}
              >
                Add Money
              </ThemedText>
            </Button>
          </ThemedView>
        </ThemedView>
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
    </ThemedView>
  );
}
