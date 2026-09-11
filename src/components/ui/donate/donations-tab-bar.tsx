import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet } from "react-native";

export type DonationsTab = "history" | "pending";

type DonationsTabBarProps = {
  activeTab: DonationsTab;
  pendingCount: number;
  onTabChange: (tab: DonationsTab) => void;
};

export function DonationsTabBar({
  activeTab,
  pendingCount,
  onTabChange,
}: DonationsTabBarProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={styles.tab}
        onPress={() => onTabChange("history")}
      >
        <ThemedText
          style={[
            styles.tabLabel,
            {
              color: activeTab === "history" ? theme.primary : theme.textSecondary,
              fontFamily:
                activeTab === "history"
                  ? Fonts.inter.semiBold
                  : Fonts.inter.regular,
            },
          ]}
        >
          History
        </ThemedText>
        {activeTab === "history" ? (
          <ThemedView
            style={[styles.activeIndicator, { backgroundColor: theme.primary }]}
          />
        ) : null}
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => onTabChange("pending")}
      >
        <ThemedView style={styles.pendingLabelRow}>
          <ThemedText
            style={[
              styles.tabLabel,
              {
                color:
                  activeTab === "pending" ? theme.primary : theme.textSecondary,
                fontFamily:
                  activeTab === "pending"
                    ? Fonts.inter.semiBold
                    : Fonts.inter.regular,
              },
            ]}
          >
            Pending Requests
          </ThemedText>
          {pendingCount > 0 ? (
            <ThemedView
              style={[styles.badge, { backgroundColor: theme.primary }]}
            >
              <ThemedText style={styles.badgeText}>{pendingCount}</ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>
        {activeTab === "pending" ? (
          <ThemedView
            style={[styles.activeIndicator, { backgroundColor: theme.primary }]}
          />
        ) : null}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "transparent",
  },
  tab: {
    paddingBottom: 10,
    position: "relative",
  },
  tabLabel: {
    fontSize: 14,
  },
  pendingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: Fonts.inter.bold,
    lineHeight: 12,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
});
