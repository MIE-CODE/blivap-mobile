import { asRecord, listFromResponse, pickString } from "./api-lists";
import { parseWelfare, WelfareView } from "./welfare";

export type AppBooking = {
  id: string;
  status: string;
  scheduledAt: string;
  donorUserId: string;
  requesterName: string;
  requesterAvatar: string;
  hospitalName: string;
  bloodType: string;
  description: string;
  welfare?: WelfareView;
};

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
    const status = pickString(record.status);
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
        hospitalName: hospitalName || "Hospital",
        bloodType: donor.bloodType || "—",
        description: `Donation scheduled for ${new Date(scheduledAt).toLocaleString()}`,
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
