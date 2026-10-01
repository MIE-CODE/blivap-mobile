import { asRecord, listFromResponse, pickString } from "./api-lists";

export type MeetupParticipant = {
  userId?: string;
  role?: string;
  meetingCode?: string;
  identityVerified?: boolean;
  meetupVerified?: boolean;
};

export type MeetupSession = {
  id: string;
  status: string;
  chatEnabled: boolean;
  expiresAt?: string;
  codeVerificationEnabled?: boolean;
  requesterDonationConfirmed: boolean;
  donorDonationConfirmed: boolean;
  verificationGateSatisfied?: boolean;
  meetingCode?: string;
  myMeetingCode?: string;
  requesterMeetingCode?: string;
  donorMeetingCode?: string;
  requesterCodeVerifiedAt?: string;
  donorCodeVerifiedAt?: string;
  qrConsumedAt?: string;
  bookingId?: string;
  requesterUserId?: string;
  donorUserId?: string;
  me: MeetupParticipant;
  peer: MeetupParticipant;
};

export type MeetupEnsureSession = {
  sessionId: string;
  meetingCode?: string;
  myMeetingCode?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  createdAt?: string;
  roleLabel?: string;
  senderUserId?: string;
};

function pickBool(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function codeOf(value: unknown): string | undefined {
  const raw = pickString(value);
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits.length === 6 ? digits : raw;
}

function unwrap(body: unknown): Record<string, unknown> | null {
  let current = asRecord(body);
  for (let depth = 0; depth < 3 && current; depth += 1) {
    const next = asRecord(current.data);
    if (!next) break;
    if (
      next.id ||
      next.sessionId ||
      next.status ||
      next.me ||
      next.messages
    ) {
      current = next;
      continue;
    }
    break;
  }
  return current;
}

function parseParticipant(raw: unknown): MeetupParticipant {
  const record = asRecord(raw);
  if (!record) return {};
  const roleRaw = pickString(record.role ?? record.participantRole)?.toLowerCase();
  const role =
    roleRaw === "requester" || roleRaw === "donor" ? roleRaw : undefined;
  const meetupVerified = pickBool(
    record.meetupVerified ??
      record.meetup_verified ??
      record.sessionVerified ??
      record.verified,
  );
  return {
    ...(pickString(record.userId ?? record.id) ?
      { userId: pickString(record.userId ?? record.id)! }
    : {}),
    ...(role ? { role } : {}),
    ...(codeOf(record.meetingCode ?? record.meeting_code) ?
      { meetingCode: codeOf(record.meetingCode ?? record.meeting_code) }
    : {}),
    ...(pickBool(record.identityVerified ?? record.identity_verified) !==
    undefined ?
      {
        identityVerified: pickBool(
          record.identityVerified ?? record.identity_verified,
        ),
      }
    : {}),
    ...(meetupVerified !== undefined ? { meetupVerified } : {}),
  };
}

export function parseMeetupEnsure(body: unknown): MeetupEnsureSession | null {
  const record = unwrap(body);
  if (!record) return null;
  const sessionId = pickString(record.sessionId ?? record.session_id ?? record.id);
  if (!sessionId) return null;
  return {
    sessionId,
    meetingCode: codeOf(record.meetingCode ?? record.meeting_code),
    myMeetingCode: codeOf(
      record.myMeetingCode ?? record.my_meeting_code ?? record.viewerMeetingCode,
    ),
  };
}

export function parseMeetupSession(body: unknown): MeetupSession | null {
  const record = unwrap(body);
  if (!record) return null;
  const id = pickString(record.id ?? record.sessionId ?? record._id);
  if (!id) return null;

  const booking = asRecord(record.booking);
  const bookingId =
    pickString(record.bookingId ?? record.booking_id) ??
    pickString(booking?.id ?? booking?._id) ??
    undefined;
  const requesterCodeVerifiedAt =
    pickString(record.requesterCodeVerifiedAt ?? record.requester_code_verified_at) ??
    undefined;
  const donorCodeVerifiedAt =
    pickString(record.donorCodeVerifiedAt ?? record.donor_code_verified_at) ??
    undefined;
  const qrConsumedAt =
    pickString(record.qrConsumedAt ?? record.qr_consumed_at) ?? undefined;

  let verificationGateSatisfied = pickBool(
    record.verificationGateSatisfied ??
      record.verification_gate_satisfied ??
      record.donationConfirmEnabled,
  );
  if (verificationGateSatisfied !== true && requesterCodeVerifiedAt && donorCodeVerifiedAt) {
    verificationGateSatisfied = true;
  }
  if (verificationGateSatisfied !== true && qrConsumedAt) {
    verificationGateSatisfied = true;
  }

  const me = parseParticipant(record.me);
  const peer = parseParticipant(record.peer);
  if (me.meetupVerified === undefined && me.role === "requester") {
    me.meetupVerified = Boolean(requesterCodeVerifiedAt);
  }
  if (peer.meetupVerified === undefined && me.role === "requester") {
    peer.meetupVerified = Boolean(donorCodeVerifiedAt);
  }
  if (me.meetupVerified === undefined && me.role === "donor") {
    me.meetupVerified = Boolean(donorCodeVerifiedAt);
  }
  if (peer.meetupVerified === undefined && me.role === "donor") {
    peer.meetupVerified = Boolean(requesterCodeVerifiedAt);
  }

  return {
    id,
    status: (pickString(record.status) ?? "active").toLowerCase(),
    chatEnabled: pickBool(record.chatEnabled ?? record.chat_enabled) ?? true,
    expiresAt: pickString(record.expiresAt ?? record.expires_at) ?? undefined,
    codeVerificationEnabled: pickBool(
      record.codeVerificationEnabled ?? record.code_verification_enabled,
    ),
    requesterDonationConfirmed:
      pickBool(
        record.requesterDonationConfirmed ?? record.requester_donation_confirmed,
      ) ?? false,
    donorDonationConfirmed:
      pickBool(record.donorDonationConfirmed ?? record.donor_donation_confirmed) ??
      false,
    verificationGateSatisfied,
    meetingCode: codeOf(record.meetingCode ?? record.meeting_code ?? booking?.meetingCode),
    myMeetingCode: codeOf(record.myMeetingCode ?? record.my_meeting_code),
    requesterMeetingCode: codeOf(
      record.requesterMeetingCode ??
        record.requester_meeting_code ??
        booking?.requesterMeetingCode,
    ),
    donorMeetingCode: codeOf(
      record.donorMeetingCode ?? record.donor_meeting_code ?? booking?.donorMeetingCode,
    ),
    requesterCodeVerifiedAt,
    donorCodeVerifiedAt,
    qrConsumedAt,
    bookingId,
    requesterUserId:
      pickString(record.requesterUserId ?? record.requesterId ?? booking?.requesterId) ??
      undefined,
    donorUserId:
      pickString(record.donorUserId ?? booking?.donorUserId) ?? undefined,
    me,
    peer,
  };
}

export function meetupUserIsRequester(
  session: MeetupSession,
  userId: string,
): boolean | null {
  if (session.requesterUserId === userId) return true;
  if (session.donorUserId === userId) return false;
  const role = session.me.role?.toLowerCase();
  if (role === "requester") return true;
  if (role === "donor") return false;
  return null;
}

export function meetupGateSatisfied(session: MeetupSession): boolean {
  if (session.verificationGateSatisfied === true) return true;
  if (session.status === "completed") return true;
  if (session.requesterCodeVerifiedAt && session.donorCodeVerifiedAt) return true;
  if (session.qrConsumedAt) return true;
  return session.me.meetupVerified === true && session.peer.meetupVerified === true;
}

export function meetupReadOnly(session: MeetupSession): boolean {
  const status = session.status.toLowerCase();
  return status === "completed" || status === "expired" || status === "cancelled";
}

export function resolveMyMeetupCode(
  session: MeetupSession,
  hint: string | undefined,
  userId: string | undefined,
): string | undefined {
  const explicit = session.myMeetingCode ?? session.me.meetingCode;
  if (explicit) return explicit;
  const isRequester = userId ? meetupUserIsRequester(session, userId) : null;
  if (isRequester === true && session.requesterMeetingCode) {
    return session.requesterMeetingCode;
  }
  if (isRequester === false && session.donorMeetingCode) {
    return session.donorMeetingCode;
  }
  return session.meetingCode ?? hint;
}

export function isOwnMeetupCode(
  entered: string,
  myCode: string | undefined,
  session: MeetupSession,
): boolean {
  const digits = entered.replace(/\D/g, "");
  if (!myCode || digits.length !== 6 || digits !== myCode) return false;
  const requester = session.requesterMeetingCode;
  const donor = session.donorMeetingCode;
  if (requester && donor && requester !== donor) return true;
  const mine = session.myMeetingCode ?? session.me.meetingCode;
  const peer = session.peer.meetingCode;
  return Boolean(mine && peer && mine !== peer);
}

export function parseChatMessages(body: unknown): ChatMessage[] {
  const rows = listFromResponse(body);
  const root = unwrap(body);
  const source =
    rows.length > 0 ? rows : Array.isArray(root?.messages) ? root.messages : [];
  const messages = source.flatMap((item) => {
    const record = asRecord(item);
    if (!record) return [];
    const text = pickString(record.text ?? record.body ?? record.content ?? record.message);
    if (!text) return [];
    const id =
      pickString(record.id ?? record._id ?? record.messageId) ??
      `${pickString(record.createdAt) ?? ""}-${text.slice(0, 24)}`;
    return [
      {
        id,
        text,
        createdAt: pickString(record.createdAt ?? record.created_at) ?? undefined,
        roleLabel:
          pickString(
            record.roleLabel ??
              record.role_label ??
              record.senderLabel ??
              record.senderRole,
          ) ?? undefined,
        senderUserId:
          pickString(record.senderUserId ?? record.sender_user_id ?? record.userId) ??
          undefined,
      },
    ];
  });
  return messages.sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
}
