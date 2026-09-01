import NotificationsIcon from "@/assets/icons/notification.svg";
import { BackBtn } from "@/components/back-btn";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type DonateHeaderProps = {
  title?: string;
  onBack?: () => void;
};

export function DonateHeader({ title = "Donate", onBack }: DonateHeaderProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <BackBtn onPress={onBack ?? (() => router.navigate("/home"))} />
      <ThemedText style={[styles.title, { color: theme.text }]}>
        {title}
      </ThemedText>
      <Pressable
        style={[styles.notificationBtn, { borderColor: theme.border }]}
        onPress={() => router.push("/notification")}
      >
        <NotificationsIcon color={theme.text} width={22} height={22} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.inter.bold,
  },
  notificationBtn: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
