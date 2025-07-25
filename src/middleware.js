import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname.startsWith("/adminPage") && !token?.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (req.nextUrl.pathname.startsWith("/my-estimates") && !token) {
       return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: "/login", 
    },
  }
);

export const config = {
  matcher: ["/adminPage/:path*", "/my-estimates/:path*"],
};