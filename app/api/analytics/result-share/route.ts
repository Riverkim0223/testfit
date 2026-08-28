interface ResultShareEvent {
  event: "result_share_action";
  occurredAt: string;
  resultId: string;
  profileId: string;
  action:
    | "native_share"
    | "image_share"
    | "image_save"
    | "story_image_save"
    | "link_copy";
}

function isResultShareEvent(value: unknown): value is ResultShareEvent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.event === "result_share_action" &&
    typeof record.occurredAt === "string" &&
    typeof record.resultId === "string" &&
    typeof record.profileId === "string" &&
    typeof record.action === "string"
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) {
    return Response.json({ message: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!isResultShareEvent(body)) {
    return Response.json({ message: "Invalid event" }, { status: 400 });
  }

  // TODO: Send to the project's analytics provider or persist an aggregate
  // event. Avoid storing raw answers or other sensitive result data here.
  return new Response(null, { status: 204 });
}
