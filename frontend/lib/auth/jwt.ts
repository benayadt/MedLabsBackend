/**
 * Decodes the payload of a JWT without verifying its signature.
 *
 * This is safe to use here because the token comes directly from Keycloak
 * over a server-to-server OAuth token exchange (see lib/auth/options.ts),
 * not from an untrusted client. It is only used to read the `realm_access`
 * claim; it must not be used to authenticate a request.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Extracts Keycloak realm roles (`realm_access.roles`) from a decoded JWT
 * payload. Returns an empty array if the claim is missing or malformed.
 */
export function extractRealmRoles(payload: Record<string, unknown> | null): string[] {
  if (!payload) return [];

  const realmAccess = payload.realm_access;
  if (!realmAccess || typeof realmAccess !== 'object') return [];

  const roles = (realmAccess as Record<string, unknown>).roles;
  if (!Array.isArray(roles)) return [];

  return roles.filter((role): role is string => typeof role === 'string');
}
