import { NextResponse } from "next/server";

// 1. Specify protected and public routes
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie

  // Get the user session from cookies
  const user = req.cookies.get("loggedInUser");

  // 5. Redirect to /login if the user is not authenticated
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && user && !req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// export const config = {
//   matcher: [],
// };
