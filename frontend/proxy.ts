import { withAuth } from 'next-auth/middleware';

// Protects the dashboard routes at the Next.js routing layer: unauthenticated
// requests are redirected to the Keycloak-backed /login page before any
// dashboard page component renders.
export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
