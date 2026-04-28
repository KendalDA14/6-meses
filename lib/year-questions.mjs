import { existsSync, readFileSync } from "node:fs";

const FALLBACK_QUESTIONS = [
  {
    id: "demo-amor",
    question: "Pregunta de prueba: escribe la palabra amor.",
    answers: ["amor"],
  },
];

let localEnvCache = null;

function parseEnvValue(rawValue) {
  const value = rawValue.trim();
  const quote = value[0];

  if ((quote === "'" || quote === "\"") && value[value.length - 1] === quote) {
    return value.slice(1, -1);
  }

  return value;
}

function readLocalEnv() {
  if (localEnvCache) {
    return localEnvCache;
  }

  localEnvCache = {};

  if (!existsSync(".env.local")) {
    return localEnvCache;
  }

  const file = readFileSync(".env.local", "utf8");
  file.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      return;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = parseEnvValue(trimmed.slice(index + 1));

    if (key) {
      localEnvCache[key] = value;
    }
  });

  return localEnvCache;
}

function getEnv(name) {
  return globalThis.process?.env?.[name] || readLocalEnv()[name] || "";
}

function mustUseConfiguredQuestions() {
  const vercelEnv = getEnv("VERCEL_ENV");
  return Boolean(vercelEnv && vercelEnv !== "development");
}

function normalizeQuestion(rawQuestion, index) {
  if (!rawQuestion || typeof rawQuestion !== "object") {
    return null;
  }

  const id = String(rawQuestion.id || `question-${index + 1}`).trim();
  const question = String(rawQuestion.question || "").trim();
  const answers = Array.isArray(rawQuestion.answers)
    ? rawQuestion.answers.map((answer) => String(answer).trim()).filter(Boolean)
    : [];

  if (!id || !question || answers.length === 0) {
    return null;
  }

  return { id, question, answers };
}

export function getYearQuestions() {
  const raw = getEnv("YEAR_QUESTIONS_JSON");

  if (!raw) {
    if (mustUseConfiguredQuestions()) {
      throw new Error("YEAR_QUESTIONS_JSON is required on Vercel.");
    }

    return FALLBACK_QUESTIONS;
  }

  try {
    const parsed = JSON.parse(raw);
    const questions = Array.isArray(parsed)
      ? parsed.map(normalizeQuestion).filter(Boolean)
      : [];

    if (questions.length > 0) {
      return questions;
    }

    if (mustUseConfiguredQuestions()) {
      throw new Error("YEAR_QUESTIONS_JSON must include at least one valid question.");
    }

    return FALLBACK_QUESTIONS;
  } catch {
    if (mustUseConfiguredQuestions()) {
      throw new Error("YEAR_QUESTIONS_JSON is not valid JSON.");
    }

    return FALLBACK_QUESTIONS;
  }
}

export function chooseRandomQuestion(previousId = "") {
  const questions = getYearQuestions();
  const available = questions.length > 1
    ? questions.filter((question) => question.id !== previousId)
    : questions;

  return available[Math.floor(Math.random() * available.length)];
}

export function findQuestionById(id) {
  return getYearQuestions().find((question) => question.id === id) || null;
}

export function normalizeAnswer(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isCorrectAnswer(question, answer) {
  const normalizedAnswer = normalizeAnswer(answer);
  return question.answers.some((expected) => normalizeAnswer(expected) === normalizedAnswer);
}
