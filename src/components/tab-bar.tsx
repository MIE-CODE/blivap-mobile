import HomeIcon from "@/assets/icons/home.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { isDonor } from "@/utils/user-roles";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { useAppSelector } from "../../stores/hooks";
import { Spacer } from "./spacer";
import { ThemedView } from "./themed-view";
export const TabBar = (props: BottomTabBarProps) => {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const currentRoute = props.state.routes[props.state.index]?.name;
  const isActive = (name: string) => currentRoute === name;
  const hideOnDonateTab = currentRoute === "donate" && !isDonor(user?.roles);

  if (hideOnDonateTab) {
    return null;
  }

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
          fill={isActive("home") ? theme.primary : "none"}
          stroke={isActive("home") ? theme.primary : "none"}
          strokeWidth={0}
          color={isActive("home") ? theme.primary : Colors.gray[3]}
        />
        <Text
          style={{
            color: isActive("home") ? theme.primary : theme.border,

            fontFamily: Fonts.inter.regular,
            fontSize: 14,
          }}
        >
          Home
        </Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("donate")}
      >
        <ThemedView
          style={[
            styles.plusIcon,
            {
              backgroundColor: isActive("donate")
                ? theme.primary
                : theme.textSecondary,
            },
          ]}
        >
          <PlusIcon width={32} height={32} color={theme.text} />
        </ThemedView>
        <Spacer height={4} />
        <Text
          style={{
            color: isActive("donate") ? theme.primary : theme.border,
            fontFamily: Fonts.inter.regular,
            fontSize: 14,
          }}
        >
          Donate
        </Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("(wallet)")}
      >
        <WalletIcon
          fill={isActive("(wallet)") ? theme.primary : "none"}
          stroke={isActive("(wallet)") ? theme.primary : theme.border}
          strokeWidth={isActive("(wallet)") ? 0 : 1}
          color={isActive("(wallet)") ? theme.primary : Colors.gray[3]}
        />
        <Text
          style={{
            color: isActive("(wallet)") ? theme.primary : theme.border,
            fontFamily: Fonts.inter.regular,
            fontSize: 14,
          }}
        >
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
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  androidLift: {
    paddingBottom: 34,
  },
  plusIcon: {
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 9.5,
    paddingVertical: 9,
    outlineWidth: 3,
    outlineColor: "white",
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: -20,
  },
  btnCont: {
    gap: 4,
  },
  btn: {
    alignItems: "center",
  },
});
