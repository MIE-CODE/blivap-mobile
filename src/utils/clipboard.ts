import { Platform, Share } from "react-native";

export async function copyToClipboard(text: string): Promise<boolean> {
  if (
    Platform.OS === "web" &&
    typeof navigator !== "undefined" &&
    navigator.clipboard
  ) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  try {
    const Clipboard = await import("expo-clipboard");
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    await Share.share({ message: text });
    return false;
  }
}
