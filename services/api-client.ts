import AuthService from "./auth.service";
import AvatarsService from "./avatars.service";
import BookingsService from "./bookings.service";
import DonorsService from "./donors.service";
import HospitalsService from "./hospitals.service";
import NotificationsService from "./notifications.service";
import QuestionnaireService from "./questionnaire.service";
import WelfareService from "./welfare.service";
export const $api = {
  auth: AuthService(),
  avatars: AvatarsService(),
  donors: DonorsService(),
  notifications: NotificationsService(),
  questionnaire: QuestionnaireService(),
  bookings: BookingsService(),
  hospitals: HospitalsService(),
  welfare: WelfareService(),
};
