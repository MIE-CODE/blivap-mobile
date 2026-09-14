import { Href } from "expo-router";
import { PushNotificationData, PushNotificationEvent } from "../../types/push-notification";

/**
 * Maps backend push `data.event` values to Expo Router destinations.
 * Extend this map as new domain events are added on the NestJS side.
 */
const EVENT_ROUTES: Record<
  string,
  (data: PushNotificationData) => Href | null
> = {
  "booking.created": (data) =>
    data.bookingId || data.id
      ? ({
          pathname: "/notification",
          params: { bookingId: data.bookingId ?? data.id },
        } as Href)
      : "/notification",
  "booking.cancelled": () => "/notification",
  "booking.updated": (data) =>
    data.bookingId || data.id
      ? ({
          pathname: "/notification",
          params: { bookingId: data.bookingId ?? data.id },
        } as Href)
      : "/notification",
  "meetup.completed": (data) =>
    data.meetupId || data.id
      ? ({
          pathname: "/notification",
          params: { meetupId: data.meetupId ?? data.id },
        } as Href)
      : "/notification",
  "meetup.scheduled": () => "/notification",
  "verification.approved": () => "/donate-blood/medical-questions",
  "verification.rejected": () => "/donate-blood/verify-identity",
  "donor.approved": () => "/donate",
  "donor.rejected": () => "/donate",
  "donation.request": () => "/donate",
  "wallet.credit": () => "/wallet",
  "wallet.debit": () => "/wallet",
};

export function getRouteForPushEvent(
  event: PushNotificationEvent | undefined,
  data: PushNotificationData = {},
): Href {
  if (!event) return "/notification";

  const resolver = EVENT_ROUTES[event];
  if (!resolver) return "/notification";

  return resolver(data) ?? "/notification";
}

export function registerPushEventRoute(
  event: PushNotificationEvent,
  resolver: (data: PushNotificationData) => Href | null,
) {
  EVENT_ROUTES[event] = resolver;
}
