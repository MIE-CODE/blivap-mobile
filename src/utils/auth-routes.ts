import { User } from "../../types/user";

export function getPostAuthRoute(user: User) {
  if (!user.emailVerified) return "/verify-otp";
  if (!user.profileImage) return "/avatar";
  return "/home";
}

export const AUTH_ONBOARDING_SCREENS = new Set([
  "verify-otp",
  "avatar",
]);

export const AUTH_ENTRY_SCREENS = new Set([
  "login",
  "register",
  "forgot-password",
  "password-reset-code",
  "set-new-password",
  "success",
]);
