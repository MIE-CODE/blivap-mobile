import { Fonts } from "@/constants/theme";
import { router } from "expo-router";
import { StyleProp, TextStyle } from "react-native";
import { BackBtn } from "./back-btn";
import { Spacer } from "./spacer";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
export type HeaderProps = {
  title: string;
  onBack?: () => void;
  titleStyle?: StyleProp<TextStyle>;
};
export const Header = ({ title, onBack, titleStyle }: HeaderProps) => (
  <ThemedView
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 12,
    }}
  >
    <BackBtn onPress={onBack ? onBack : () => router.back()} />
    <ThemedText
      style={[{ fontSize: 18, fontFamily: Fonts.inter.bold }, titleStyle]}
    >
      {title}
    </ThemedText>
    <Spacer width={40} />
  </ThemedView>
);
