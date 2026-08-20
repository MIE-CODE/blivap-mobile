import HomeIcon from "@/assets/icons/home.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text } from "react-native";
import { Spacer } from "./spacer";
import { ThemedView } from "./themed-view";
export const TabBar = (props: BottomTabBarProps) => {
  const theme = useTheme();
  const isActive = (index: number) => props.state.index === index;
  return (
    <ThemedView
      style={[
        styles.container,
        { shadowColor: theme.text, backgroundColor: theme.background },
      ]}
    >
      <Pressable
        style={styles.btn}
        onPress={() => props.navigation.navigate("home")}
      >
        <HomeIcon
          fill={isActive(0) ? theme.primary : "none"}
          stroke={isActive(0) ? theme.primary : "none"}
          strokeWidth={0}
          color={isActive(0) ? theme.primary : Colors.gray[3]}
        />
        <Text
          style={{
            color: isActive(0) ? theme.primary : theme.border,

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
              backgroundColor: isActive(1)
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
            color: isActive(1) ? theme.primary : theme.border,
            fontFamily: Fonts.inter.regular,
            fontSize: 14,
          }}
        >
          Donate
        </Text>
      </Pressable>
      <Pressable
        style={styles.btn}
        onPress={() => {
          props.navigation.navigate("wallet");
          console.log(props.navigation);
        }}
      >
        <WalletIcon
          fill={isActive(2) ? theme.primary : "none"}
          stroke={isActive(2) ? theme.primary : theme.border}
          strokeWidth={isActive(2) ? 0 : 1}
          color={isActive(2) ? theme.primary : Colors.gray[3]}
        />
        <Text
          style={{
            color: isActive(2) ? theme.primary : theme.border,
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
