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
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, ScrollView, Text, View } from "react-native";
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "red",
              borderRadius: 100,
            }}
          />
          <Text style={{ color: theme.primary, fontSize: 20, fontWeight: 900 }}>
            Hey, {user ? user.firstname : "Will"}
          </Text>
        </View>
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
      </View>
      <Spacer height={24} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 9,
            backgroundColor: theme.primary,
            gap: 25,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFFB2",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                My portfolio
              </Text>
              <Button variant="ghost" size="none" onPress={() => {}}>
                <Arrow
                  width={24}
                  height={24}
                  color={"white"}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </Button>
            </View>
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
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Button
              variant="soft"
              size="small"
              style={{ alignItems: "center" }}
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
              variant="soft"
              size="small"
              icon={<PlusIcon width={16} height={16} />}
            >
              <ThemedText
                style={{ color: "white", fontSize: 12, fontWeight: 400 }}
              >
                Add Money
              </ThemedText>
            </Button>
          </View>
        </View>
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
