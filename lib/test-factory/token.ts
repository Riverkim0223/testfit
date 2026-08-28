import type { ResultTokenPayload, TestPack } from "./types";

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "=",
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function encodeResultToken(payload: ResultTokenPayload): string {
  const compact = {
    v: payload.version,
    a: payload.answers,
    p: payload.preAnswers,
  };
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(compact)));
}

export function decodeResultToken(
  pack: TestPack,
  token: string,
): ResultTokenPayload | null {
  try {
    if (!token || token.length > 1_000) return null;
    const json = new TextDecoder().decode(base64UrlToBytes(token));
    const parsed = JSON.parse(json) as { v?: unknown; a?: unknown; p?: unknown };

    if (parsed.v !== pack.version) return null;
    if (!Array.isArray(parsed.a) || !Array.isArray(parsed.p)) return null;
    if (parsed.a.length !== pack.questions.length) return null;
    if (parsed.p.length !== pack.preQuestions.length) return null;

    const answers = parsed.a.map(Number);
    const preAnswers = parsed.p.map(Number);

    const answersValid = answers.every(
      (answer, index) =>
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < pack.questions[index]!.options.length,
    );
    const preAnswersValid = preAnswers.every(
      (answer, index) =>
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < pack.preQuestions[index]!.choices.length,
    );

    if (!answersValid || !preAnswersValid) return null;

    return { version: pack.version, answers, preAnswers };
  } catch {
    return null;
  }
}
