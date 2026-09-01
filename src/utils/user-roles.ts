export function hasRole(roles: string[] | undefined, role: string) {
  return roles?.includes(role) ?? false;
}

export function isDonor(roles: string[] | undefined) {
  return hasRole(roles, "donor");
}
