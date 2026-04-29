import { readFile } from "node:fs/promises";
import {
  ACCESS_COOKIE,
  clearCookie,
  isValidAccessPayload,
  readCookie,
  readSignedToken,
} from "../lib/year-auth.mjs";
import { sendResponse } from "../lib/server-response.mjs";

function getHeader(request, name) {
  if (typeof request.headers?.get === "function") {
    return request.headers.get(name) || "";
  }

  return request.headers?.[name.toLowerCase()] || request.headers?.[name] || "";
}

function getRequestUrl(request) {
  try {
    return new URL(request.url);
  } catch {
    const host = getHeader(request, "host") || "loviuanahi.space";
    const proto = getHeader(request, "x-forwarded-proto") || "https";
    return new URL(request.url || "/", `${proto}://${host}`);
  }
}

function redirectToGate(request, accessToken = "") {
  const url = new URL("/index.html", getRequestUrl(request));
  url.searchParams.set("locked", "year");

  const headers = new Headers({
    Location: url.toString(),
    "Cache-Control": "no-store",
  });

  if (accessToken) {
    headers.append("Set-Cookie", clearCookie(ACCESS_COOKIE, request));
  }

  return new Response(null, { status: 302, headers });
}

async function hasValidAccess(request) {
  const accessToken = readCookie(request, ACCESS_COOKIE);
  const access = await readSignedToken(accessToken);

  return {
    accessToken,
    valid: isValidAccessPayload(access),
  };
}

async function serveYearPage() {
  const html = await readFile(new URL("../one_year.html", import.meta.url), "utf8");

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

export default async function handler(request, nodeResponse) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    const response = new Response("Method not allowed", { status: 405 });
    return sendResponse(response, nodeResponse);
  }

  const { accessToken, valid } = await hasValidAccess(request);
  const response = valid ? await serveYearPage() : redirectToGate(request, accessToken);

  return sendResponse(response, nodeResponse);
}
