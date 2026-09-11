/** Strip Nigerian country code for local form editing. */
export function toLocalPhone(phonenumber?: string) {
  if (!phonenumber) return "";
  return phonenumber.replace(/^\+234/, "").replace(/^234/, "");
}

/** Normalize a local or E.164 Nigerian number to `+234...`. */
export function toE164Phone(phonenumber: string) {
  const trimmed = phonenumber.trim();
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("234")) return `+${trimmed}`;
  return `+234${trimmed}`;
}
