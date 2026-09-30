import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
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
  onBlur?: () => void;
  error?: unknown;
  style?: StyleProp<ViewStyle>;
};

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error.filter(Boolean).join(", ");
  if (typeof error === "object")
    return Object.values(error).filter(Boolean).join(", ");
  return String(error);
}

export const Dropdown = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  onBlur,
  error,
  style,
  ...props
}: DropdownProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const hasError = !!error;
  const errorMessage = formatError(error);

  return (
    <ThemedView style={[{ gap: 6, position: "relative", zIndex: open ? 20 : 1 }, style]}>
      {label && (
        <ThemedText style={{ fontSize: 13, color: theme.textSecondary }}>
          {label}
        </ThemedText>
      )}

      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        style={[
          styles.trigger,
          {
            borderColor: hasError ? theme.status.danger : theme.border,
            backgroundColor: theme.background,
          },
        ]}
        {...props}
      >
        <ThemedText
          numberOfLines={1}
          style={{
            flex: 1,
            color: selected ? theme.text : theme.textSecondary,
            fontFamily: Fonts.inter.medium,
            fontSize: 14,
          }}
        >
          {selected ? selected.label : placeholder}
        </ThemedText>
        <ThemedIcon size={18} color={theme.text} name="chevron-down" />
      </Pressable>
      {errorMessage ? (
        <ThemedText type="xSmall" style={{ color: theme.status.danger }}>
          * {errorMessage}
        </ThemedText>
      ) : null}
      {open ? (
        <ThemedView
          style={[styles.sheet, { backgroundColor: theme.background, shadowColor: theme.text }]}
        >
          {options.map((item) => {
            const isSelected = item.value === value;
            return (
              <Pressable
                key={item.value}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  onBlur?.();
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
                {isSelected ? (
                  <Entypo size={18} color={theme.primary} name="check" />
                ) : null}
              </Pressable>
            );
          })}
        </ThemedView>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sheet: {
    paddingVertical: 8,
    position: "absolute",
    top: "100%",
    transform: [{ translateY: 10 }],
    zIndex: 30,
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
