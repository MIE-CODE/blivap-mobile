import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MembershipPassCard } from "@/components/ui/profile/membership-pass-card";
import { ProfileSettingsItem } from "@/components/ui/profile/profile-settings-item";
import { ProfileStatCard } from "@/components/ui/profile/profile-stat-card";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Image, ScrollView, StyleSheet } from "react-native";
import { useAppSelector } from "../../../stores/hooks";

const SETTINGS_ITEMS = [
  { label: "Personal Information", icon: "user" as const },
  { label: "Bank Details", icon: "credit-card" as const },
  { label: "Donation History", icon: "clock" as const },
  { label: "Notification Settings", icon: "bell" as const },
  { label: "Privacy & Security", icon: "shield" as const },
  { label: "Help & Support", icon: "help-circle" as const },
];

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const { logOut } = useAuth();
  const theme = useTheme();

  const displayName = user?.firstname ?? "Will";
  const displayEmail = user?.email ?? "will.iam@donation.com";

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.profileSection}>
          <Image
            source={{ uri: user?.profileImage ?? "" }}
            style={[styles.avatar, { borderColor: theme.primary }]}
          />
          <ThemedText style={styles.name}>{displayName}</ThemedText>
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary }}
          >
            {displayEmail}
          </ThemedText>
          <Spacer height={12} />
          <ThemedView
            style={[styles.bloodGroupBadge, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.bloodGroupText}>
              O+ Blood Group
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <ProfileStatCard value="12" label="Total Donations" />
          <ProfileStatCard
            value="2,500"
            label="Blood Points"
            valueColor={theme.status.success}
          />
          <ProfileStatCard value="8" label="Lives Saved" />
        </ThemedView>

        <MembershipPassCard
          tier="Gold Level Donor"
          description="Unlock exclusive rewards, hospital vouchers, and premium checkout priorities with your active digital wallet tier."
        />

        <ThemedView style={styles.settingsSection}>
          <ThemedText
            style={[styles.sectionLabel, { color: theme.textSecondary }]}
          >
            ACCOUNT SETTINGS
          </ThemedText>
          <ThemedView style={[styles.settingsCard, { shadowColor: theme.text }]}>
            {SETTINGS_ITEMS.map((item, index) => (
              <ProfileSettingsItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                showDivider={index < SETTINGS_ITEMS.length - 1}
                onPress={() => {}}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <Button
          variant="outline"
          size="large"
          onPress={logOut}
          style={{
            borderColor: theme.primary,
            backgroundColor: "transparent",
          }}
          textStyle={{
            color: theme.primary,
            fontFamily: Fonts.inter.bold,
            fontSize: 16,
          }}
        >
          Log Out
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 24,
  },
  profileSection: {
    alignItems: "center",
    gap: 4,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    marginBottom: 8,
  },
  name: {
    fontFamily: Fonts.inter.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  bloodGroupBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bloodGroupText: {
    color: "#ffffff",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  settingsSection: {
    gap: 12,
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
});
