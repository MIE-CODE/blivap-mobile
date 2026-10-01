import Droplets from "@/assets/icons/droplets.svg";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { HistoryCard } from "../history/history-card";
export const OverviewTab = () => {
  const theme = useTheme();
  return (
    <ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          gap: 16,
          paddingHorizontal: 20,
          width: "100%",
        }}
      >
        <ThemedView
          style={[
            styles.wContainer,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <ThemedView
            style={[
              styles.wIcon,
              { borderColor: theme.primary, backgroundColor: theme.tint },
            ]}
          >
            <Droplets />
          </ThemedView>
          <ThemedView>
            <ThemedText
              style={{
                fontFamily: Fonts.inter.semiBold,
                fontSize: 20,
                color: "black",
              }}
            >
              12{" "}
            </ThemedText>
            <Spacer height={9} />
            <ThemedText style={{ color: theme.textSecondary, fontSize: 15 }}>
              Blood{"\n"} Donations
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={[styles.wContainer, { shadowColor: theme.text }]}>
          <ThemedView
            style={[
              styles.wIcon,
              { borderColor: theme.status.success, backgroundColor: "#DCFCE8" },
            ]}
          >
            <Droplets />
          </ThemedView>
          <ThemedView>
            <ThemedText
              style={{
                fontFamily: Fonts.inter.semiBold,
                fontSize: 20,
                color: "black",
              }}
            >
              12{" "}
            </ThemedText>
            <Spacer height={9} />
            <ThemedText style={{ color: theme.textSecondary, fontSize: 15 }}>
              Sperm{"\n"} Donations
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <Spacer height={24} />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <ThemedText>Donation History</ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          <Link href="/donors" dangerouslySingular>
            View All
          </Link>
        </ThemedText>
      </ThemedView>
      <Spacer height={6} />
      <ThemedView
        style={{
          gap: 8,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        {[...Array(3)].map((_, index) => (
          <HistoryCard key={index} />
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  wContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowOffset: { height: 0, width: 0 },
    gap: 11,
    alignItems: "center",
    shadowOpacity: 0.15,
    elevation: 4,
    shadowRadius: 4,
  },
  wIcon: {
    borderRadius: "50%",
    borderWidth: 1,
    backgroundColor: "#FFE2E2",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
