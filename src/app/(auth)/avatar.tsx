import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAvatar } from "@/hooks/use-avatar";
import { useTheme } from "@/hooks/use-theme";

import { Image, Pressable, StyleSheet } from "react-native";
import { useAppSelector } from "../../../stores/hooks";
export default function Avatar() {
  const theme = useTheme();
  const { avatars } = useAppSelector((s) => s.avatar);
  const { selectAvatar, select, submit, loading } = useAvatar();
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../../../assets/images/avatar-page-bg.png")}
        resizeMethod="scale"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
      <ThemedText style={[styles.title, { color: theme.primary }]}>
        Select Avatar
      </ThemedText>
      <Spacer height={64} />
      <ThemedView style={styles.avatarContainer}>
        {!avatars?.length ? (
          <>
            {[...Array(12)].map((_, index) => (
              <ThemedView key={index} style={[styles.avatar]}></ThemedView>
            ))}
          </>
        ) : (
          <>
            {avatars?.map((avatar, index) => (
              <Pressable
                key={index}
                style={[
                  styles.avatar,
                  select === avatar ? styles.selected : "",
                ]}
                onPress={() => selectAvatar(avatar)}
              >
                <Image
                  source={{ uri: avatar }}
                  alt="avatar"
                  style={styles.avatar}
                />
              </Pressable>
            ))}
          </>
        )}
      </ThemedView>
      <Spacer height={36} />
      <Button
        size="large"
        onPress={submit}
        loading={loading}
        disabled={loading || !select}
        style={{ marginHorizontal: 20 }}
      >
        Next
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    marginHorizontal: 30,
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#FFFFFF99",
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#B190B6",
  },
  selected: {
    outlineWidth: 3,
    outlineColor: Colors.softPrimary,
  },
});
