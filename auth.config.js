import { NextAuthConfig } from "next-auth";

export const authConfig = NextAuthConfig({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorize({ auth, nextUrl }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; //redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
});
