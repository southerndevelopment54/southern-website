import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["zh", "en"];
const defaultLocale = "zh";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if path already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Skip paths that should not be internationalized
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Get locale from cookie or use default
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|images|fonts|favicon|.*\\..*).*)"],
};
