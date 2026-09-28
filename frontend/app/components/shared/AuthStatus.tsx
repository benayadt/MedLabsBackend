'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

/**
 * Proves the frontend can authenticate against Keycloak via NextAuth. This
 * reflects the real signed-in Keycloak identity and realm roles, separate
 * from the RoleSimulator, which only switches the locally simulated demo
 * user used to preview role-based UI states.
 */
export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <span className="text-xs text-gray-400">Checking Keycloak session…</span>;
  }

  if (status === 'authenticated' && session?.user) {
    const roles = session.user.roles ?? [];
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span>
          Keycloak: <strong>{session.user.email ?? session.user.name}</strong>
          {roles.length > 0 ? ` (${roles.join(', ')})` : ''}
        </span>
        <button onClick={() => signOut()} className="underline hover:text-gray-900">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('keycloak')}
      className="text-xs text-blue-600 underline hover:text-blue-800"
    >
      Sign in with Keycloak
    </button>
  );
}
