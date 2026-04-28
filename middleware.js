import { next } from "@vercel/functions";
import { ACCESS_COOKIE, clearCookie, readCookie, readSignedToken } from "./lib/year-auth.mjs";

export default async function middleware(request) {
  const accessToken = readCookie(request, ACCESS_COOKIE);
  const access = await readSignedToken(accessToken);

  if (access?.ok === true && typeof access.exp === "number" && access.exp > Date.now()) {
    return next();
  }

  const url = new URL("/index.html", request.url);
  url.searchParams.set("locked", "year");

  const headers = new Headers({ Location: url.toString() });
  if (accessToken) {
    headers.append("Set-Cookie", clearCookie(ACCESS_COOKIE, request));
  }

  return new Response(null, { status: 302, headers });
}

export const config = {
  matcher: ["/one_year.html", "/one_year"],
  runtime: "edge",
};
