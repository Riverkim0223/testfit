/**
 * Studio v2 npm recovery. No third-party dependencies.
 * Default: show the plan only. Pass --apply to remove install/build caches.
 * Does not touch source code, test JSON, images, .env files, or the npm cache.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function exists(file) {
  try { fs.lstatSync(file); return true; }
  catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

function main() {
  const flags = new Set(process.argv.slice(2));
  for (const flag of flags) {
    if (!["--apply", "--reset-lock"].includes(flag)) {
      throw new Error(`Unknown option: ${flag}. Use --apply and/or --reset-lock.`);
    }
  }

  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  if (fs.realpathSync(process.cwd()) !== fs.realpathSync(root)) {
    throw new Error("Run this command from the project root (the folder containing package.json).");
  }
  const manifestPath = path.join(root, "package.json");
  if (!exists(manifestPath)) throw new Error("package.json is missing; no files were changed.");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.name !== "test-factory-studio" ||
      !exists(path.join(root, "lib", "test-factory", "content-store.server.ts")) ||
      !exists(path.join(root, "content", "test-packs"))) {
    throw new Error("This is not the expected Test Factory Studio project; no files were changed.");
  }
  if (manifest.packageManager && !manifest.packageManager.startsWith("npm@")) {
    throw new Error("package.json selects a different package manager. Choose npm there before running this recovery.");
  }
  if (exists(path.join(root, "npm-shrinkwrap.json"))) {
    throw new Error("npm-shrinkwrap.json exists. Review that lockfile before using this recovery.");
  }

  const caches = ["node_modules", ".next", "tsconfig.tsbuildinfo", "tsconfig.verify.tsbuildinfo"]
    .filter((name) => exists(path.join(root, name)));
  const lockBackups = [];
  if (exists(path.join(root, "pnpm-lock.yaml"))) lockBackups.push("pnpm-lock.yaml");

  let keepNpmLock = false;
  const npmLock = path.join(root, "package-lock.json");
  if (exists(npmLock)) {
    const text = fs.readFileSync(npmLock, "utf8");
    let invalidJson = false;
    try { JSON.parse(text); } catch { invalidJson = true; }
    const pnpmPaths = /node_modules[\\/]+\.pnpm(?:[\\/]|\")/.test(text);
    if (invalidJson || pnpmPaths || flags.has("--reset-lock")) lockBackups.push("package-lock.json");
    else keepNpmLock = true;
  }

  console.log(`Project: ${root}`);
  console.log("Remove install/build caches:", caches.join(", ") || "none");
  console.log("Back up and move old lockfiles:", lockBackups.join(", ") || "none");
  if (keepNpmLock) console.log("Keep the existing npm package-lock.json (no pnpm store paths found).");
  console.log("Preserved: app, components, lib, content, public, package.json, .env files.");
  if (!flags.has("--apply")) {
    console.log("Dry run only. Stop the dev server, then rerun with --apply to execute this plan.");
    return;
  }

  // Only these fixed, disposable paths under the verified project root are removed.
  for (const name of caches) {
    fs.rmSync(path.join(root, name), {
      recursive: true, force: true, maxRetries: 4, retryDelay: 300,
    });
    console.log(`Removed: ${name}`);
  }

  if (lockBackups.length) {
    const backupRoot = path.join(root, ".reelsfit-repair-backups");
    fs.mkdirSync(backupRoot, { recursive: true });
    fs.writeFileSync(path.join(backupRoot, ".gitignore"), "*\n", "utf8");
    const backup = fs.mkdtempSync(path.join(backupRoot, "npm-"));
    for (const name of lockBackups) {
      fs.renameSync(path.join(root, name), path.join(backup, `${name}.bak`));
    }
    console.log(`Lockfile backups: ${backup}`);
  }
  console.log("Preparation complete. This script has NOT installed packages or run the build.");
  console.log("Next: npm install");
  console.log("Then: npm run validate:packs && npm run typecheck && npm run build");
}

try { main(); }
catch (error) {
  console.error(`Recovery stopped: ${error instanceof Error ? error.message : String(error)}`);
  console.error("For EPERM/EBUSY, stop this project's dev server and close terminals using node_modules, then retry.");
  process.exitCode = 1;
}
