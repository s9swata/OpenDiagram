import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { env } from "@OpenDiagram/env/server";

const GEMINI_MODEL = "gemini-2.5-flash";
const GROQ_ORCHESTRATOR_MODEL = "groq/compound";

export class ProviderCapacityError extends Error {
  constructor(message = "Beta capacity is temporarily full.") {
    super(message);
    this.name = "ProviderCapacityError";
  }
}

export function createPrimaryModel(): ReturnType<ReturnType<typeof createGoogle>> {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required.");
  }
  const google = createGoogle({ apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY });
  return google(GEMINI_MODEL);
}

export function createOrchestratorModel(): ReturnType<ReturnType<typeof createGroq>> {
  const key = pickGroqKey();
  if (!key) throw new Error("GROQ_API_KEY or GROQ_API_KEYS is required for orchestration.");
  const groq = createGroq({ apiKey: key });
  return groq(GROQ_ORCHESTRATOR_MODEL);
}

export function isProviderCapacityError(error: unknown) {
  return error instanceof ProviderCapacityError || isProviderRateLimitError(error);
}

export function providerCapacityResponse() {
  return {
    error:
      "Our diagram painters are chilling for a minute. Beta capacity got cooked. Try again shortly.",
    code: "provider_capacity_exhausted",
  };
}

export function providerCapacityMessage() {
  return providerCapacityResponse().error;
}

function isProviderRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as Record<string, unknown>;
  if (record.statusCode === 429 || record.status === 429) return true;
  const response = record.response as { status?: unknown } | undefined;
  if (response?.status === 429) return true;
  const cause = record.cause;
  if (cause && typeof cause === "object") return isProviderRateLimitError(cause);
  const message = String(record.message ?? "").toLowerCase();
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted") ||
    message.includes("resource exhausted")
  );
}

function pickGroqKey() {
  const keys = [env.GROQ_API_KEYS, env.GROQ_API_KEY]
    .flatMap((value) => value?.split(",") ?? [])
    .map((value) => value.trim())
    .filter(Boolean);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}
