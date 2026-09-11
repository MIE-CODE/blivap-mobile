import { DonateOptionsScreen } from "@/components/ui/donate/donate-options-screen";
import { MyDonationsScreen } from "@/components/ui/donate/my-donations-screen";
import { isDonor } from "@/utils/user-roles";
import { useAppSelector } from "../../../../stores/hooks";

export default function DonatePage() {
  const { user } = useAppSelector((s) => s.auth);

  if (isDonor(user?.roles)) {
    return <MyDonationsScreen />;
  }

  return <DonateOptionsScreen />;
}
