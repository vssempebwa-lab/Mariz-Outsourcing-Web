import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { markEmployeeActive } from '@/lib/employees';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type StaffRole = 'super_admin' | 'employee';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  portal: z.enum(['employee']).optional(),
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
        portal: { label: 'Portal', type: 'hidden' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const admin = getSupabaseAdmin();
        const { data: account, error } = await admin
          .from('staff_accounts')
          .select('id, name, email, role, password_hash, auth_user_id, auth_status, status, revoked_at')
          .eq('email', parsed.data.email.toLowerCase())
          .single();

        if (error || !account || account.revoked_at || account.status === 'inactive') {
          return null;
        }

        if (parsed.data.portal === 'employee' && account.role !== 'employee') {
          return null;
        }

        let passwordIsValid = false;

        if (account.auth_user_id) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !anonKey) return null;

          const authClient = createClient(supabaseUrl, anonKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
          const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
            email: parsed.data.email.toLowerCase(),
            password: parsed.data.password,
          });
          passwordIsValid = !authError && authData.user?.id === account.auth_user_id;

          if (passwordIsValid && account.auth_status !== 'active') {
            await markEmployeeActive(account.auth_user_id);
          }
        } else if (account.role === 'super_admin') {
          passwordIsValid = await compare(parsed.data.password, account.password_hash);
        }

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
