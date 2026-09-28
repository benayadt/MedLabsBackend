import type { DefaultSession } from 'next-auth';

// Extends NextAuth's built-in types with the Keycloak realm roles we surface
// on the session (see lib/auth/options.ts). This session data is currently
// only used to prove the frontend can authenticate against Keycloak; it
// does not yet drive the app's role-based UI, which still uses the locally
// simulated user in lib/store/user-store.ts.
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      roles: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles?: string[];
    accessToken?: string;
  }
}
