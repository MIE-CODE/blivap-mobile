import { asRecord, listFromResponse, pickString } from "./api-lists";
import { parseWelfare, WelfareView } from "./welfare";

export type AppBooking = {
  id: string;
  status: string;
  scheduledAt: string;
  donorUserId: string;
  requesterName: string;
  requesterAvatar: string;
  donorName: string;
  donorAvatar: string;
  hospitalName: string;
  bloodType: string;
  description: string;
  meetingCode?: string;
  welfare?: WelfareView;
};

export function bookingStatusLabel(status: string): string {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Declined";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
    case "completed":
      return "Completed";
    case "no_show":
      return "No show";
    case "awaiting_welfare_funding":
      return "Awaiting welfare";
    default:
      return status.replace(/_/g, " ");
  }
}

export function normalizeBookingStatus(status: string): string {
  const lower = status.trim().toLowerCase();
  if (lower === "declined") return "rejected";
  return lower;
}

/** Matches backend meetup grace after scheduledAt (default 48h). */
const MEETUP_GRACE_MS = 48 * 60 * 60 * 1000;

/** Accepted booking still within the meetup window. */
export function isActiveAcceptedBooking(booking: Pick<AppBooking, "status" | "scheduledAt">): boolean {
  if (normalizeBookingStatus(booking.status) !== "accepted") return false;
  const scheduled = new Date(booking.scheduledAt).getTime();
  if (Number.isNaN(scheduled)) return true;
  return Date.now() <= scheduled + MEETUP_GRACE_MS;
}

/** Finished, cancelled, expired, or past the meetup window. */
export function isPastBooking(booking: Pick<AppBooking, "status" | "scheduledAt">): boolean {
  const status = normalizeBookingStatus(booking.status);
  if (status === "pending" || status === "awaiting_welfare_funding") return false;
  if (status === "accepted") return !isActiveAcceptedBooking(booking);
  return true;
}

export function pastBookingLabel(booking: Pick<AppBooking, "status" | "scheduledAt">): string {
  const status = normalizeBookingStatus(booking.status);
  if (status === "accepted" && isPastBooking(booking)) return "Expired";
  return bookingStatusLabel(status);
}

function personFrom(ref: unknown): { name: string; image: string; bloodType: string } {
  const record = asRecord(ref);
  if (!record) return { name: "", image: "", bloodType: "" };
  const first = pickString(record.firstname) ?? pickString(record.firstName) ?? "";
  const last = pickString(record.lastname) ?? pickString(record.lastName) ?? "";
  const name =
    `${first} ${last}`.trim() ||
    pickString(record.name) ||
    pickString(record.displayName) ||
    "";
  return {
    name,
    image: pickString(record.profileImage) ?? "",
    bloodType: pickString(record.bloodType) ?? "",
  };
}

function refId(ref: unknown): string {
  if (typeof ref === "string") return ref;
  const record = asRecord(ref);
  return pickString(record?.id) ?? pickString(record?._id) ?? "";
}

export function parseBookings(
  body: unknown,
  options?: { hideUnfunded?: boolean },
): AppBooking[] {
  return listFromResponse(body).flatMap((item) => {
    const record = asRecord(item);
    if (!record || record.isDeleted === true) return [];
    const id = pickString(record.id) ?? pickString(record._id);
    const scheduledAt = pickString(record.scheduledAt);
    const rawStatus = pickString(record.status);
    const status = rawStatus ? normalizeBookingStatus(rawStatus) : "";
    const donorUserId = refId(record.donorUserId);
    if (!id || !scheduledAt || !status || !donorUserId) return [];
    if (status === "awaiting_welfare_funding" && options?.hideUnfunded) {
      return [];
    }

    const requester = personFrom(record.requesterId);
    const donor = personFrom(record.donorUserId);
    const hospital = asRecord(record.hospitalId);
    const hospitalName =
      pickString(hospital?.name) ??
      [pickString(hospital?.addressLine), pickString(hospital?.city)]
        .filter(Boolean)
        .join(", ");

    return [
      {
        id,
        status,
        scheduledAt,
        donorUserId,
        requesterName: requester.name || "Requester",
        requesterAvatar: requester.image,
        donorName: donor.name || "Donor",
        donorAvatar: donor.image,
        hospitalName: hospitalName || "Hospital",
        bloodType: donor.bloodType || requester.bloodType || "—",
        description: `Donation scheduled for ${new Date(scheduledAt).toLocaleString()}`,
        meetingCode: sixDigitCode(record.meetingCode ?? record.meeting_code),
        welfare: parseWelfare(record.welfare) ?? undefined,
      },
    ];
  });
}

export function parseBooking(body: unknown): AppBooking | null {
  const root = asRecord(body);
  const data = root?.data ?? body;
  return parseBookings({ data: [data] })[0] ?? null;
}

/** Status and meeting code returned by accept or decline. */
export function parseBookingPatch(body: unknown): Partial<AppBooking> | null {
  const parsed = parseBooking(body);
  if (parsed) {
    return {
      status: parsed.status,
      ...(parsed.meetingCode ? { meetingCode: parsed.meetingCode } : {}),
    };
  }

  const root = asRecord(body);
  const data = asRecord(root?.data) ?? root;
  if (!data) return null;
  const statusRaw = pickString(data.status);
  const meetingCode = sixDigitCode(data.meetingCode ?? data.meeting_code);
  const patch: Partial<AppBooking> = {};
  if (statusRaw) patch.status = normalizeBookingStatus(statusRaw);
  if (meetingCode) patch.meetingCode = meetingCode;
  return Object.keys(patch).length ? patch : null;
}

function sixDigitCode(value: unknown): string | undefined {
  const raw = pickString(value);
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 6) return digits;
  return raw;
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
