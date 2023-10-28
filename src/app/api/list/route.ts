import { NextRequest, NextResponse } from "next/server";
import data from "./data";

export const dynamic = "force-static";
export async function GET(req: NextRequest) {
  try {
    const page = +(req.url.split("?page=")[1] ?? 1);
    console.log(req.url, page, "这是req");
    const pageTotal = 20;
    const pageStart = (page - 1) * pageTotal;
    const pageEnd = page * pageTotal;
    return NextResponse.json({
      list: data.slice(pageStart, pageEnd),
    });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

export const config = {
  type: "experimental-scheduled",
};

