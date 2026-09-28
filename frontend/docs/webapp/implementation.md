# MedLabs Web App Implementation

## Overview
This document outlines the implementation of the MedLabs web application. It
is a Next.js frontend that authenticates against the MedLabs Keycloak realm
(via NextAuth.js) and calls the MedLabs backend through its gateway.

## Technology Stack
- **Framework**: React with Next.js
- **Authentication**: NextAuth.js with the Keycloak provider (see
  `docs/webapp/keycloak-setup.md`)
- **Styling**: Tailwind CSS

## Project Structure
```
MedLabs/
├── docs/
│   └── webapp/
│       ├── implementation.md
│       └── keycloak-setup.md
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth route handler
│   ├── components/
│   ├── login/
│   └── dashboard/
├── lib/
│   └── auth/                # NextAuth options + JWT role extraction
├── proxy.ts                 # Route protection (Next.js 16 middleware convention)
├── public/
├── package.json
└── next.config.ts
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- The `MedLabsBackend` Docker Compose stack running locally (gateway,
  Keycloak, API)

### Initial Setup Steps

```bash
npm install
npm run dev
```

Then configure the environment variables described in
`docs/webapp/keycloak-setup.md`.

## Authentication Features

### Login Flow
- Redirect-based Keycloak login (Authorization Code flow) via NextAuth.js
- Session management via NextAuth's JWT session strategy
- Realm roles surfaced on the session (see `lib/auth/options.ts`)

### Protected Routes
- `/dashboard/**` requires an authenticated session; unauthenticated
  requests are redirected to `/login` (see `proxy.ts`)

### Current scope and what's deferred
- **Real**: Keycloak login/logout, and a real call to the backend's
  `/api/health` endpoint (both surfaced in the dashboard header as
  `AuthStatus` / `HealthStatus`, to prove connectivity).
- **Still mocked**: all patient/biopsy/report data (`lib/utils/mock-api.ts`,
  `lib/mock-data/*`). Wiring these to the real backend API is a follow-up
  step once those endpoints exist server-side.
- **Still simulated**: the role-based UI (`RoleSimulator`,
  `lib/store/user-store.ts`) uses a locally switchable mock user rather than
  the real signed-in Keycloak user's roles. This lets the UI's permission
  states be previewed without needing multiple real Keycloak accounts during
  this step.

## Next Steps
- [ ] Replace mock API calls with real calls to the backend gateway
- [ ] Drive `lib/store/user-store.ts` from the real Keycloak session's roles
      instead of (or alongside) the RoleSimulator
- [ ] Add social login providers, if needed, at the Keycloak layer
- [ ] Set up multi-factor authentication (MFA) at the Keycloak layer

## Support & Documentation
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)
