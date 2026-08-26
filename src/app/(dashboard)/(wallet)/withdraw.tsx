import Arrow from "@/assets/icons/arrow-back.svg";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function withdraw() {
  const theme = useTheme();
  const [details, setDetails] = useState({
    bankName: "",
    accountNumber: "",
  });
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      name: "Access Bank",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      name: "Zenith Bank",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      name: "UBA Bank",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d74",
      name: "Stanbic Bank",
    },
  ];

  interface ItemProps {
    title: string;
  }
  const handleResolved = () => {
    router.push({
      pathname: "/resolve",
      params: { bankName: "uba", accountNumber: "9137437424" },
    });
  };
  const Item = ({ title }: ItemProps) => (
    <Pressable onPress={handleResolved}>
      <ThemedView
        style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
      >
        <ThemedView
          style={{
            width: 39,
            height: 39,
            backgroundColor: "black",
            borderRadius: 39,
          }}
        />
        <ThemedText style={{ fontFamily: Fonts.poppins.regular, fontSize: 16 }}>
          {title}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );

  return (
    <ThemedView safe>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Arrow color="black" onPress={() => router.back()} />

        <ThemedText>Withdraw Money</ThemedText>
        <Spacer width={40} />
      </ThemedView>
      <Spacer height={41} />
      <ThemedView
        style={{
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 2,
          shadowColor: "#00000026",
          backgroundColor: "white",
          elevation: 4,
          shadowOpacity: 1,
          paddingVertical: 21,
          paddingHorizontal: 15,
          borderRadius: 10,
          gap: 10,
        }}
      >
        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: theme.text,
            fontFamily: Fonts.poppins.semiBold,
          }}
        >
          Withdraw to
        </ThemedText>
        <TextInput
          placeholder="Account number?"
          style={{
            backgroundColor: "#9CA3AF33",
            paddingVertical: 7.5,
            paddingHorizontal: 18,
            borderRadius: 5,
            fontSize: 12,
            lineHeight: 22,
          }}
          placeholderTextColor="#6B7280"
          value={details.bankName}
          onChangeText={(v) => setDetails({ accountNumber: v, bankName: "" })}
        />
        <ThemedText style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
          Input your accunt{" "}
        </ThemedText>
      </ThemedView>
      <Spacer height={8} />
      <ThemedText
        style={{
          fontSize: 12,
          color: theme.textSecondary,
          fontFamily: Fonts.poppins.semiBold,
        }}
      >
        Showing matching banks ...
      </ThemedText>
      <Spacer height={8} />
      <FlatList
        contentContainerStyle={{
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 2,
          shadowColor: "#00000026",
          backgroundColor: "white",
          elevation: 4,
          shadowOpacity: 1,
          paddingVertical: 21,
          paddingHorizontal: 15,
          borderRadius: 10,
          gap: 10,
        }}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item title={item.name} />}
      />
    </ThemedView>
  );
}
