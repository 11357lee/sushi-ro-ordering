import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/demo-store";
import { fetchMenuData } from "@/lib/data/queries";

export async function GET() {
  const menu = await fetchMenuData();
  return NextResponse.json(menu);
}
