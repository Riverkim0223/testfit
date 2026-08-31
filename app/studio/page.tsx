import { notFound } from "next/navigation";
import { StudioDashboard } from "@/components/test-studio/StudioDashboard";
import { listStoredTestPacks } from "@/lib/test-factory/content-store.server";
import { isTestStudioEnabled } from "@/lib/test-factory/studio";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!isTestStudioEnabled()) notFound();
  const records = listStoredTestPacks().map((record) => ({
    pack: record.pack,
    issues: record.issues,
    distribution: record.distribution,
  }));
  return <StudioDashboard initialRecords={records} />;
}
