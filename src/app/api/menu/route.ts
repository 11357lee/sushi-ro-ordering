import { NextResponse } from "next/server";
import { fetchMenuData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const menu = await fetchMenuData();
  return NextResponse.json(menu, {
    headers: { "Cache-Control": "no-store" },
  });
}
