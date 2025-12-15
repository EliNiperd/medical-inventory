// app/lib/auth-actions.js
'use server';

import { signOut } from '@/auth';

export async function signOutAction() {
  await signOut({
    redirectTo: '/login',
  });
}
