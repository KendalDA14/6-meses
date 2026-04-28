const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ACCESS_COOKIE = "year_access";
export const CHALLENGE_COOKIE = "year_challenge";
export const MAX_ATTEMPTS = 6;
export const ACCESS_TTL_SECONDS = 60 * 60 * 24 * 7;
export const CHALLENGE_TTL_SECONDS = 60 * 20;

function getSecret() {
  const env = globalThis.process?.env || {};

  if (env.YEAR_ACCESS_SECRET) {
    return env.YEAR_ACCESS_SECRET;
  }

  if (env.VERCEL_ENV && env.VERCEL_ENV !== "development") {
    throw new Error("YEAR_ACCESS_SECRET is required on Vercel.");
  }

  return "dev-only-local-secret";
}

function bytesToBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function getSigningKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSignedToken(payload) {
  const data = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getSigningKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return `${data}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function readSignedToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [data, signature] = token.split(".");
  if (!data || !signature) {
    return null;
  }

  try {
    const key = await getSigningKey(getSecret());
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      encoder.encode(data),
    );

    if (!valid) {
      return null;
    }

    return JSON.parse(decoder.decode(base64UrlToBytes(data)));
  } catch {
    return null;
  }
}

function getHeader(request, name) {
  const headers = request.headers;

  if (!headers) {
    return "";
  }

  if (typeof headers.get === "function") {
    return headers.get(name) || "";
  }

  return headers[name.toLowerCase()] || headers[name] || "";
}

function getRequestUrl(request) {
  try {
    return new URL(request.url);
  } catch {
    const host = getHeader(request, "host") || "localhost";
    const proto = getHeader(request, "x-forwarded-proto") || "http";
    return new URL(request.url || "/", `${proto}://${host}`);
  }
}

export function readCookie(request, name) {
  const header = getHeader(request, "cookie");
  const cookies = header.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return "";
  }

  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return "";
  }
}

export function makeCookie(name, value, request, maxAge) {
  const isHttps = getRequestUrl(request).protocol === "https:";
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (isHttps) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearCookie(name, request) {
  return makeCookie(name, "", request, 0);
}
