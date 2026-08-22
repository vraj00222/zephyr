import { ProcessingClient } from "@/components/processing/processing-client";

export default async function ProcessingPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <ProcessingClient jobId={jobId} />;
}
