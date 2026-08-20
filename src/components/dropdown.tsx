import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Entypo } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { ThemedIcon } from "./themed-icon";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
};

export const Dropdown = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  ...props
}: DropdownProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const tray = useRef(null);
  const selected = options.find((o) => o.value === value);

  return (
    <ThemedView style={{ gap: 6, flex: 1, position: "relative" }}>
      {label && (
        <ThemedText style={{ fontSize: 13, color: theme.textSecondary }}>
          {label}
        </ThemedText>
      )}

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            borderColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
        {...props}
      >
        <ThemedText
          style={{
            color: theme.text,
            fontFamily: Fonts.inter.semiBold,
            fontSize: 16,
          }}
        >
          {selected ? selected.label : placeholder}
        </ThemedText>
        <ThemedIcon size={18} color={theme.text} name="chevron-down" />
      </Pressable>
      {open && (
        <Pressable
          ref={tray}
          onPress={() => setOpen((prev) => !prev)}
          style={[styles.sheet, { backgroundColor: theme.background }]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.option,
                    isSelected && {
                      backgroundColor: theme.backgroundSelected,
                    },
                  ]}
                >
                  <ThemedText style={{ color: theme.text }}>
                    {item.label}
                  </ThemedText>
                  {isSelected && (
                    <Entypo size={18} color={theme.primary} name="check" />
                  )}
                </Pressable>
              );
            }}
          />
        </Pressable>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  sheet: {
    paddingVertical: 8,
    position: "absolute",
    top: "100%",
    transform: [{ translateY: 10 }],
    zIndex: 1,
    flex: 1,
    width: "100%",
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
