export function isTestStudioEnabled(): boolean {
  // Vercel Functions use a read-only deployment filesystem, so Studio is always local-only.
  if (process.env.VERCEL === "1") return false;
  if (process.env.TEST_STUDIO_ENABLED === "true") return true;
  return process.env.NODE_ENV !== "production";
}
