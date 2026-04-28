export async function readJsonPayload(request) {
  if (typeof request.json === "function") {
    return request.json();
  }

  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      return JSON.parse(request.body || "{}");
    }

    if (request.body instanceof Uint8Array) {
      return JSON.parse(new TextDecoder().decode(request.body) || "{}");
    }

    if (request.body && typeof request.body === "object") {
      return request.body;
    }
  }

  let body = "";
  for await (const chunk of request) {
    body += chunk;
  }

  return JSON.parse(body || "{}");
}

export async function sendResponse(response, nodeResponse) {
  if (!nodeResponse) {
    return response;
  }

  const body = await response.text();
  const setCookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [];

  for (const [key, value] of response.headers) {
    if (key.toLowerCase() !== "set-cookie") {
      nodeResponse.setHeader(key, value);
    }
  }

  if (setCookies.length > 0) {
    nodeResponse.setHeader("Set-Cookie", setCookies);
  } else {
    const cookie = response.headers.get("set-cookie");
    if (cookie) {
      nodeResponse.setHeader("Set-Cookie", cookie);
    }
  }

  nodeResponse.statusCode = response.status;
  nodeResponse.end(body);
  return undefined;
}
