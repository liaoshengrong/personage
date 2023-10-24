import { NextRequest, NextResponse } from "next/server";
import data from '@/data_json/data.json'
export async function GET(req: NextRequest) {
  console.log(req, '这是req');

  return NextResponse.json({
    list: data
  })
}