import { useTheme } from "@/hooks/use-theme";
import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardTypeOptions,
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
}
export const ThemedInput = ({
  placeholder,
  label,
  value,
  isPassword = false,
  keyboardType,
  error,
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
          style={[
            styles.input,
            {
              borderColor: hasError ? theme.status.danger : theme.border,
              color: theme.text,
            },
          ]}
          value={value}
          secureTextEntry={showPassword}
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
          placeholder={placeholder}
          style={{
            paddingVertical: 13.5,
            paddingRight: 20,
            flex: 1,
            color: theme.text,
          }}
          value={value}
          secureTextEntry={!showPassword}
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
  },
  error: {
    fontSize: 10,
  },
});
