import {
  ACCESS_TOKEN_VERSION,
  ACCESS_TTL_SECONDS,
  SIX_ACCESS_COOKIE,
  createSignedToken,
  makeCookie,
} from "../lib/year-auth.mjs";
import { readJsonPayload, sendResponse } from "../lib/server-response.mjs";

const CODE = "150325";

function jsonResponse(body, status = 200, headers = new Headers()) {
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  return new Response(JSON.stringify(body), { status, headers });
}

function normalizeCode(value) {
  return String(value || "").replace(/\D/g, "");
}

async function handleSixGate(request) {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  let payload = {};

  try {
    payload = await readJsonPayload(request);
  } catch {
    return jsonResponse({ ok: false, message: "C&oacute;digo inv&aacute;lido." }, 400);
  }

  if (normalizeCode(payload.code) !== CODE) {
    return jsonResponse({
      ok: false,
      message: "Ese no era, pruebe otra vez.",
    });
  }

  const headers = new Headers();
  const accessToken = await createSignedToken({
    ok: true,
    area: "six",
    v: ACCESS_TOKEN_VERSION,
    exp: Date.now() + ACCESS_TTL_SECONDS * 1000,
  });

  headers.append(
    "Set-Cookie",
    makeCookie(SIX_ACCESS_COOKIE, accessToken, request, ACCESS_TTL_SECONDS),
  );

  return jsonResponse({
    ok: true,
    redirect: "/six_months.html",
  }, 200, headers);
}

export default async function handler(request, nodeResponse) {
  const response = await handleSixGate(request);
  return sendResponse(response, nodeResponse);
}
