import NotificationsIcon from "@/assets/icons/notification.svg";
import BloodDropWhiteIcon from "@/assets/icons/blood-drop-white.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DonateColors } from "@/components/ui/donate/donate-colors";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { isDonor } from "@/utils/user-roles";
import { Feather } from "@expo/vector-icons";
import { openRoute } from "@/utils/open-route";
import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useAppSelector } from "../../../../stores/hooks";

const COMING_SOON: {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  background: string;
  color: string;
}[] = [
  {
    title: "Sperm",
    icon: "users",
    background: DonateColors.spermIconBg,
    color: DonateColors.spermAccent,
  },
  {
    title: "Plasma",
    icon: "droplet",
    background: "#FEF3C7",
    color: "#B45309",
  },
  {
    title: "Platelets",
    icon: "layers",
    background: "#E0F2FE",
    color: "#0369A1",
  },
  {
    title: "Double red cells",
    icon: "disc",
    background: "#FCE7F3",
    color: "#9D174D",
  },
];

export function DonateOptionsScreen() {
  const theme = useTheme();
  const roles = useAppSelector((state) => state.auth.user?.roles);
  const donor = isDonor(roles);

  return (
    <ThemedView safe style={styles.screen}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Donate</ThemedText>
        <Pressable
          style={[styles.bell, { borderColor: theme.primary }]}
          onPress={() => openRoute("/notification")}
        >
          <NotificationsIcon color={theme.text} width={22} height={22} />
        </Pressable>
      </ThemedView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {donor ? null : (
          <ActionRow
            title="Donate blood"
            action="Start"
            filled
            icon={
              <ThemedView style={styles.iconOnPrimary}>
                <BloodDropWhiteIcon width={28} height={28} />
              </ThemedView>
            }
            onPress={() => openRoute("/donate-blood/verify-identity")}
          />
        )}
        <ActionRow
          title="Request blood"
          action="Find"
          icon={
            <ThemedView style={[styles.icon, { backgroundColor: theme.tint }]}>
              <Feather name="heart" size={22} color={theme.primary} />
            </ThemedView>
          }
          onPress={() => openRoute("/donors")}
        />
        {COMING_SOON.map((item) => (
          <ActionRow
            key={item.title}
            title={item.title}
            action="Soon"
            muted
            icon={
              <ThemedView style={[styles.icon, { backgroundColor: item.background }]}>
                <Feather name={item.icon} size={22} color={item.color} />
              </ThemedView>
            }
            onPress={() => Toast.show({ type: "info", text1: "Coming soon" })}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

function ActionRow({
  title,
  action,
  icon,
  onPress,
  filled,
  muted,
}: {
  title: string;
  action: string;
  icon: ReactNode;
  onPress: () => void;
  filled?: boolean;
  muted?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.card,
          borderColor: theme.hairline,
        },
        filled && { backgroundColor: theme.primary, borderColor: theme.primary },
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <ThemedText style={[styles.rowTitle, filled && styles.rowTitleOnPrimary]}>
        {title}
      </ThemedText>
      <ThemedView
        style={[
          styles.action,
          { backgroundColor: theme.tint },
          filled && styles.actionOnPrimary,
          muted && { backgroundColor: theme.muted },
        ]}
      >
        <ThemedText
          style={[
            styles.actionText,
            {
              color: filled
                ? theme.primary
                : muted
                  ? theme.textSecondary
                  : theme.primary,
            },
          ]}
        >
          {action}
        </ThemedText>
        {muted ? null : (
          <Feather name="chevron-right" size={16} color={theme.primary} />
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
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
  scroll: {
    flex: 1,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    minHeight: 88,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8ED",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  pressed: {
    opacity: 0.82,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOnPrimary: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    flex: 1,
    fontFamily: Fonts.inter.bold,
    fontSize: 18,
  },
  rowTitleOnPrimary: {
    color: "#FFFFFF",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FFF1F1",
    borderRadius: 100,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
  },
  actionOnPrimary: {
    backgroundColor: "#FFFFFF",
  },
  actionMuted: {
    backgroundColor: "#F3F4F6",
    paddingRight: 12,
  },
  actionText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
  },
});
