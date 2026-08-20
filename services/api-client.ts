import AuthService from "./auth.service";
import AvatarsService from "./avatars.service";
import DonorsService from "./donors.service";
export const $api = {
  auth: AuthService(),
  avatars: AvatarsService(),
  donors: DonorsService(),
};
