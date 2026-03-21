import withAuth from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(function middleware(_req: NextRequestWithAuth) {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (!token) return false;

      if (path.startsWith("/admin")) return token.role === "admin";
      if (path.startsWith("/employee"))
        return token.role === "employee" || token.role === "admin";
      if (path.startsWith("/customer"))
        return token.role === "customer" || token.role === "admin";

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/customer/:path*"],
};
