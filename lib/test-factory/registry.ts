import { getStoredTestPack, listStoredTestPacks } from "./content-store.server";
import type { TestPack } from "./types";

const hasErrors = (issues: Array<{ severity: string }>) =>
  issues.some((issue) => issue.severity === "error");

export function getTestPack(testSlug: string): TestPack | null {
  const record = getStoredTestPack(testSlug);
  if (!record || hasErrors(record.issues)) return null;
  return record.pack;
}

export function listTestPacks(): TestPack[] {
  return listStoredTestPacks()
    .filter((record) => !hasErrors(record.issues))
    .map((record) => record.pack);
}

export function listActiveTestPacks(): TestPack[] {
  return listTestPacks().filter((pack) => pack.status === "active");
}
