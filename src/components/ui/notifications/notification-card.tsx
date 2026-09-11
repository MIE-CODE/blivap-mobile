import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export type NotificationIconType =
  | "success"
  | "withdrawal"
  | "reward"
  | "calendar"
  | "referral";

type NotificationCardProps = {
  title: string;
  body: string;
  timestamp: string;
  unread?: boolean;
  iconType: NotificationIconType;
};

const ICON_CONFIG: Record<
  NotificationIconType,
  { bg: string; icon: keyof typeof Feather.glyphMap }
> = {
  success: { bg: "#3EB655", icon: "check" },
  withdrawal: { bg: "#960018", icon: "arrow-down-circle" },
  reward: { bg: "#EAB308", icon: "award" },
  calendar: { bg: "#2C3E50", icon: "calendar" },
  referral: { bg: "#14B8A6", icon: "gift" },
};

const NotificationIcon = ({ type }: { type: NotificationIconType }) => {
  const { bg, icon } = ICON_CONFIG[type];

  return (
    <ThemedView style={[styles.iconCircle, { backgroundColor: bg }]}>
      <Feather name={icon} size={18} color="#ffffff" />
    </ThemedView>
  );
};

export const NotificationCard = ({
  title,
  body,
  timestamp,
  unread = false,
  iconType,
}: NotificationCardProps) => {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: "#ffffff",
          shadowColor: theme.text,
          borderColor: unread ? theme.primary : Colors.gray[5],
          borderWidth: 1,
        },
      ]}
    >
      <NotificationIcon type={iconType} />
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          <ThemedText
            type="xSmall"
            style={[styles.timestamp, { color: theme.textSecondary }]}
          >
            {timestamp}
          </ThemedText>
        </ThemedView>
        <ThemedText
          style={[styles.body, { color: theme.textSecondary }]}
        >
          {body}
        </ThemedText>
      </ThemedView>
      {unread && (
        <ThemedView
          style={[styles.unreadDot, { backgroundColor: theme.primary }]}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    flexShrink: 0,
    fontSize: 11,
    lineHeight: 16,
  },
  body: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
});
