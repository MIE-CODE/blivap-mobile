import AppTabs from "@/components/app-tabs";
import { Redirect } from "expo-router";
import { useAppSelector } from "../../../stores/hooks";

export default function TabLayout() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!user?.emailVerified) return <Redirect href="/verify-otp" />;
  if (!user?.profileImage) return <Redirect href="/avatar" />;
  return <AppTabs />;
}
