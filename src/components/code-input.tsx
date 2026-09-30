import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type CodeInputType = "number" | "text";

type CodeInputProps = {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputCount?: number;
  /** `number` = digits only (default). `text` = letters + digits. */
  type?: CodeInputType;
  /** Controlled value — same role as TextInput `value`. */
  value?: string;
  /** Called with the full code string — same role as TextInput `onChangeText`. */
  onCodeChange?: (code: string) => void;
  onBlur?: () => void;
  error?: unknown;
};

const sanitize = (value = "", count: number, type: CodeInputType) => {
  const cleaned =
    type === "number"
      ? value.replace(/\D/g, "")
      : value.replace(/[^a-zA-Z0-9]/g, "");
  return Array.from({ length: count }, (_, i) => cleaned[i] ?? "");
};

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error.filter(Boolean).join(", ");
  return String(error);
}

export default function CodeInput({
  style,
  inputStyle,
  inputCount = 4,
  type = "number",
  onCodeChange,
  onBlur,
  value,
  error,
}: CodeInputProps) {
  const theme = useTheme();
  const [code, setCode] = useState(() => sanitize(value, inputCount, type));
  const [focused, setFocused] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>([]);
  const hasError = !!error;
  const errorMessage = formatError(error);

  useEffect(() => {
    if (value !== undefined) setCode(sanitize(value, inputCount, type));
  }, [value, inputCount, type]);

  const commit = (next: string[]) => {
    setCode(next);
    onCodeChange?.(next.join(""));
  };

  const handleChange = (text: string, index: number) => {
    const cleaned =
      type === "number"
        ? text.replace(/\D/g, "")
        : text.replace(/[^a-zA-Z0-9]/g, "");

    if (text.length > 0 && cleaned.length === 0) return;

    const isPaste =
      cleaned.length > 1 && (!code[index] || cleaned.length >= inputCount);

    if (isPaste) {
      commit(sanitize(cleaned, inputCount, type));
      refs.current[Math.min(cleaned.length, inputCount) - 1]?.focus();
      return;
    }

    const next = [...code];
    next[index] = cleaned.slice(-1);
    commit(next);
    if (next[index] && index < inputCount - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key !== "Backspace" || code[index] || index === 0) return;
    const next = [...code];
    next[index - 1] = "";
    commit(next);
    refs.current[index - 1]?.focus();
  };

  return (
    <ThemedView style={[styles.wrapper, style]}>
      <ThemedView style={styles.container}>
        {code.map((char, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            style={[
              styles.input,
              inputStyle,
              {
                borderColor:
                  focused === index
                    ? theme.primary
                    : hasError
                      ? theme.status.danger
                      : theme.border,
                color: theme.text,
              },
            ]}
            placeholder="-"
            maxLength={inputCount}
            keyboardType={type === "number" ? "number-pad" : "default"}
            autoCapitalize={type === "text" ? "characters" : "none"}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            value={char}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            onFocus={() => setFocused(index)}
            onBlur={() => {
              setFocused(null);
              onBlur?.();
            }}
          />
        ))}
      </ThemedView>
      {errorMessage ? (
        <ThemedText type="xSmall" style={{ color: theme.status.danger }}>
          * {errorMessage}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 4,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
    textAlign: "center",
    fontSize: 16,
  },
});
