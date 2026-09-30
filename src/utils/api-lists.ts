export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function listFromResponse(body: unknown): unknown[] {
  const root = asRecord(body);
  const data = root?.data ?? body;
  if (Array.isArray(data)) return data;
  const nested = asRecord(data);
  if (nested && Array.isArray(nested.items)) return nested.items;
  if (nested && Array.isArray(nested.data)) return nested.data;
  return [];
}

export function pickString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}
