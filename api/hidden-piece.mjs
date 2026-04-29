import { readJsonPayload, sendResponse } from "../lib/server-response.mjs";

const target = {
  left: 5 * 5,
  right: Math.trunc(Math.sqrt(64)),
};

function normalize(value) {
  return String(value || "").replace(/\D/g, "").padStart(2, "0").slice(-2);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function handleHiddenPiece(request) {
  if (request.method !== "POST") {
    const headers = new Headers({ Allow: "POST" });
    return new Response(JSON.stringify({ ok: false }), { status: 405, headers });
  }

  let body = {};

  try {
    body = await readJsonPayload(request);
  } catch {
    return jsonResponse({ ok: false, message: "Algo no calz&oacute;." }, 400);
  }

  const left = normalize(body.left);
  const right = normalize(body.right);
  const isOpen = Number(left) === target.left && Number(right) === target.right;

  if (isOpen) {
    return jsonResponse({
      ok: true,
      message: "&iquest;Me entendistes mi amor? jaja",
    });
  }

  return jsonResponse({
    ok: false,
    message: "Todav&iacute;a no encuentra d&oacute;nde caer.",
  });
}

export default async function handler(request, nodeResponse) {
  const response = await handleHiddenPiece(request);
  return sendResponse(response, nodeResponse);
}
