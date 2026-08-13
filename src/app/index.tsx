import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Carousel } from "@/components/carousel";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";

// function getDevMenuHint() {
//   if (Platform.OS === "web") {
//     return <ThemedText type="small">use browser devtools</ThemedText>;
//   }
//   if (Device.isDevice) {
//     return (
//       <ThemedText type="small">
//         shake device or press <ThemedText type="code">m</ThemedText> in terminal
//       </ThemedText>
//     );
//   }
//   const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
//   return (
//     <ThemedText type="small">
//       press <ThemedText type="code">{shortcut}</ThemedText>
//     </ThemedText>
//   );
// }

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <ThemedView safe>
      <Carousel height={550} autoPlay>
        <ThemedView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Spacer height={254} />
          <ThemedText
            style={{
              textAlign: "center",
              fontSize: 24,
              lineHeight: 22,
            }}
          >
            This space will show penitent the apps main future
          </ThemedText>
          <Spacer height={159} />
          <ThemedText style={{ fontSize: 24, fontWeight: "600" }}>
            WELCOME TO <Text style={{ color: theme.primary }}>BLIVAP</Text>
          </ThemedText>
          <Spacer height={24} />
          <ThemedText style={{ color: theme.border }}>
            Africa’s largest Blood/Spam donation app
          </ThemedText>
        </ThemedView>
        <View style={{ flex: 1, backgroundColor: "#ddd" }} />
        <View style={{ flex: 1, backgroundColor: "#ccc" }} />
      </Carousel>

      <Spacer height={98} />
      <Button
        variant="primary"
        style={styles.btn}
        size="large"
        onPress={() => router.replace("/register")}
      >
        Continue
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
