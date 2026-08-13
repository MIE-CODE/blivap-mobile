import { Redirect, Stack } from "expo-router";
import { useAppSelector } from "../../../stores/hooks";

export default function AppLayout() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!user?.profileImage) return <Redirect href="/avatar" />;

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
}
