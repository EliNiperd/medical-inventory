export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Redirige al usuario al dashboard después de iniciar sesión
    async redirect({ url, baseUrl }) {
      // url es la URL a la que el usuario intentaba acceder
      // baseUrl es la URL base de tu aplicación (medical-inventory.eliconacento.com)

      // Si la URL es la URL de inicio de sesión, redirige al dashboard
      if (url.startsWith(`${baseUrl}/login`)) {
        return `${baseUrl}/dashboard`;
      }
console.log("Redirigiendo a:", url);
      // De lo contrario, regresa a la URL original
      return url;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
console.log("isLoggedIn:", isLoggedIn, "isOnDashboard:", isOnDashboard, "nextUrl:", nextUrl.pathname);
      // Si el usuario intenta acceder al dashboard y no ha iniciado sesión, redirige al login
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      // Si el usuario ha iniciado sesión y no está en una página del dashboard, no lo redirijas
      return true;
    },
  },

  /*authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!(auth === null || auth === void 0
      ? void 0
      : auth.user);
    const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
    if (isOnDashboard) {
      if (isLoggedIn) return true;
      return false; // Redirect unauthenticated users to /login
    } else if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return true;
  },
},*/
  providers: [], // Add a list of authentication providers here
};
