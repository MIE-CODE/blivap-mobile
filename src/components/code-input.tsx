import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemedView } from "./themed-view";

type CodeInputProps = {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputCount?: number;
  onCodeChange?: (code: string) => void;
  value?: string;
};

const toDigits = (value = "", count: number) => {
  const digits = value.replace(/\D/g, "");
  return Array.from({ length: count }, (_, i) => digits[i] ?? "");
};

export default function CodeInput({
  style,
  inputStyle,
  inputCount = 4,
  onCodeChange,
  value,
}: CodeInputProps) {
  const theme = useTheme();
  const [code, setCode] = useState(() => toDigits(value, inputCount));
  const [focused, setFocused] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (value !== undefined) setCode(toDigits(value, inputCount));
  }, [value, inputCount]);

  const commit = (next: string[]) => {
    setCode(next);
    onCodeChange?.(next.join(""));
  };

  const handleChange = (text: string, index: number) => {
    const digits = text.replace(/\D/g, "");
    if (text.length > 0 && digits.length === 0) return; // reject non-digits

    // Paste/autofill — not an overwrite where RN appends ("1" + "2" → "12")
    const isPaste =
      digits.length > 1 && (!code[index] || digits.length >= inputCount);

    if (isPaste) {
      commit(toDigits(digits, inputCount));
      refs.current[Math.min(digits.length, inputCount) - 1]?.focus();
      return;
    }

    const next = [...code];
    next[index] = digits.slice(-1);
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
    <ThemedView style={[styles.container, style]}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          style={[
            styles.input,
            inputStyle,
            {
              borderColor: focused === index ? theme.primary : theme.border,
              color: theme.text,
            },
          ]}
          placeholder="-"
          maxLength={inputCount}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          onFocus={() => setFocused(index)}
          onBlur={() => setFocused(null)}
        />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
    textAlign: "center",
  },
});
