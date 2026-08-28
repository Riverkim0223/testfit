import { fruitFacePack } from "@/test-packs/fruit-face";
import { reelsFitPack } from "@/test-packs/reels-fit";
import type { TestPack } from "./types";

export const testPacks = [reelsFitPack, fruitFacePack] as const;

const registry = new Map<string, TestPack>(
  testPacks.map((pack) => [pack.slug, pack]),
);

export function getTestPack(testSlug: string): TestPack | null {
  return registry.get(testSlug) ?? null;
}

export function listActiveTestPacks(): TestPack[] {
  return testPacks.filter((pack) => pack.status === "active");
}
