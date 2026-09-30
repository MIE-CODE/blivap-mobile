import { formatNaira } from "@/utils/currency";
import { asRecord, pickString } from "./api-lists";

export type WelfareLine = {
  code: string;
  label: string;
  amountKobo: number;
};

export type WelfareView = {
  status: string;
  currency: string;
  distanceKm: number;
  lines: WelfareLine[];
  totalKobo: number;
  label?: string;
  coveredByRequesterLabel?: string;
  reservedLabel?: string;
  reimbursementLabel?: string;
  creditedToWallet: boolean;
};

export type WelfareWalletEntry = {
  bookingId: string;
  amountKobo: number;
  type: string;
  label: string;
  createdAt: string | null;
};

export type WelfareWallet = {
  availableKobo: number;
  entries: WelfareWalletEntry[];
};

export function formatKobo(kobo: number) {
  return formatNaira(kobo / 100);
}

export function parseWelfare(value: unknown): WelfareView | null {
  const record = asRecord(value);
  if (!record) return null;
  const lines = Array.isArray(record.lines)
    ? record.lines.flatMap((line) => {
        const row = asRecord(line);
        const label = pickString(row?.label);
        const amountKobo = row?.amountKobo;
        if (!label || typeof amountKobo !== "number") return [];
        return [
          {
            code: pickString(row?.code) ?? "other_eligible",
            label,
            amountKobo,
          },
        ];
      })
    : [];
  if (!lines.length || typeof record.totalKobo !== "number") return null;
  return {
    status: pickString(record.status) ?? "",
    currency: pickString(record.currency) ?? "NGN",
    distanceKm: typeof record.distanceKm === "number" ? record.distanceKm : 0,
    lines,
    totalKobo: record.totalKobo,
    label: pickString(record.label) ?? undefined,
    coveredByRequesterLabel:
      pickString(record.coveredByRequesterLabel) ?? undefined,
    reservedLabel: pickString(record.reservedLabel) ?? undefined,
    reimbursementLabel: pickString(record.reimbursementLabel) ?? undefined,
    creditedToWallet: record.creditedToWallet === true,
  };
}

export function parseWelfareWallet(body: unknown): WelfareWallet {
  const root = asRecord(body);
  const data = asRecord(root?.data) ?? root;
  const availableKobo =
    typeof data?.availableKobo === "number" ? data.availableKobo : 0;
  const entries = Array.isArray(data?.entries)
    ? data.entries.flatMap((entry) => {
        const row = asRecord(entry);
        const label = pickString(row?.label);
        const bookingId = pickString(row?.bookingId);
        if (!label || !bookingId || typeof row?.amountKobo !== "number") {
          return [];
        }
        return [
          {
            bookingId,
            amountKobo: row.amountKobo,
            type: pickString(row.type) ?? "welfare_reimbursement",
            label,
            createdAt: pickString(row.createdAt),
          },
        ];
      })
    : [];
  return { availableKobo, entries };
}
