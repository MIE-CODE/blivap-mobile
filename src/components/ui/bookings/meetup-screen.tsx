import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatWhen } from "@/utils/bookings";
import {
  MeetupParticipant,
  MeetupSession,
  isOwnMeetupCode,
  meetupGateSatisfied,
  meetupReadOnly,
  meetupUserIsRequester,
  parseMeetupEnsure,
  parseMeetupSession,
  resolveMyMeetupCode,
} from "@/utils/meetups";
import { openRoute } from "@/utils/open-route";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { useAppSelector } from "../../../../stores/hooks";
import { getErrorMessage } from "../../../../utils/lib";

type MeetupScreenProps = {
  bookingId: string;
};

function statusChip(done: boolean, unknown?: boolean, issue?: boolean) {
  if (unknown) return { text: "—", tone: "#6B7280", background: "#F3F4F6" };
  if (issue) return { text: "No", tone: "#6B7280", background: "#F3F4F6" };
  if (done) return { text: "Done", tone: "#166534", background: "#DCFCE8" };
  return { text: "Needed", tone: "#92400E", background: "#FEF3C7" };
}

function CheckRow({
  label,
  done,
  unknown,
  issue,
}: {
  label: string;
  done: boolean;
  unknown?: boolean;
  issue?: boolean;
}) {
  const chip = statusChip(done, unknown, issue);
  return (
    <ThemedView style={styles.verifyRow}>
      <ThemedText style={styles.verifyLabel}>{label}</ThemedText>
      <ThemedView style={[styles.chip, { backgroundColor: chip.background }]}>
        <ThemedText style={[styles.chipText, { color: chip.tone }]}>
          {chip.text}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

function ParticipantCard({
  title,
  participant,
}: {
  title: string;
  participant: MeetupParticipant;
}) {
  const theme = useTheme();
  const identity =
    participant.identityVerified === true
      ? "done"
      : participant.identityVerified === false
        ? "issue"
        : "unknown";

  return (
    <ThemedView
      style={[
        styles.personCard,
        { backgroundColor: theme.card, borderColor: theme.hairline },
      ]}
    >
      <ThemedText style={styles.personTitle}>{title}</ThemedText>
      <CheckRow
        label="ID"
        done={identity === "done"}
        unknown={identity === "unknown"}
        issue={identity === "issue"}
      />
      <CheckRow label="Meetup" done={participant.meetupVerified === true} />
    </ThemedView>
  );
}

export function MeetupScreen({ bookingId }: MeetupScreenProps) {
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const ninOk = user?.nationalIdentificationNumberVerified === true;
  const [session, setSession] = useState<MeetupSession | null>(null);
  const [meetingHint, setMeetingHint] = useState<string | undefined>();
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const loadSession = useCallback(async () => {
    if (!bookingId) {
      setError("This meetup is missing a booking.");
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const ensured = await $api.meetups.ensureSession(bookingId);
      const parsedEnsure = parseMeetupEnsure(ensured);
      if (!parsedEnsure?.sessionId) {
        setError("Could not open the meetup for this booking.");
        return;
      }
      const hint = parsedEnsure.myMeetingCode ?? parsedEnsure.meetingCode;
      if (hint) setMeetingHint(hint);
      const body = await $api.meetups.getSession(parsedEnsure.sessionId);
      const parsed = parseMeetupSession(body);
      if (!parsed) {
        setError("Could not read the meetup session.");
        return;
      }
      setSession(parsed);
    } catch (err) {
      setError(getErrorMessage(err, "Could not open the meetup. Try again."));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const sessionId = session?.id;
  const sessionClosed = session ? meetupReadOnly(session) : true;

  useEffect(() => {
    if (!sessionId || sessionClosed) return;
    const timer = setInterval(() => {
      void (async () => {
        try {
          const body = await $api.meetups.getSession(sessionId);
          const parsed = parseMeetupSession(body);
          if (parsed) setSession(parsed);
        } catch {
          /* keep the last good session while polling */
        }
      })();
    }, 12000);
    return () => clearInterval(timer);
  }, [sessionClosed, sessionId]);

  const isRequester = useMemo(
    () =>
      session && user?.id ? meetupUserIsRequester(session, user.id) : null,
    [session, user?.id],
  );
  const readOnly = session ? meetupReadOnly(session) : false;
  const gateSatisfied = session ? meetupGateSatisfied(session) : false;
  const myCode = session
    ? resolveMyMeetupCode(session, meetingHint, user?.id)
    : meetingHint;
  const myDonationDone =
    isRequester === true
      ? session?.requesterDonationConfirmed === true
      : isRequester === false
        ? session?.donorDonationConfirmed === true
        : false;
  const peerDonationDone =
    isRequester === true
      ? session?.donorDonationConfirmed === true
      : isRequester === false
        ? session?.requesterDonationConfirmed === true
        : false;
  const donationComplete =
    session?.status === "completed" ||
    (session?.requesterDonationConfirmed === true &&
      session.donorDonationConfirmed === true);
  const showCodePath =
    session &&
    session.codeVerificationEnabled !== false &&
    !readOnly &&
    !gateSatisfied;

  const verifyCode = async () => {
    if (!session) return;
    const digits = codeInput.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      setLocalError("Enter the other person's six-digit code.");
      return;
    }
    if (isOwnMeetupCode(digits, myCode, session)) {
      setLocalError("Enter the other person's code, not your own.");
      return;
    }
    try {
      setVerifyBusy(true);
      setLocalError(null);
      await $api.meetups.verifyCode(session.id, digits);
      Toast.show({ type: "success", text1: "Verified — thank you." });
      setCodeInput("");
      const body = await $api.meetups.getSession(session.id);
      const parsed = parseMeetupSession(body);
      if (parsed) setSession(parsed);
    } catch (err) {
      setLocalError(getErrorMessage(err, "Could not verify that code."));
    } finally {
      setVerifyBusy(false);
    }
  };

  const confirmDonation = async () => {
    if (!session || isRequester === null) return;
    try {
      setConfirmBusy(true);
      setLocalError(null);
      if (isRequester) await $api.meetups.requesterConfirm(session.id);
      else await $api.meetups.donorConfirm(session.id);
      Toast.show({
        type: "success",
        text1: "Your donation confirmation was recorded.",
      });
      const body = await $api.meetups.getSession(session.id);
      const parsed = parseMeetupSession(body);
      if (parsed) setSession(parsed);
    } catch (err) {
      setLocalError(getErrorMessage(err, "Could not confirm the donation."));
    } finally {
      setConfirmBusy(false);
    }
  };

  return (
    <ThemedView safe style={styles.screen}>
      <Header
        title="Meetup"
        right={
          <Pressable
            style={[styles.infoBtn, { borderColor: theme.border }]}
            onPress={() => setInfoOpen(true)}
          >
            <Feather name="info" size={18} color={theme.text} />
          </Pressable>
        }
      />
      <Modal
        visible={infoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setInfoOpen(false)}>
          <Pressable
            style={[styles.infoCard, { backgroundColor: theme.card }]}
            onPress={() => undefined}
          >
            <ThemedText style={styles.sectionTitle}>How it works</ThemedText>
            <ThemedText style={styles.infoLine}>
              Show your code. Enter theirs.
            </ThemedText>
            <ThemedText style={styles.infoLine}>
              Both verify, then each confirms.
            </ThemedText>
            <ThemedText style={styles.infoLine}>
              ID is your NIN. Meetup is in person.
            </ThemedText>
            <ThemedText style={styles.infoLine}>
              Messages are on the Chat tab.
            </ThemedText>
            <Button onPress={() => setInfoOpen(false)}>Close</Button>
          </Pressable>
        </Pressable>
      </Modal>
      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 32 }} />
      ) : error || !session ? (
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.hairline },
          ]}
        >
          <ThemedText style={styles.cardTitle}>
            {error ?? "Could not load meetup."}
          </ThemedText>
          <Button onPress={() => void loadSession()}>Try again</Button>
        </ThemedView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {!ninOk ? (
            <Pressable
              style={styles.warning}
              onPress={() => openRoute("/donate-blood/verify-identity")}
            >
              <ThemedText style={styles.warningTitle}>Verify NIN</ThemedText>
            </Pressable>
          ) : null}

          {localError ? (
            <ThemedView style={styles.errorBox}>
              <ThemedText style={styles.errorText}>{localError}</ThemedText>
            </ThemedView>
          ) : null}

          <ThemedView
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.hairline },
            ]}
          >
            <ThemedText style={styles.status}>{session.status}</ThemedText>
            {session.expiresAt ? (
              <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                Ends {formatWhen(session.expiresAt)}
              </ThemedText>
            ) : null}
            <ThemedView style={styles.people}>
              <ParticipantCard title="You" participant={session.me} />
              <ParticipantCard title="Them" participant={session.peer} />
            </ThemedView>
          </ThemedView>

          {ninOk && !readOnly && !gateSatisfied ? (
            <ThemedView
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.hairline },
              ]}
            >
              {myCode ? (
                <ThemedView
                  style={[
                    styles.codeBox,
                    {
                      backgroundColor: theme.muted,
                      borderColor: theme.hairline,
                    },
                  ]}
                >
                  <ThemedText style={styles.kicker}>Your code</ThemedText>
                  <ThemedText style={[styles.code, { color: theme.primary }]}>
                    {myCode}
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedText
                  style={[styles.meta, { color: theme.textSecondary }]}
                >
                  Code not ready
                </ThemedText>
              )}
              {showCodePath ? (
                <>
                  <TextInput
                    value={codeInput}
                    onChangeText={(value) =>
                      setCodeInput(value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Their code"
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!verifyBusy}
                    style={[
                      styles.input,
                      {
                        borderColor: theme.hairline,
                        backgroundColor: theme.card,
                        color: theme.text,
                      },
                    ]}
                  />
                  <Button
                    loading={verifyBusy}
                    disabled={verifyBusy}
                    onPress={() => void verifyCode()}
                  >
                    Verify
                  </Button>
                </>
              ) : null}
            </ThemedView>
          ) : null}

          {ninOk && gateSatisfied && !readOnly ? (
            <ThemedView
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.hairline },
              ]}
            >
              <ThemedText style={styles.confirmLine}>
                You · {myDonationDone ? "Confirmed" : "Waiting"}
              </ThemedText>
              <ThemedText style={styles.confirmLine}>
                Them · {peerDonationDone ? "Confirmed" : "Waiting"}
              </ThemedText>
              {!myDonationDone ? (
                <Button
                  loading={confirmBusy}
                  disabled={confirmBusy || isRequester === null}
                  onPress={() => void confirmDonation()}
                >
                  Confirm
                </Button>
              ) : null}
            </ThemedView>
          ) : null}

          {readOnly || donationComplete ? (
            <ThemedView
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.hairline },
              ]}
            >
              <ThemedText style={styles.sectionTitle}>
                {donationComplete ? "Done" : "Closed"}
              </ThemedText>
            </ThemedView>
          ) : null}

          <Pressable
            style={[
              styles.chatRow,
              { backgroundColor: theme.card, borderColor: theme.hairline },
            ]}
            onPress={() =>
              openRoute({
                pathname: "/chat/[bookingId]",
                params: { bookingId },
              })
            }
          >
            <ThemedView
              style={[styles.chatIcon, { backgroundColor: theme.tint }]}
            >
              <Feather name="message-circle" size={18} color={theme.primary} />
            </ThemedView>
            <ThemedView style={styles.chatCopy}>
              <ThemedText style={styles.chatTitle}>Chat</ThemedText>
              <ThemedText
                style={[styles.chatHint, { color: theme.textSecondary }]}
              >
                Message them about this meetup
              </ThemedText>
            </ThemedView>
            <Feather name="chevron-right" size={18} color={theme.textSecondary} />
          </Pressable>
        </ScrollView>
      )}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingBottom: 32,
    gap: 14,
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  infoLine: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  people: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  kicker: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#6B7280",
  },
  status: {
    fontFamily: Fonts.inter.bold,
    fontSize: 20,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  meta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  warning: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  warningTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
    color: "#78350F",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: "#991B1B",
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  personCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: "#FAFAFA",
  },
  personTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
    textTransform: "capitalize",
  },
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "transparent",
  },
  verifyLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#6B7280",
  },
  chip: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
  },
  codeBox: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#FAFAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  code: {
    fontFamily: Fonts.inter.bold,
    fontSize: 32,
    letterSpacing: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.inter.bold,
    fontSize: 20,
    letterSpacing: 6,
    backgroundColor: "#FFFFFF",
  },
  confirmLine: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chatCopy: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  chatTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  chatHint: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
});
