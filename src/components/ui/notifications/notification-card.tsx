import { Skeleton } from "@/components/themed-skeleton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { copyToClipboard } from "@/utils/clipboard";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export type NotificationIconType =
  | "success"
  | "withdrawal"
  | "reward"
  | "calendar"
  | "referral"
  | "welcome"
  | "thanks"
  | "wallet"
  | "message"
  | "announcement"
  | "matched"
  | "meetup"
  | "warning"
  | "reminder";

type NotificationCardProps = {
  title: string;
  body: string;
  timestamp: string;
  unread?: boolean;
  iconType: NotificationIconType;
  code?: string;
  onPress?: () => void;
};

const PREVIEW_LENGTH = 110;

function readableBody(body: string) {
  return body
    .replace(/'\\n\\n'/g, "\n\n")
    .replace(/'\\n'/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const LABELED_CODE = /(?:meetup\s+code|meeting\s+code|code)\s*:\s*([A-Za-z0-9-]{4,12})/i;

function notificationCode(message: string, explicit?: string) {
  const labeled = message.match(LABELED_CODE)?.[1];
  const code = (explicit || labeled || "").trim();
  if (!code) return null;

  const at = message.indexOf(code);
  if (at < 0) return { before: message, code, after: "" };

  return {
    before: message.slice(0, at).replace(/[:\s]+$/, ""),
    code,
    after: message.slice(at + code.length).replace(/^[\s.:]+/, ""),
  };
}

const ICON_CONFIG: Record<
  NotificationIconType,
  { bg: string; icon: keyof typeof Feather.glyphMap }
> = {
  success: { bg: "#3EB655", icon: "check" },
  withdrawal: { bg: "#960018", icon: "arrow-down-circle" },
  reward: { bg: "#EAB308", icon: "award" },
  calendar: { bg: "#1E3A5F", icon: "calendar" },
  referral: { bg: "#14B8A6", icon: "gift" },
  welcome: { bg: "#2563EB", icon: "smile" },
  thanks: { bg: "#E11D48", icon: "heart" },
  wallet: { bg: "#960018", icon: "credit-card" },
  message: { bg: "#6366F1", icon: "message-circle" },
  announcement: { bg: "#F97316", icon: "bell" },
  matched: { bg: "#7C3AED", icon: "users" },
  meetup: { bg: "#0284C7", icon: "map-pin" },
  warning: { bg: "#DC2626", icon: "x-circle" },
  reminder: { bg: "#D97706", icon: "clock" },
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
  code: explicitCode,
  onPress,
}: NotificationCardProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = readableBody(body);
  const parsed = notificationCode(message, explicitCode);
  const canExpand = parsed
    ? parsed.after.length > 0 || parsed.before.length > PREVIEW_LENGTH
    : message.length > PREVIEW_LENGTH || message.includes("\n");

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const handlePress = () => {
    setExpanded((open) => !open);
    onPress?.();
  };

  const copyCode = async () => {
    if (!parsed) return;
    const didCopy = await copyToClipboard(parsed.code);
    setCopied(true);
    Toast.show({
      type: "success",
      text1: didCopy ? "Code copied" : "Code ready to share",
    });
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadow,
            borderColor: unread ? theme.primary : theme.hairline,
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
          {parsed ? (
            <>
              {parsed.before ? (
                <ThemedText
                  numberOfLines={expanded ? undefined : 2}
                  style={[styles.body, { color: theme.textSecondary }]}
                >
                  {parsed.before}
                </ThemedText>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Copy code"
                onPress={() => void copyCode()}
                style={[
                  styles.codeChip,
                  {
                    backgroundColor: theme.tint,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <ThemedText
                  numberOfLines={1}
                  style={[styles.codeValue, { color: theme.primary }]}
                >
                  {parsed.code}
                </ThemedText>
                <ThemedView
                  style={[styles.copyButton, { backgroundColor: theme.card }]}
                >
                  <Feather
                    name={copied ? "check" : "copy"}
                    size={14}
                    color={theme.primary}
                  />
                </ThemedView>
              </Pressable>
              {expanded && parsed.after ? (
                <ThemedText style={[styles.body, { color: theme.textSecondary }]}>
                  {parsed.after}
                </ThemedText>
              ) : null}
            </>
          ) : (
            <ThemedText
              numberOfLines={expanded ? undefined : 2}
              ellipsizeMode="tail"
              style={[styles.body, { color: theme.textSecondary }]}
            >
              {message}
            </ThemedText>
          )}
          {canExpand ? (
            <ThemedText style={[styles.more, { color: theme.primary }]}>
              {expanded ? "Show less" : "Show more"}
            </ThemedText>
          ) : null}
        </ThemedView>
        {unread ? (
          <ThemedView
            style={[styles.unreadDot, { backgroundColor: theme.primary }]}
          />
        ) : null}
      </ThemedView>
    </Pressable>
  );
};

export function NotificationCardSkeleton() {
  const theme = useTheme();
  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.hairline,
          borderWidth: 1,
        },
      ]}
    >
      <Skeleton width={44} height={44} borderRadius={22} />
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <Skeleton width="55%" height={14} />
          <Skeleton width={72} height={10} />
        </ThemedView>
        <Skeleton width="100%" height={12} />
        <Skeleton width="70%" height={12} />
      </ThemedView>
      <ThemedView style={styles.unreadDot}>
        <Skeleton width={8} height={8} borderRadius={4} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
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
  more: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  codeChip: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  codeValue: {
    flex: 1,
    fontFamily: Fonts.inter.bold,
    fontSize: 20,
    letterSpacing: 4,
    lineHeight: 26,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
});
