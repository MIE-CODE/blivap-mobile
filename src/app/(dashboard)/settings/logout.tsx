import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function LogoutScreen() {
  const theme = useTheme();
  const { logOut } = useAuth();

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Log Out" titleStyle={{ color: theme.primary }} />
      <ThemedView style={styles.content}>
        <ThemedView style={[styles.iconOuter, { backgroundColor: "#FFE2E2" }]}>
          <ThemedView style={[styles.iconInner, { backgroundColor: theme.primary }]}>
            <Feather name="log-out" size={28} color="#ffffff" />
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.title}>Are you sure you want to log out?</ThemedText>
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          You can always log back in to continue saving lives and helping those
          in need.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={logOut}>
          Log Out
        </Button>
        <Button
          variant="outline"
          size="large"
          onPress={() => router.back()}
          style={{ borderColor: theme.primary, backgroundColor: "#ffffff" }}
          textStyle={{ color: theme.primary, fontFamily: Fonts.inter.bold }}
        >
          Cancel
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  iconOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    textAlign: "center",
    lineHeight: 30,
  },
  description: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  footer: {
    gap: 12,
    paddingBottom: 8,
  },
});
