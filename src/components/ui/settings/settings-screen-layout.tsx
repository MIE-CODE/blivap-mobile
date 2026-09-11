import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

type SettingsScreenLayoutProps = {
  title: string;
  children: ReactNode;
  footerLabel?: string;
  onFooterPress?: () => void;
  footerDisabled?: boolean;
  footerLoading?: boolean;
};

export function SettingsScreenLayout({
  title,
  children,
  footerLabel,
  onFooterPress,
  footerDisabled,
  footerLoading = false,
}: SettingsScreenLayoutProps) {
  const theme = useTheme();

  return (
    <ThemedView safe style={styles.container}>
      <Header title={title} titleStyle={{ color: theme.primary }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
      {footerLabel && onFooterPress ? (
        <ThemedView style={styles.footer}>
          <Button
            size="large"
            onPress={onFooterPress}
            disabled={footerDisabled || footerLoading}
            loading={footerLoading}
            style={styles.footerButton}
          >
            {footerLabel}
          </Button>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 24,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  footerButton: {
    borderRadius: 8,
  },
});
