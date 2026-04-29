import { next, rewrite } from "@vercel/functions";
import {
  ACCESS_COOKIE,
  SIX_ACCESS_COOKIE,
  clearCookie,
  isValidAccessPayload,
  readCookie,
  readSignedToken,
} from "./lib/year-auth.mjs";

const protectedRoutes = new Map([
  ["/one_year.html", { cookie: ACCESS_COOKIE, locked: "year", destination: "/api/year-page" }],
  ["/one_year", { cookie: ACCESS_COOKIE, locked: "year", destination: "/api/year-page" }],
  ["/six_months.html", { cookie: SIX_ACCESS_COOKIE, locked: "six", area: "six", destination: "/api/six-page" }],
  ["/six_months", { cookie: SIX_ACCESS_COOKIE, locked: "six", area: "six", destination: "/api/six-page" }],
]);

export default async function middleware(request) {
  const route = protectedRoutes.get(new URL(request.url).pathname);

  if (!route) {
    return next();
  }

  const accessToken = readCookie(request, route.cookie);
  const access = await readSignedToken(accessToken);
  const validAccess = isValidAccessPayload(access) && (!route.area || access.area === route.area);

  if (validAccess) {
    return rewrite(new URL(route.destination, request.url));
  }

  const url = new URL("/index.html", request.url);
  url.searchParams.set("locked", route.locked);

  const headers = new Headers({ Location: url.toString() });
  if (accessToken) {
    headers.append("Set-Cookie", clearCookie(route.cookie, request));
  }

  return new Response(null, { status: 302, headers });
}

export const config = {
  matcher: ["/one_year.html", "/one_year", "/six_months.html", "/six_months"],
  runtime: "edge",
};
