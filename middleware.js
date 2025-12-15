import { auth } from './auth';

export default auth((req) => {
  // lógica opcional
});

export const config = {
  matcher: ['/((?!api/auth|api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
