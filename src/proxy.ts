import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "./config/constants";

const AUTH_COOKIE_NAME = "__Secure-app_session";
const REFRESH_COOKIE_NAME = "__Host-rt";
const LOGIN_ROUTE = "/login";
const DEFAULT_REDIRECT = "/dashboard";
const PROTECTED_ROUTES = ["/dashboard", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthPage = pathname === LOGIN_ROUTE;

  if (isProtectedRoute && !accessToken && refreshToken) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const nextResponse = NextResponse.next();
        const setCookie = response.headers.get("set-cookie");

        if (setCookie) {
          nextResponse.headers.set("set-cookie", setCookie);
        }

        return nextResponse;
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isProtectedRoute && !accessToken) {
    const searchParams = new URLSearchParams({ callbackUrl: pathname });
    return NextResponse.redirect(
      new URL(`${LOGIN_ROUTE}?${searchParams}`, request.url),
    );
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
