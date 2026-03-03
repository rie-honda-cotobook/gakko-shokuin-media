import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'メール', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials: { email?: string; password?: string } | undefined) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password || !credentials?.email || !credentials?.password) return null;
        if (credentials.email === email && credentials.password === password) {
          return { id: 'admin', email };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: { role?: string }; user?: { id?: string; email?: string } }) {
      if (user) token.role = 'admin';
      return token;
    },
    // 型の不整合によるビルドエラーを避けるため、ここでは any を利用する
    session({ session, token }: any) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' as const, maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
} as any;

export default NextAuth(authOptions);
