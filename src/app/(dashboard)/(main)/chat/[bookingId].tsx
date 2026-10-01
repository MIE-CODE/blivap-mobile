import { ChatThreadScreen } from "@/components/ui/chat/chat-thread-screen";
import { useLocalSearchParams } from "expo-router";

export default function ChatThreadRoute() {
  const params = useLocalSearchParams<{
    bookingId?: string | string[];
    title?: string | string[];
  }>();
  const bookingId = Array.isArray(params.bookingId)
    ? params.bookingId[0]
    : (params.bookingId ?? "");
  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  return <ChatThreadScreen bookingId={bookingId} title={title} />;
}
