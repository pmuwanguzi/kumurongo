import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  // Define protected route patterns
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/chat");

  // Define auth routes (login/signup)
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/signup");

  // If trying to access protected route without being logged in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // If already logged in and trying to access login/signup
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};