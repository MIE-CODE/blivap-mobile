import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MembershipPassCard } from "@/components/ui/profile/membership-pass-card";
import { ProfileSettingsItem } from "@/components/ui/profile/profile-settings-item";
import { ProfileStatCard } from "@/components/ui/profile/profile-stat-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { ApiError } from "../../../services/fetcher";
import { $api } from "../../../services/api-client";
import { useAppSelector } from "../../../stores/hooks";

const SETTINGS_ITEMS = [
  {
    label: "Personal Information",
    icon: "user" as const,
    href: "/settings/personal-information",
  },
  {
    label: "Bank Details",
    icon: "credit-card" as const,
    href: "/settings/bank-details",
  },
  {
    label: "Donation History",
    icon: "clock" as const,
    href: "/settings/donation-history",
  },
  {
    label: "Notification Settings",
    icon: "bell" as const,
    href: "/settings/notifications",
  },
  {
    label: "Privacy & Security",
    icon: "shield" as const,
    href: "/settings/privacy-security",
  },
  {
    label: "Help & Support",
    icon: "help-circle" as const,
    href: "/settings/help-support",
  },
] as const;

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const theme = useTheme();
  const [bloodType, setBloodType] = useState("Not registered");
  const [completedDonations, setCompletedDonations] = useState("0");

  useEffect(() => {
    let active = true;
    void $api.donors
      .me()
      .then((res) => {
        if (!active || !res.data) return;
        const profile = res.data;
        const type = profile.bloodType;
        if (typeof type === "string" && type) setBloodType(`${type} Blood Group`);
        const reliability = profile.reliability;
        const completed =
          reliability &&
          typeof reliability === "object" &&
          "completedBookings" in reliability
            ? Number(reliability.completedBookings)
            : null;
        if (completed != null && Number.isFinite(completed)) {
          setCompletedDonations(String(completed));
        }
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) return;
      });
    return () => {
      active = false;
    };
  }, []);

  const displayName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Will";
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
              {bloodType}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <ProfileStatCard value={completedDonations} label="Total Donations" />
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
                onPress={() => router.push(item.href)}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <Button
          variant="outline"
          size="large"
          onPress={() => router.push("/settings/logout")}
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
