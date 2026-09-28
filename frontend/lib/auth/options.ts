import type { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { decodeJwtPayload, extractRealmRoles } from './jwt';

// Authenticates against the MedLabs Keycloak realm through the gateway's
// identity provider (see MedLabsBackend's docker-compose.yml and
// keycloak/realm/medlabs-realm.json). Requires these environment variables
// at runtime (see README for local values):
//   KEYCLOAK_ISSUER=http://localhost:8081/realms/medlabs
//   KEYCLOAK_CLIENT_ID=medlabs-web
//   KEYCLOAK_CLIENT_SECRET=<realm client secret>
//   NEXTAUTH_URL=http://localhost:3000
//   NEXTAUTH_SECRET=<random local dev value>
export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      // Keycloak's default "roles" client scope includes realm_access in
      // both the ID token and access token, so either can be decoded here.
      if (account?.id_token) {
        token.roles = extractRealmRoles(decodeJwtPayload(account.id_token));
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles ?? [];
      return session;
    },
  },
};
