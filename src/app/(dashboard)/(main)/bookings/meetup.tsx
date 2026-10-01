import { MeetupScreen } from "@/components/ui/bookings/meetup-screen";
import { useLocalSearchParams } from "expo-router";

export default function MeetupRoute() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string | string[] }>();
  const id = Array.isArray(bookingId) ? bookingId[0] : (bookingId ?? "");
  return <MeetupScreen bookingId={id} />;
}
