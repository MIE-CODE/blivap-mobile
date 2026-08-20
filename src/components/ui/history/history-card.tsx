import Droplets from "@/assets/icons/droplets.svg";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

export const HistoryCard = () => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        padding: 10,
        shadowOpacity: 0.5,
        backgroundColor: theme.background,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
        shadowRadius: 2,
        width: "100%",
        borderRadius: 10,
        shadowColor: theme.shadow,
      }}
    >
      <ThemedView
        style={{
          shadowColor: theme.text,
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 13,
        }}
      >
        <ThemedView style={[styles.wIcon, { borderColor: theme.primary }]}>
          <Droplets />
        </ThemedView>
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedView>
            <ThemedText
              style={{
                fontSize: 16,
                lineHeight: 22,
                fontFamily: Fonts.inter.medium,
              }}
            >
              Whole Blood
            </ThemedText>
            <ThemedText type="xSmall" style={{ color: theme.border }}>
              2 pack
            </ThemedText>
            <ThemedText type="xSmall" style={{ color: theme.border }}>
              2024-01-15 at 10:30 AM
            </ThemedText>
          </ThemedView>
          <ThemedView>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: theme.status.success,
              }}
            >
              ₦ 100,000
            </ThemedText>
            <ThemedView
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <ThemedView
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 7,
                  backgroundColor: theme.status.success,
                }}
              />
              <ThemedText type="xSmall" style={{ color: theme.border }}>
                Completed
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <Line
        strokeWidth={0.5}
        strokeColor={theme.textSecondary}
        style={{ marginVertical: 5 }}
      />
      <ThemedView style={{ gap: 8 }}>
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ThemedText
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: theme.textSecondary,
            }}
          >
            Location:
          </ThemedText>
          <ThemedText
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: theme.textSecondary,
            }}
          >
            Recipient:
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ThemedText
            style={{
              fontWeight: 500,
              fontSize: 12,
              color: theme.text,
            }}
          >
            Lagos University Teaching
          </ThemedText>
          <ThemedText
            style={{
              fontWeight: 500,
              fontSize: 12,
              color: theme.text,
            }}
          >
            Emergency
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ThemedText
            style={{
              fontWeight: 500,
              fontSize: 12,
              color: theme.text,
            }}
          >
            Hospital
          </ThemedText>
          <ThemedText
            style={{
              fontWeight: 500,
              fontSize: 12,
              color: theme.text,
            }}
          >
            Patient
          </ThemedText>
        </ThemedView>
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
