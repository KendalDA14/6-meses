import { existsSync, readFileSync } from "node:fs";

const FALLBACK_QUESTIONS = [
  {
    id: "gusto_mi",
    question: "¿Qué es lo que más te gustó de mí?",
    answers: ["Mis muslos", "muslos"],
  },
  {
    id: "primer_apodo",
    question: "¿Cuál fue el primer apodo que te puse?",
    answers: ["Tomatito"],
  },
  {
    id: "color_verme",
    question: "¿Qué color te gusta más verme usar?",
    answers: ["El blanco", "blanco"],
  },
  {
    id: "encanta_ti",
    question: "¿Qué es lo que más te encanta de ti?",
    answers: ["Mi culo", "Mis ojos", "culo", "ojos"],
  },
  {
    id: "dia_celebrar",
    question: "Para mí, ¿qué día me gusta celebrar?",
    answers: ["Los 15", "15"],
  },
  {
    id: "que_me_gustaras",
    question: "¿Qué hizo que me gustaras?",
    answers: ["Mi personalidad", "personalidad"],
  },
  {
    id: "primera_cita",
    question: "¿Qué comimos en nuestra primera cita?",
    answers: ["Pizza"],
  },
  {
    id: "primera_salida",
    question: "¿Dónde fue la primera salida?",
    answers: ["Al cine", "Cine"],
  },
  {
    id: "suma",
    question: "¿Cuánto es 1 + 1?",
    answers: ["5"],
  },
  {
    id: "declarare",
    question: "¿En qué mes y día me declararé? (ejemplo: 1 de enero)",
    answers: ["25 de agosto", "25 agosto"],
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
