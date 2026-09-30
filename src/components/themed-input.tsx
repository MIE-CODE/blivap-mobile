import { useTheme } from "@/hooks/use-theme";
import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Spacer } from "./spacer";
import { ThemedText } from "./themed-text";
interface ThemedInputProps {
  placeholder?: string;
  label?: string;
  value?: string;
  error?: string | boolean;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
}
export const ThemedInput = ({
  placeholder,
  label,
  value,
  isPassword = false,
  keyboardType,
  error,
  disabled = false,
  ...props
}: ThemedInputProps & TextInputProps) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  if (!isPassword) {
    return (
      <View>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Spacer height={4} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              borderColor: hasError ? theme.status.danger : theme.border,
              color: theme.text,
              backgroundColor: disabled
                ? theme.backgroundElement
                : "transparent",
              opacity: disabled ? 0.85 : 1,
            },
          ]}
          value={value}
          editable={!disabled}
          {...props}
        />
        {error && (
          <ThemedText type="xSmall" style={{ color: theme.status.danger }}>
            * {error}
          </ThemedText>
        )}
      </View>
    );
  }
  return (
    <View>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Spacer height={4} />
      <View
        style={[
          styles.passwordContainer,
          {
            borderColor: hasError ? theme.status.danger : theme.border,
          },
        ]}
      >
        <TextInput
          key={showPassword ? "visible" : "hidden"}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.passwordInput, { color: theme.text }]}
          value={value}
          secureTextEntry={!showPassword}
          textAlignVertical="center"
          {...props}
        />
        <Pressable onPress={() => setShowPassword((prev) => !prev)}>
          <Octicons
            name={showPassword ? "eye" : "eye-closed"}
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
      {error && (
        <ThemedText type="xSmall" style={{ color: theme.status.danger }}>
          * {error}
        </ThemedText>
      )}
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
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    margin: 0,
    paddingVertical: 0,
    paddingRight: 12,
    fontSize: 16,
    textAlignVertical: "center",
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
  error: {
    fontSize: 10,
  },
});
