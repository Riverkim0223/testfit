import fs, { type Dirent } from "node:fs";
import path from "node:path";
import type { TestPack } from "./types";
import {
  analyzeTestPackDistribution,
  distributionWarnings,
  hasValidationErrors,
  validateTestPack,
  type TestPackDistribution,
  type TestPackValidationIssue,
} from "./validation";

const CONTENT_ROOT = path.join(process.cwd(), "content", "test-packs");
const PUBLIC_IMAGE_ROOT = path.join(process.cwd(), "public", "images");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;


function imageFileIssues(pack: TestPack): TestPackValidationIssue[] {
  const issues: TestPackValidationIssue[] = [];
  const check = (src: string | undefined, pathLabel: string) => {
    if (!src || !src.startsWith("/images/")) return;
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      issues.push({
        severity: pack.status === "active" ? "error" : "warning",
        path: pathLabel,
        message: `이미지 파일을 찾을 수 없습니다: ${src}`,
      });
    }
  };
  pack.profiles.forEach((profile, profileIndex) => {
    check(profile.illustration?.src, `profiles[${profileIndex}].illustration.src`);
    Object.entries(profile.illustrationVariants ?? {}).forEach(([variant, illustration]) => {
      check(illustration.src, `profiles[${profileIndex}].illustrationVariants.${variant}.src`);
    });
  });
  return issues;
}

export interface StoredTestPack {
  pack: TestPack;
  filePath: string;
  issues: TestPackValidationIssue[];
  distribution: TestPackDistribution;
}

function assertSlug(slug: string) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("Slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }
}

function packDirectory(slug: string) {
  assertSlug(slug);
  return path.join(CONTENT_ROOT, slug);
}

function packFilePath(slug: string) {
  return path.join(packDirectory(slug), "pack.json");
}

function ensureContentRoot() {
  fs.mkdirSync(CONTENT_ROOT, { recursive: true });
}

function readJsonFile(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
}

function validateAndCast(raw: unknown, sourcePath: string): StoredTestPack {
  const baseIssues = validateTestPack(raw);
  if (hasValidationErrors(baseIssues)) {
    const message = baseIssues
      .filter((issue) => issue.severity === "error")
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(`유효하지 않은 테스트팩입니다 (${sourcePath}).\n${message}`);
  }

  const pack = raw as TestPack;
  const distribution = analyzeTestPackDistribution(pack);
  const issues = [...baseIssues, ...imageFileIssues(pack), ...distributionWarnings(distribution)];
  return { pack, filePath: sourcePath, issues, distribution };
}

export function listStoredTestPacks(): StoredTestPack[] {
  ensureContentRoot();
  // Use the real Node.js Dirent type; temporary ambient declarations must not
  // override node:fs in the application TypeScript project.
  const entries: Dirent[] = fs.readdirSync(CONTENT_ROOT, {
    withFileTypes: true,
    encoding: "utf8",
  });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap((entry): StoredTestPack[] => {
      const filePath = packFilePath(entry.name);
      if (!fs.existsSync(filePath)) return [];
      try {
        return [validateAndCast(readJsonFile(filePath), filePath)];
      } catch (error) {
        console.error(error);
        return [];
      }
    })
    .sort((a, b) => a.pack.title.localeCompare(b.pack.title, "ko"));
}

export function getStoredTestPack(slug: string): StoredTestPack | null {
  const filePath = packFilePath(slug);
  if (!fs.existsSync(filePath)) return null;
  return validateAndCast(readJsonFile(filePath), filePath);
}

export function writeStoredTestPack(pack: TestPack): StoredTestPack {
  assertSlug(pack.slug);
  const issues = [...validateTestPack(pack), ...imageFileIssues(pack)];
  if (hasValidationErrors(issues)) {
    const error = new Error("테스트팩 검증에 실패했습니다.") as Error & {
      issues?: TestPackValidationIssue[];
    };
    error.issues = issues;
    throw error;
  }

  const directory = packDirectory(pack.slug);
  const filePath = packFilePath(pack.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
  return validateAndCast(pack, filePath);
}

function replaceImagePaths<T>(value: T, sourceSlug: string, targetSlug: string): T {
  const serialized = JSON.stringify(value);
  return JSON.parse(
    serialized.replaceAll(`/images/${sourceSlug}/`, `/images/${targetSlug}/`),
  ) as T;
}

function copyImageDirectory(sourceSlug: string, targetSlug: string) {
  const source = path.join(PUBLIC_IMAGE_ROOT, sourceSlug);
  const target = path.join(PUBLIC_IMAGE_ROOT, targetSlug);
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: false, errorOnExist: false });
}

export function cloneStoredTestPack(
  sourceSlug: string,
  targetSlug: string,
  title?: string,
): StoredTestPack {
  assertSlug(targetSlug);
  if (fs.existsSync(packFilePath(targetSlug))) {
    throw new Error(`이미 존재하는 Slug입니다: ${targetSlug}`);
  }
  const source = getStoredTestPack(sourceSlug);
  if (!source) throw new Error(`복제할 테스트를 찾을 수 없습니다: ${sourceSlug}`);

  const cloned = replaceImagePaths(
    structuredClone(source.pack),
    sourceSlug,
    targetSlug,
  );
  cloned.id = targetSlug;
  cloned.slug = targetSlug;
  cloned.version = 1;
  cloned.status = "draft";
  cloned.title = title?.trim() || `${source.pack.title} 복사본`;
  cloned.shortTitle = cloned.title;
  cloned.landing.eyebrow = `DRAFT · ${cloned.questions.length} QUESTIONS · ${cloned.profiles.length} TYPES`;

  copyImageDirectory(sourceSlug, targetSlug);
  return writeStoredTestPack(cloned);
}

export function createBlankTestPack(slug: string, title: string): StoredTestPack {
  assertSlug(slug);
  if (fs.existsSync(packFilePath(slug))) {
    throw new Error(`이미 존재하는 Slug입니다: ${slug}`);
  }
  const templatePath = path.join(CONTENT_ROOT, "_template", "pack.json");
  if (!fs.existsSync(templatePath)) {
    throw new Error("빈 테스트 템플릿 파일이 없습니다.");
  }
  const template = readJsonFile(templatePath) as TestPack;
  const pack = structuredClone(template);
  pack.id = slug;
  pack.slug = slug;
  pack.title = title.trim();
  pack.shortTitle = title.trim();
  return writeStoredTestPack(pack);
}

export function deleteStoredTestPack(slug: string) {
  const directory = packDirectory(slug);
  if (fs.existsSync(directory)) fs.rmSync(directory, { recursive: true, force: true });
}

export function writeProfileImage(options: {
  testSlug: string;
  profileId: string;
  variant: string;
  bytes: Uint8Array;
}): string {
  const { testSlug, profileId, variant, bytes } = options;
  assertSlug(testSlug);
  if (!SLUG_PATTERN.test(profileId) || !SLUG_PATTERN.test(variant)) {
    throw new Error("프로필 ID와 이미지 버전은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }
  const relativeDirectory = path.join(testSlug, "profiles");
  const directory = path.join(PUBLIC_IMAGE_ROOT, relativeDirectory);
  fs.mkdirSync(directory, { recursive: true });
  const filename = `${profileId}-${variant}.webp`;
  fs.writeFileSync(path.join(directory, filename), bytes);
  return `/images/${relativeDirectory.replaceAll(path.sep, "/")}/${filename}`;
}
