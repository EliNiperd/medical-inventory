import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
//import { sql } from "@vercel/postgres";
import sql from '@/app/lib/postgresql';
//import { prisma } from "@/app/lib/prisma";
//import { z } from "zod";
import { authConfig } from './auth.config';

async function getUser(email) {
  try {
    const user = await sql`SELECT * FROM "Users" WHERE email=${email}`;

    return user[0];
  } catch (error) {
    //pool.end();
    // console.error('Failed to fetch user:', error); // 🔍Usar solo para Debug
    throw new Error('Failed to fetch user.', error);
  }
}
export const { auth, signIn, signOut } = NextAuth(
  Object.assign(Object.assign({}, authConfig), {
    providers: [
      Credentials({
        async authorize(credentials) {
          //const { email, password } = credentials;

          const user = await getUser(credentials.email);
          if (!user) return null;

          // Comparar la contraseña proporcionada con el hash almacenado
          const passwordsMatch = bcrypt.compare(credentials.password, user.password);

          //console.log(passwordsMatch, user);
          if (passwordsMatch) return user;
          // }

          //console.log("Invalid credentials");
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
  })
);
