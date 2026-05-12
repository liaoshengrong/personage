import { readCacheLabData } from "../../dataSource";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get("label") ?? "default";
  return Response.json(readCacheLabData(label));
}
