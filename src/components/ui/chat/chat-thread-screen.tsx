import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { config } from "@/constants/env";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ChatMessage, parseChatMessages } from "@/utils/meetups";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { io, Socket } from "socket.io-client";
import { $api } from "../../../../services/api-client";
import { useAppSelector } from "../../../../stores/hooks";
import { getErrorMessage } from "../../../../utils/lib";

type ChatThreadScreenProps = {
  bookingId: string;
  title?: string;
};

function incomingMessage(payload: unknown): ChatMessage | null {
  return parseChatMessages({ data: [payload] })[0] ?? null;
}

export function ChatThreadScreen({ bookingId, title }: ChatThreadScreenProps) {
  const theme = useTheme();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const token = useAppSelector((state) => state.auth.token);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [arrivedBusy, setArrivedBusy] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<ScrollView>(null);

  const load = useCallback(async () => {
    if (!bookingId) return;
    try {
      const body = await $api.chat.messages(bookingId);
      setMessages(parseChatMessages(body));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load messages"),
      });
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!bookingId || !token || !config.apiUrl) return;
    const base = config.apiUrl.replace(/\/$/, "");
    const socket = io(`${base}/chat`, {
      path: "/socket.io",
      autoConnect: false,
      auth: {
        token,
        accessToken: token,
        bearerToken: `Bearer ${token}`,
      },
      query: { token, access_token: token },
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    socketRef.current = socket;

    const join = () => {
      socket.emit("chat:join", {
        donationId: bookingId,
        token,
        accessToken: token,
      });
    };

    socket.on("connect", () => {
      setConnected(true);
      join();
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    socket.on("chat:message", (payload: unknown) => {
      const message = incomingMessage(payload);
      if (!message) return;
      setMessages((current) => {
        if (current.some((row) => row.id === message.id)) return current;
        const withoutOptimistic = current.filter(
          (row) =>
            !row.id.startsWith("local-") ||
            row.text !== message.text ||
            row.senderUserId !== message.senderUserId,
        );
        return [...withoutOptimistic, message];
      });
      setSending(false);
    });
    socket.on("chat:error", (payload: unknown) => {
      setSending(false);
      const record =
        payload && typeof payload === "object"
          ? (payload as { message?: unknown })
          : null;
      const message =
        typeof record?.message === "string" && record.message.trim()
          ? record.message
          : "Could not send that message";
      setMessages((current) =>
        current.filter((row) => !row.id.startsWith("local-")),
      );
      Toast.show({ type: "error", text1: message });
    });
    socket.on("chat:room_closed", () => {
      setConnected(false);
      Toast.show({ type: "info", text1: "This chat is closed" });
    });

    socket.connect();
    return () => {
      socket.emit("chat:leave", { donationId: bookingId });
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [bookingId, token]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text || !bookingId) return;
    const socket = socketRef.current;
    if (!socket?.connected || !token) {
      Toast.show({ type: "error", text1: "Chat is still connecting" });
      return;
    }
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      senderUserId: userId,
    };
    setMessages((current) => [...current, optimistic]);
    setDraft("");
    setSending(true);
    socket.emit("chat:send", {
      donationId: bookingId,
      text,
      token,
      accessToken: token,
    });
  };

  const markArrived = async () => {
    try {
      setArrivedBusy(true);
      await $api.chat.arrived(bookingId);
      setArrived(true);
      Toast.show({
        type: "success",
        text1: "Marked as arrived at the hospital.",
      });
      await load();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not record your arrival"),
      });
    } finally {
      setArrivedBusy(false);
    }
  };

  return (
    <ThemedView safe style={styles.screen}>
      <Header title={title?.trim() || "Donation chat"} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <ThemedText style={[styles.lead, { color: theme.textSecondary }]}>
          {connected ? "Live" : "Connecting…"}
        </ThemedText>
        {loading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
        ) : (
          <ScrollView
            ref={listRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.messages,
              { backgroundColor: theme.card, borderColor: theme.hairline },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length ? (
              messages.map((message) => {
                const mine = message.senderUserId === userId;
                return (
                  <ThemedView
                    key={message.id}
                    style={[
                      styles.bubble,
                      mine
                        ? {
                            backgroundColor: theme.primary,
                            alignSelf: "flex-end",
                          }
                        : [
                            styles.bubbleOther,
                            {
                              backgroundColor: theme.backgroundElement,
                              borderColor: theme.hairline,
                            },
                          ],
                    ]}
                  >
                    <ThemedText
                      style={{
                        color: mine ? "#FFFFFF" : theme.text,
                        fontSize: 13,
                      }}
                    >
                      {message.text}
                    </ThemedText>
                  </ThemedView>
                );
              })
            ) : (
              <ThemedText
                style={[styles.empty, { color: theme.textSecondary }]}
              >
                No messages yet. Say hello below.
              </ThemedText>
            )}
          </ScrollView>
        )}
        {arrived ? (
          <ThemedText style={styles.arrived}>Arrival recorded</ThemedText>
        ) : (
          <Pressable
            style={[
              styles.outlineBtn,
              {
                borderColor: theme.border,
                backgroundColor: theme.card,
              },
            ]}
            disabled={arrivedBusy || !bookingId}
            onPress={() => void markArrived()}
          >
            <ThemedText style={styles.outlineText}>
              {arrivedBusy ? "Saving…" : "I'm here"}
            </ThemedText>
          </Pressable>
        )}
        <ThemedView
          style={[
            styles.composer,
            { borderColor: theme.hairline, backgroundColor: theme.card },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            multiline
            editable={!sending}
            onSubmitEditing={send}
          />
          <Pressable
            style={[
              styles.send,
              { backgroundColor: draft.trim() ? theme.primary : theme.muted },
            ]}
            disabled={!draft.trim() || sending}
            onPress={send}
          >
            <Feather name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  flex: {
    flex: 1,
  },
  lead: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  messages: {
    gap: 8,
    padding: 12,
    backgroundColor: "#FAFAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexGrow: 1,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  role: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  empty: {
    textAlign: "center",
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    marginTop: 24,
  },
  outlineBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  outlineText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
  },
  arrived: {
    marginTop: 10,
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
    color: "#166534",
  },
  composer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontFamily: Fonts.inter.regular,
    fontSize: 15,
    paddingVertical: 8,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
