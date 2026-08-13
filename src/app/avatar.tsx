import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAvatar } from "@/hooks/use-avatar";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function Avatar() {
  const theme = useTheme();
  const { selectAvatar } = useAvatar();
  const [selected, setSelected] = useState(0);
  return (
    <ThemedView safe style={styles.container}>
      <ThemedText style={[styles.title, { color: theme.primary }]}>
        Select Avatar
      </ThemedText>
      <Spacer height={64} />
      <ThemedView style={styles.avatarContainer}>
        {[...Array(12)].map((_, index) => (
          <Pressable
            key={index}
            style={[styles.avatar, selected === index ? styles.selected : ""]}
            onPress={() => setSelected(index)}
          ></Pressable>
        ))}
      </ThemedView>
      <Spacer height={36} />
      <Button size="large" onPress={() => selectAvatar(selected)}>
        Next
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: 51,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingVertical: 41,
    paddingHorizontal: 19,
    borderRadius: 20,
    backgroundColor: "#00000026",
    borderWidth: 1,
    borderColor: "#FFFFFF99",
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#FFFFFF99",
    width: 63.4,
    height: 63.4,
    borderRadius: 100,
    backgroundColor: "#B190B6",
  },
  selected: {
    outlineWidth: 3,
    outlineColor: Colors.softPrimary,
  },
});
