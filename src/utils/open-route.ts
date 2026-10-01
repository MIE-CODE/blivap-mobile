import { Href, router } from "expo-router";

/** Open a screen without stacking another copy of the same route. */
export function openRoute(href: Href) {
  router.navigate(href, { dangerouslySingular: true });
}
