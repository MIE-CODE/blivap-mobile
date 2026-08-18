import { Image, StyleSheet, Text } from "react-native";

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
    <ThemedView safe style={{ flex: 1 }}>
      <Carousel height={550} autoPlay>
        <ThemedView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dqx8cvr76/image/upload/v1786832394/undraw_online-community_3o0l_d0jbb8.png",
            }}
            style={{ width: "100%", height: 400 }}
            resizeMode="contain"
          />

          <Spacer height={20} />
          <ThemedText style={{ fontSize: 24, fontWeight: "600" }}>
            WELCOME TO <Text style={{ color: theme.primary }}>BLIVAP</Text>
          </ThemedText>
          <Spacer height={24} />
          <ThemedText style={{ color: theme.border }}>
            Africa’s largest Blood/Spam donation app
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dqx8cvr76/image/upload/undraw_sharing-knowledge_2jx3_md6am6.png",
            }}
            style={{ width: "100%", height: 400 }}
            resizeMode="contain"
          />
          <Spacer height={20} />
          <ThemedText style={{ fontSize: 24, fontWeight: "600" }}>
            MEET <Text style={{ color: theme.primary }}>DONORS</Text> NEAR YOU
          </ThemedText>
          <Spacer height={24} />
          <ThemedText style={{ color: theme.border, textAlign: "center" }}>
            Connect with verified blood donors in your area, ready to help when
            it matters most
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dqx8cvr76/image/upload/v1786831935/undraw_medicine_hqqg_tcia33.png",
            }}
            style={{ width: "100%", height: 400 }}
            resizeMode="contain"
          />
          <Spacer height={20} />
          <ThemedText style={{ fontSize: 24, fontWeight: "600" }}>
            SAVE <Text style={{ color: theme.primary }}>LIVES</Text>, SAVE
            SOCIETY
          </ThemedText>
          <Spacer height={24} />
          <ThemedText style={{ color: theme.border, textAlign: "center" }}>
            Every donation counts — join a community making a real difference,
            one drop at a time
          </ThemedText>
        </ThemedView>
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
