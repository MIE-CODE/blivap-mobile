import AuthService from "./auth.service";
import AvatarsService from "./avatars.service";
export const $api = {
  auth: AuthService(),
  avatars: AvatarsService(),
};
