import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import sql from '@/app/lib/postgresql';
import { authConfig } from './auth.config';

// console.log('✅ AUTH.JS CARGADO EN PRODUCCIÓN');
// console.log('trustedHosts:', authConfig.trustedHosts);

async function getUser(email) {
  try {
    const user = await sql`SELECT * FROM "Users" WHERE email=${email}`;

    return user[0];
  } catch (error) {
    // console.error('Failed to fetch user:', error); // 🔍Usar solo para Debug
    throw new Error('Failed to fetch user.', error);
  }
}
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // ✅ Asegúrate de que trustedHosts esté AQUÍ
  trustedHosts: [
    'medical-inventory.eliconacento.com',
    'www.medical-inventory.eliconacento.com',
    'https://medical-inventory.eliconacento.com',
    'https://www.medical-inventory.eliconacento.com',
    'medical-inventory.eliconacento.com:443',
  ],

  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await getUser(credentials.email);
        if (!user) return null;

        const passwordsMatch = bcrypt.compare(credentials.password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],

  session: {
    jwt: true,
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
