export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,

  // ✅ AGREGA ESTO
  trustedHosts: ['medical-inventory.eliconacento.com', 'www.medical-inventory.eliconacento.com'],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(`${baseUrl}/login`)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },

  providers: [],
};
