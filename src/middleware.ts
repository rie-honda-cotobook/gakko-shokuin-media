import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: { signIn: '/admin/login' },
});

export const config = {
  matcher: [
    '/admin',
    '/admin/articles/:path*',
    '/admin/media/:path*',
    '/admin/authors/:path*',
    '/admin/dashboard/:path*',
    '/admin/monitor-pages/:path*',
    '/admin/monitor-events/:path*',
  ],
};
