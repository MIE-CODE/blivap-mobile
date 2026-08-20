import WithdrawIcon from "@/assets/icons/download.svg";
import BG from "@/assets/icons/home-bg.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather, Octicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
export const WalletWidget = () => {
  const theme = useTheme();
  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          overflow: "hidden",
        },
      ]}
    >
      <BG style={styles.bgImg} />
      <ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
            <Feather
              name="arrow-right"
              size={24}
              color="#fffffff"
              style={{ fontWeight: 200 }}
            />
          </Button>
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <ThemedText
            style={{
              fontWeight: 900,
              color: Colors.dark.text,
              fontSize: 32,
            }}
          >
            ₦0
          </ThemedText>
          <Pressable onPress={() => {}}>
            <Octicons name="eye" size={24} color="#FFFFFF80" />
          </Pressable>
        </ThemedView>
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
          onPress={() => {}}
        >
          <ThemedText style={{ color: "white", fontSize: 12, fontWeight: 400 }}>
            Withdraw
          </ThemedText>
        </Button>
        <Button
          variant="outline"
          size="small"
          style={{ borderColor: "#FFFFFF33" }}
          icon={<PlusIcon width={16} height={16} />}
        >
          <ThemedText style={{ color: "white", fontSize: 12, fontWeight: 400 }}>
            Add Money
          </ThemedText>
        </Button>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 25,
    position: "relative",
  },
  bgImg: { position: "absolute", opacity: 0.6 },
});
