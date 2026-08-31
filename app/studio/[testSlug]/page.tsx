import { notFound } from "next/navigation";
import { StudioEditor } from "@/components/test-studio/StudioEditor";
import { getStoredTestPack } from "@/lib/test-factory/content-store.server";
import { isTestStudioEnabled } from "@/lib/test-factory/studio";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ testSlug: string }>;
}

export default async function StudioEditorPage({ params }: Props) {
  if (!isTestStudioEnabled()) notFound();
  const { testSlug } = await params;
  const record = getStoredTestPack(testSlug);
  if (!record) notFound();
  return (
    <StudioEditor
      initialPack={record.pack}
      initialIssues={record.issues}
      initialDistribution={record.distribution}
    />
  );
}
