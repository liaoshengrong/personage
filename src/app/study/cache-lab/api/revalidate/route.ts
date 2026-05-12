import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const body = (await request.json()) as { tag?: string };
  const tag = body?.tag;
  if (!tag) {
    return Response.json({ ok: false, message: "tag is required" }, { status: 400 });
  }

  revalidateTag(tag);
  return Response.json({ ok: true, tag, revalidatedAt: new Date().toISOString() });
}
