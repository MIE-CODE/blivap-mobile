import HomeIcon from "@/assets/icons/home.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { ThemedView } from "./themed-view";

export const TabBar = (props: BottomTabBarProps) => {
  const theme = useTheme();
  const currentRoute = props.state.routes[props.state.index]?.name;
  const isActive = (name: string) => currentRoute === name;
  const labelColor = (name: string) =>
    isActive(name) ? theme.primary : theme.border;

  return (
    <ThemedView
      style={[
        styles.container,
        Platform.OS === "android" && styles.androidLift,
        { shadowColor: theme.text, backgroundColor: theme.background },
      ]}
    >
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("home")}
      >
        <HomeIcon
          width={26}
          height={26}
          fill={isActive("home") ? theme.primary : "none"}
          stroke={isActive("home") ? theme.primary : "none"}
          strokeWidth={0}
          color={isActive("home") ? theme.primary : Colors.gray[3]}
        />
        <Text style={[styles.label, { color: labelColor("home") }]}>Home</Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("bookings")}
      >
        <Feather
          name="calendar"
          size={24}
          color={isActive("bookings") ? theme.primary : Colors.gray[3]}
        />
        <Text style={[styles.label, { color: labelColor("bookings") }]}>
          Bookings
        </Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("donate")}
      >
        <Feather
          name="droplet"
          size={24}
          color={isActive("donate") ? theme.primary : Colors.gray[3]}
        />
        <Text style={[styles.label, { color: labelColor("donate") }]}>
          Donate
        </Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("chat")}
      >
        <Feather
          name="message-circle"
          size={24}
          color={isActive("chat") ? theme.primary : Colors.gray[3]}
        />
        <Text style={[styles.label, { color: labelColor("chat") }]}>Chat</Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("(wallet)")}
      >
        <WalletIcon
          width={26}
          height={26}
          fill={isActive("(wallet)") ? theme.primary : "none"}
          stroke={isActive("(wallet)") ? theme.primary : theme.border}
          strokeWidth={isActive("(wallet)") ? 0 : 1}
          color={isActive("(wallet)") ? theme.primary : Colors.gray[3]}
        />
        <Text style={[styles.label, { color: labelColor("(wallet)") }]}>
          Wallet
        </Text>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  androidLift: {
    paddingBottom: 34,
  },
  btnCont: {
    gap: 4,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
  },
});
