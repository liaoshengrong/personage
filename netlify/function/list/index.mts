import { NextRequest, NextResponse } from "next/server";
import type { Context } from "@netlify/functions"
import data from "./data";

export const dynamic = "force-static";
export async function GET(req: Request, context: Context) {
  try {
    const page = +(req.url.split("?page=")[1] ?? 1);
    console.log(req.url, page, req, "这是req");
    const pageTotal = 20;
    const pageStart = (page - 1) * pageTotal;
    const pageEnd = page * pageTotal;
    const datalist = JSON.stringify({ list: data.slice(pageStart, pageEnd) })
    // return NextResponse.json({
    //   list: data.slice(pageStart, pageEnd),
    // });
    return new Response(datalist)
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

export const config = {
  type: "experimental-scheduled",
};

