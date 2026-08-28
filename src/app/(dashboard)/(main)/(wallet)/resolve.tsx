import Arrow from "@/assets/icons/arrow-back.svg";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, TextInput } from "react-native";

export default function resolved() {
  const [isActive, setIsActive] = useState(0);
  const items = [50000, 100000, 150000, 200000, 250000, 300000];
  const [value, setValue] = useState(items[isActive]);
  const theme = useTheme();
  const changeValue = (i: number) => {
    setValue(items[i]);
    setIsActive(i);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const show = () => setModalOpen(true);
  const hide = () => setModalOpen(false);

  return (
    <ThemedView safe style={{ flex: 1 }}>
      {modalOpen && (
        <Pressable
          onPress={hide}
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            position: "absolute",
          }}
        />
      )}
      <Modal transparent visible={modalOpen} animationType="slide">
        <ThemedView
          style={{
            height: "40%",
            marginTop: "auto",
            backgroundColor: "white",
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 36,
          }}
        >
          <ThemedText>Hello</ThemedText>
        </ThemedView>
      </Modal>

      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Arrow color="black" onPress={() => router.back()} />

        <ThemedText>Withdraw To Bank Account</ThemedText>
        <Spacer width={40} />
      </ThemedView>
      <Spacer width={40} />
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
        <ThemedView>
          <ThemedText
            style={{ fontFamily: Fonts.poppins.regular, fontSize: 16 }}
          >
            FAVOUR EZINNE IKPEAMAH
          </ThemedText>
          <ThemedText
            style={{
              fontFamily: Fonts.poppins.regular,
              fontSize: 16,
              color: theme.textSecondary,
            }}
          >
            1001245689{" "}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <Spacer width={23} />
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
        }}
      >
        <ThemedText
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.text,
            fontFamily: Fonts.poppins.semiBold,
          }}
        >
          Amount
        </ThemedText>
        <Spacer height={38} />
        <TextInput
          style={{ fontSize: 20, fontFamily: Fonts.poppins.medium }}
          value={`N ${value.toLocaleString()}.00`}
        />
        <Spacer height={24} />
        <ThemedView style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {items.map((item, i) => (
            <Pressable
              key={i}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: isActive === i ? theme.primary : "#F6F6F6",
                width: "31%",
              }}
              onPress={() => changeValue(i)}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: isActive === i ? "white" : "#6B7280",
                  textAlign: "center",
                }}
              >
                N {item.toLocaleString()}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <Button style={{ marginTop: "auto" }} onPress={show}>
        Confirm
      </Button>
    </ThemedView>
  );
}
