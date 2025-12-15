import { auth } from './auth';

export default auth((req) => {
  // lógica opcional
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
