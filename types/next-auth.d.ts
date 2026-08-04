import type { DefaultSession } from 'next-auth';
import type { StaffRole } from '@/lib/auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id?: string;
      role?: StaffRole;
    };
  }

  interface User {
    role: StaffRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: StaffRole;
  }
}
