import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

type PaymentMethodOptionProps = {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onPress: () => void;
};

export const PaymentMethodOption = ({
  title,
  description,
  icon,
  selected,
  onPress,
}: PaymentMethodOptionProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: selected ? theme.primary : theme.backgroundElement,
          backgroundColor: "#ffffff",
        },
      ]}
    >
      <ThemedView
        style={[
          styles.iconWrap,
          {
            backgroundColor: selected ? "#FFE2E2" : theme.backgroundElement,
          },
        ]}
      >
        {icon}
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText
          type="xSmall"
          style={{ color: theme.textSecondary, lineHeight: 16 }}
        >
          {description}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={[
          styles.radio,
          selected
            ? { borderColor: theme.primary, backgroundColor: theme.primary }
            : { borderColor: theme.border },
        ]}
      >
        {selected && <ThemedView style={styles.radioInner} />}
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
});
