import type { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { decodeJwtPayload, extractRealmRoles } from './jwt';

// Browser-facing URLs (localhost for the browser to resolve)
const browserUrl = 'http://localhost:8081/realms/medlabs';
// Server-side URLs (internal Docker hostname)
const serverUrl = 'http://keycloak:8081/realms/medlabs';

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'medlabs-web',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? 'medlabs-web-dev-secret',
      issuer: browserUrl,
      // Disable discovery, use explicit endpoints
      wellKnown: undefined,
      // Authorization: browser redirect (use localhost)
      authorization: {
        url: `${browserUrl}/protocol/openid-connect/auth`,
        params: {
          scope: 'openid email profile roles',
        },
      },
      // Token: server-side call (use internal Docker hostname)
      token: {
        url: `${serverUrl}/protocol/openid-connect/token`,
      },
      // Userinfo: server-side call (use internal Docker hostname)
      userinfo: {
        url: `${serverUrl}/protocol/openid-connect/userinfo`,
      },
      jwks_endpoint: `${serverUrl}/protocol/openid-connect/certs`,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
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
  debug: process.env.NODE_ENV === 'development',
};
