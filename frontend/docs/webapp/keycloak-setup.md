# Keycloak Authentication Setup Guide for MedLabs

## Overview

The MedLabs web app authenticates against the Keycloak realm defined in the
`MedLabsBackend` repository (`keycloak/realm/medlabs-realm.json`), using
[NextAuth.js](https://next-auth.js.org/) with its built-in Keycloak provider.
This replaces the earlier AWS Amplify/Cognito scaffolding, which was never
wired into the app.

## Prerequisites

1. The `MedLabsBackend` Docker Compose stack running locally, so Keycloak is
   reachable at `http://localhost:8081`.
2. A confidential OIDC client in the `medlabs` realm (`medlabs-web` by
   default) with:
   - Standard flow (Authorization Code) enabled
   - Client authentication enabled (confidential client, since NextAuth's
     token exchange happens server-side in Next.js and can safely hold a
     client secret)
   - Redirect URI: `http://localhost:3000/api/auth/callback/keycloak`
   - Web origin: `http://localhost:3000`

## Environment Variables

Create a `.env.local` file (not committed) with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
KEYCLOAK_ISSUER=http://localhost:8081/realms/medlabs
KEYCLOAK_CLIENT_ID=medlabs-web
KEYCLOAK_CLIENT_SECRET=<client secret from the Keycloak realm config>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<any random string for local development>
```

Generate a local `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## Running Locally

```bash
npm install
npm run dev
```

Then:

1. Visit `http://localhost:3000/login`
2. Click **Sign in with Keycloak**
3. Log in with a user created in the `medlabs` realm
4. You'll be redirected back to `/dashboard`

The dashboard header shows two live status widgets:
- **Backend**: a real call to the gateway's `/api/health` endpoint, proving
  the frontend can reach the Spring Boot backend through the gateway.
- **Keycloak**: the signed-in user's email and realm roles, proving the
  frontend can authenticate against Keycloak.

## Roles

The app's `UserRole` type (`ADMIN` / `PATHOLOGIST` / `LAB_TECHNICIAN`) matches
the realm roles defined in `MedLabsBackend`. The signed-in Keycloak session's
roles are available via `useSession()` (see
`app/components/shared/AuthStatus.tsx`), but the dashboard's role-based UI
still uses the separately simulated user in `lib/store/user-store.ts` — see
`docs/webapp/implementation.md` for the current scope and what's deferred to
a later API-integration step.

## Route Protection

`proxy.ts` (Next.js 16's renamed middleware convention) protects all
`/dashboard/**` routes, redirecting unauthenticated requests to `/login`.

## Troubleshooting

### "invalid_client" error during sign-in

- Confirm `KEYCLOAK_CLIENT_ID` and `KEYCLOAK_CLIENT_SECRET` match the
  Keycloak realm's client configuration exactly.
- Confirm the client's redirect URI is exactly
  `http://localhost:3000/api/auth/callback/keycloak`.

### Redirect loop back to `/login`

- Confirm `NEXTAUTH_URL` matches the URL you're actually browsing to
  (`http://localhost:3000`).
- Confirm Keycloak is reachable at the `KEYCLOAK_ISSUER` URL from your
  browser (not just from the Next.js server).

### "Backend unreachable" in the header

- Confirm the `MedLabsBackend` Docker Compose stack is running
  (`docker compose up -d`).
- Confirm `NEXT_PUBLIC_API_URL` points at the gateway (`http://localhost:8080`
  by default).
- Confirm the gateway's `CORS_ALLOWED_ORIGINS` includes
  `http://localhost:3000` (this call is made from the browser).
