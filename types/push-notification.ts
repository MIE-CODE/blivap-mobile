export type PushNotificationEvent =
  | "booking.created"
  | "booking.cancelled"
  | "booking.updated"
  | "meetup.completed"
  | "meetup.scheduled"
  | "verification.approved"
  | "verification.rejected"
  | "donor.approved"
  | "donor.rejected"
  | "donation.request"
  | "wallet.credit"
  | "wallet.debit"
  | (string & {});

export type PushNotificationData = {
  event?: PushNotificationEvent;
  id?: string;
  bookingId?: string;
  meetupId?: string;
  donationId?: string;
  [key: string]: string | undefined;
};

export type RegisterFcmSubscriptionPayload = {
  fcmToken: string;
  userAgent?: string;
};
