import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { staffWorkspacePath } from '@/lib/portal-routes';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type StaffRole = 'super_admin' | 'employee';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: process.env.NEXT_PUBLIC_STAFF_ACCESS_PATH || '/ops-slate-7f3c',
  },
  providers: [
    CredentialsProvider({
      name: 'Staff credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { data: account, error } = await getSupabaseAdmin()
          .from('staff_accounts')
          .select('id, name, email, role, password_hash, revoked_at')
          .eq('email', parsed.data.email.toLowerCase())
          .single();

        if (error || !account || account.revoked_at) {
          return null;
        }

        const passwordIsValid = await compare(
          parsed.data.password,
          account.password_hash
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role as StaffRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as typeof user & { role: StaffRole }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as StaffRole;
      }

      return session;
    },
    async redirect({ baseUrl, url }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}${staffWorkspacePath}`;
    },
  },
};
