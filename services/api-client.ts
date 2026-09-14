import AuthService from "./auth.service";
import AvatarsService from "./avatars.service";
import DonorsService from "./donors.service";
import NotificationsService from "./notifications.service";
export const $api = {
  auth: AuthService(),
  avatars: AvatarsService(),
  donors: DonorsService(),
  notifications: NotificationsService(),
};
