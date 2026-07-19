import { NextResponse } from "next/server";
import { fetchMenuData } from "@/lib/data/queries";

export async function GET() {
  const menu = await fetchMenuData();
  return NextResponse.json(menu);
}
