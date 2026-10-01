import NotificationsIcon from "@/assets/icons/notification.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { openRoute } from "@/utils/open-route";
import { Image, Pressable, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";

export function DonateBloodBrandHeader() {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id?.slice(-6) ?? "------";

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.logo, { color: theme.primary }]}>
        Blivap
      </ThemedText>

      <ThemedView style={styles.rightGroup}>
        <Pressable
          style={[styles.iconBtn, { borderColor: theme.border }]}
          onPress={() => openRoute("/notification")}
        >
          <NotificationsIcon color={theme.text} width={20} height={20} />
        </Pressable>

        <Pressable
          style={styles.profileGroup}
          onPress={() => openRoute("/profile")}
        >
          <Image
            source={{ uri: user?.profileImage ?? "" }}
            style={styles.avatar}
          />
          <ThemedText style={styles.userId}>{userId}</ThemedText>
        </Pressable>
      </ThemedView>
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
  logo: {
    fontSize: 28,
    fontFamily: Fonts.inter.bold,
    letterSpacing: -0.5,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  userId: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
  },
});
