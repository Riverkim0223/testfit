import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content", "test-packs");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];
const warnings = [];
const packs = [];

const clamp = (value) => Math.max(0, Math.min(100, value));

function normalize(pack, answers, dimensionId, key) {
  let selected = 0;
  let minimum = 0;
  let maximum = 0;
  pack.questions.forEach((question, index) => {
    const values = question.options.map((option) => option[key]?.[dimensionId] ?? 0);
    selected += values[answers[index]] ?? 0;
    minimum += Math.min(...values);
    maximum += Math.max(...values);
  });
  return maximum === minimum ? 50 : clamp(((selected - minimum) / (maximum - minimum)) * 100);
}

function rank(pack, answers) {
  const axes = Object.fromEntries(pack.axes.map((axis) => [axis.id, normalize(pack, answers, axis.id, "axisScores")]));
  const tags = Object.fromEntries(pack.tags.map((tag) => [tag.id, normalize(pack, answers, tag.id, "tagScores")]));
  return [...pack.profiles].map((profile) => {
    const axisScore = pack.axes.reduce((sum, axis) => sum + (100 - Math.abs((axes[axis.id] ?? 50) - (profile.axisTargets[axis.id] ?? 50))), 0) / pack.axes.length;
    const tagEntries = Object.entries(profile.tagTargets ?? {});
    const tagScore = tagEntries.length ? tagEntries.reduce((sum, [tagId, target]) => sum + (100 - Math.abs((tags[tagId] ?? 50) - target.value)) * (target.weight ?? 1), 0) / tagEntries.reduce((sum, [, target]) => sum + (target.weight ?? 1), 0) : null;
    const aw = tagScore === null ? 1 : pack.scoring.axisWeight;
    const tw = tagScore === null ? 0 : pack.scoring.tagWeight;
    return { profile, score: (axisScore * aw + (tagScore ?? 0) * tw) / (aw + tw) };
  }).sort((a, b) => b.score - a.score);
}

function combinations(pack) {
  return pack.questions.reduce((total, question) => total * question.options.length, 1);
}

function answersFromIndex(pack, sourceIndex) {
  let index = sourceIndex;
  return pack.questions.map((question) => {
    const selected = index % question.options.length;
    index = Math.floor(index / question.options.length);
    return selected;
  });
}

function validate(pack, file) {
  const prefix = path.relative(process.cwd(), file);
  const fail = (message) => errors.push(`${prefix}: ${message}`);
  const warn = (message) => warnings.push(`${prefix}: ${message}`);
  if (!pack || typeof pack !== "object") return fail("JSON 루트는 객체여야 합니다.");
  if (!slugPattern.test(pack.slug ?? "")) fail("slug 형식이 잘못됐습니다.");
  if (!Array.isArray(pack.axes) || pack.axes.length < 1) fail("axes가 비어 있습니다.");
  if (!Array.isArray(pack.questions) || pack.questions.length < 1) fail("questions가 비어 있습니다.");
  if (!Array.isArray(pack.profiles) || pack.profiles.length < 2) fail("profiles는 2개 이상이어야 합니다.");
  const unique = (items, label) => {
    const ids = items.map((item) => item.id);
    if (new Set(ids).size !== ids.length) fail(`${label} ID가 중복됐습니다.`);
  };
  unique(pack.axes ?? [], "axis");
  unique(pack.questions ?? [], "question");
  unique(pack.profiles ?? [], "profile");
  const axisIds = new Set((pack.axes ?? []).map((axis) => axis.id));
  const expectedVariants = new Set((pack.preQuestions ?? []).flatMap((question) => (question.choices ?? []).map((choice) => choice.resultVariant).filter(Boolean)));
  for (const profile of pack.profiles ?? []) {
    for (const axisId of axisIds) {
      const value = profile.axisTargets?.[axisId];
      if (typeof value !== "number" || value < 0 || value > 100) fail(`${profile.id}.${axisId} 기준값이 0~100 범위가 아닙니다.`);
    }
    for (const variant of expectedVariants) {
      const src = profile.illustrationVariants?.[variant]?.src;
      if (!src) {
        if (pack.status === "active") fail(`${profile.id}.${variant} 결과 이미지가 없습니다.`);
        continue;
      }
      if (src.startsWith("/images/")) {
        const imagePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
        if (!fs.existsSync(imagePath)) fail(`${profile.id}.${variant} 이미지 파일을 찾을 수 없습니다: ${src}`);
      }
    }
  }
  const total = combinations(pack);
  const evaluated = total <= 65536 ? total : 10000;
  const counts = new Map(pack.profiles.map((profile) => [profile.id, 0]));
  for (let i = 0; i < evaluated; i++) {
    const answers = total <= 65536 ? answersFromIndex(pack, i) : pack.questions.map((question, qIndex) => ((i * 2654435761 + qIndex * 97) >>> 0) % question.options.length);
    const primary = rank(pack, answers)[0]?.profile;
    if (primary) counts.set(primary.id, (counts.get(primary.id) ?? 0) + 1);
  }
  for (const profile of pack.profiles) {
    const count = counts.get(profile.id) ?? 0;
    const pct = count / evaluated * 100;
    if (!count) fail(`${profile.title} 결과가 나오지 않습니다.`);
    else if (pct < 3) warn(`${profile.title} 결과 비중이 ${pct.toFixed(1)}%로 낮습니다.`);
    else if (pct > 45) warn(`${profile.title} 결과 비중이 ${pct.toFixed(1)}%로 높습니다.`);
  }
}

if (!fs.existsSync(root)) {
  console.error("content/test-packs 폴더가 없습니다.");
  process.exit(1);
}

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const file = path.join(root, entry.name, "pack.json");
  if (!fs.existsSync(file)) continue;
  try {
    const pack = JSON.parse(fs.readFileSync(file, "utf8"));
    packs.push(pack);
    validate(pack, file);
  } catch (error) {
    errors.push(`${path.relative(process.cwd(), file)}: ${error instanceof Error ? error.message : "JSON 파싱 실패"}`);
  }
}

console.log(`Test Pack validation: ${packs.length} packs`);
for (const warning of warnings) console.warn(`WARN  ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length) process.exit(1);
console.log(`OK (${warnings.length} warnings)`);
