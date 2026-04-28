import {
  ACCESS_COOKIE,
  ACCESS_TTL_SECONDS,
  CHALLENGE_COOKIE,
  CHALLENGE_TTL_SECONDS,
  MAX_ATTEMPTS,
  clearCookie,
  createSignedToken,
  makeCookie,
  readCookie,
  readSignedToken,
} from "../lib/year-auth.mjs";
import { chooseRandomQuestion, findQuestionById, isCorrectAnswer } from "../lib/year-questions.mjs";
import { readJsonPayload, sendResponse } from "../lib/server-response.mjs";

function baseHeaders() {
  return new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
}

function jsonResponse(body, status, headers = baseHeaders()) {
  return new Response(JSON.stringify(body), { status, headers });
}

async function issueChallenge(headers, request, question, attempts = 0) {
  const token = await createSignedToken({
    id: question.id,
    attempts,
    iat: Date.now(),
  });

  headers.append(
    "Set-Cookie",
    makeCookie(CHALLENGE_COOKIE, token, request, CHALLENGE_TTL_SECONDS),
  );
}

async function handleQuestion(request) {
  const headers = baseHeaders();
  const currentChallenge = await readSignedToken(readCookie(request, CHALLENGE_COOKIE));
  const currentAttempts = Number.isInteger(currentChallenge?.attempts)
    ? currentChallenge.attempts
    : 0;
  let question = currentChallenge ? findQuestionById(currentChallenge.id) : null;
  let attempts = currentAttempts;

  if (!question || attempts >= MAX_ATTEMPTS) {
    question = chooseRandomQuestion(currentChallenge?.id);
    attempts = 0;
  }

  await issueChallenge(headers, request, question, attempts);

  return jsonResponse(
    {
      question: question.question,
      attemptsLeft: MAX_ATTEMPTS - attempts,
    },
    200,
    headers,
  );
}

async function handleAnswer(request) {
  const headers = baseHeaders();
  let payload = {};

  try {
    payload = await readJsonPayload(request);
  } catch {
    return jsonResponse({ ok: false, message: "Respuesta invalida." }, 400, headers);
  }

  const challenge = await readSignedToken(readCookie(request, CHALLENGE_COOKIE));
  const question = challenge ? findQuestionById(challenge.id) : null;

  if (!challenge || !question) {
    const nextQuestion = chooseRandomQuestion();
    await issueChallenge(headers, request, nextQuestion);

    return jsonResponse(
      {
        ok: false,
        rotated: true,
        question: nextQuestion.question,
        attemptsLeft: MAX_ATTEMPTS,
        message: "La pregunta se actualizo. Intentalo otra vez.",
      },
      200,
      headers,
    );
  }

  if (isCorrectAnswer(question, payload.answer)) {
    const accessToken = await createSignedToken({
      ok: true,
      exp: Date.now() + ACCESS_TTL_SECONDS * 1000,
    });

    headers.append(
      "Set-Cookie",
      makeCookie(ACCESS_COOKIE, accessToken, request, ACCESS_TTL_SECONDS),
    );
    headers.append("Set-Cookie", clearCookie(CHALLENGE_COOKIE, request));

    return jsonResponse(
      {
        ok: true,
        redirect: "/one_year.html",
      },
      200,
      headers,
    );
  }

  const attempts = Math.max(0, Math.min(MAX_ATTEMPTS, Number(challenge.attempts) || 0)) + 1;

  if (attempts >= MAX_ATTEMPTS) {
    const nextQuestion = chooseRandomQuestion(question.id);
    await issueChallenge(headers, request, nextQuestion);

    return jsonResponse(
      {
        ok: false,
        rotated: true,
        question: nextQuestion.question,
        attemptsLeft: MAX_ATTEMPTS,
        message: "Salio otra pregunta para empezar de nuevo.",
      },
      200,
      headers,
    );
  }

  await issueChallenge(headers, request, question, attempts);

  return jsonResponse(
    {
      ok: false,
      attemptsLeft: MAX_ATTEMPTS - attempts,
      message: "Todavia no. Prueba otra vez.",
    },
    200,
    headers,
  );
}

export default async function handler(request, nodeResponse) {
  const response = request.method === "GET"
    ? await handleQuestion(request)
    : request.method === "POST"
      ? await handleAnswer(request)
      : new Response("Method not allowed", { status: 405 });

  return sendResponse(response, nodeResponse);
}
