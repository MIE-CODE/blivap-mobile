import { useTheme } from "@/hooks/use-theme";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacer } from "./spacer";
import { ThemedText } from "./themed-text";

interface ThemedDatePickerProps {
  label?: string;
  placeholder?: string;
  /** ISO 8601 date string, e.g. `2004-08-10T00:00:00.000Z` */
  value?: string | null;
  /** Accepts Formik field errors (`string`, `string[]`, or nested object). */
  error?: unknown;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange?: (isoDate: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoString(date: Date) {
  return date.toISOString();
}

function formatDisplayDate(iso: string) {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error.filter(Boolean).join(", ");
  if (typeof error === "object")
    return Object.values(error).filter(Boolean).join(", ");
  return String(error);
}

export const ThemedDatePicker = ({
  label,
  placeholder = "Select date",
  value,
  error,
  maximumDate = new Date(),
  minimumDate,
  onChange,
  onBlur,
  disabled = false,
}: ThemedDatePickerProps) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const parsedValue = parseIsoDate(value);
  const selected = parsedValue ?? maximumDate;
  const [draft, setDraft] = useState<Date>(selected);
  const hasError = !!error;
  const errorMessage = formatError(error);

  const openPicker = () => {
    setDraft(parsedValue ?? maximumDate);
    setOpen(true);
  };

  const emitChange = (date: Date) => {
    onChange?.(toIsoString(date));
  };

  const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    setOpen(false);
    onBlur?.();
    if (event.type === "dismissed" || !date) return;
    emitChange(date);
  };

  const handleIosChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) setDraft(date);
  };

  const confirmIos = () => {
    emitChange(draft);
    setOpen(false);
    onBlur?.();
  };

  const cancelIos = () => {
    setOpen(false);
    onBlur?.();
  };

  return (
    <View>
      {label ? (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      ) : null}
      <Spacer height={4} />
      <Pressable
        onPress={disabled ? undefined : openPicker}
        disabled={disabled}
        style={[
          styles.input,
          {
            borderColor: hasError ? theme.status.danger : theme.border,
            backgroundColor: disabled
              ? theme.backgroundElement
              : "transparent",
            opacity: disabled ? 0.85 : 1,
          },
        ]}
      >
        <ThemedText
          style={{
            color: parsedValue ? theme.text : theme.textSecondary,
            fontSize: 14,
          }}
        >
          {parsedValue ? formatDisplayDate(value!) : placeholder}
        </ThemedText>
      </Pressable>

      {errorMessage ? (
        <ThemedText type="xSmall" style={{ color: theme.status.danger }}>
          * {errorMessage}
        </ThemedText>
      ) : null}

      {open && Platform.OS === "android" ? (
        <DateTimePicker
          value={selected}
          mode="date"
          display="default"
          presentation="dialog"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleAndroidChange}
          onDismiss={() => {
            setOpen(false);
            onBlur?.();
          }}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={cancelIos}
        >
          <View style={styles.modalRoot}>
            <Pressable style={styles.backdrop} onPress={cancelIos} />
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.background,
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
            >
              <View style={styles.sheetHeader}>
                <Pressable onPress={cancelIos} hitSlop={8}>
                  <ThemedText style={{ color: theme.textSecondary }}>
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable onPress={confirmIos} hitSlop={8}>
                  <ThemedText style={{ color: theme.link, fontWeight: "600" }}>
                    Done
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                value={draft}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleIosChange}
                themeVariant={colorScheme === "dark" ? "dark" : "light"}
                accentColor={theme.primary}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    lineHeight: 22,
    color: "#000000",
    fontWeight: "400",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13.5,
    justifyContent: "center",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#00000055",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iosPicker: {
    width: "100%",
    minHeight: 216,
  },
});
