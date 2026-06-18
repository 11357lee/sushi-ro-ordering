import { NextResponse } from "next/server";
import { isDemoMode, listDemoOrdersByPhone } from "@/lib/data/demo-store";
import { fetchOrdersByPhone } from "@/lib/data/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone?.trim()) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const orders = isDemoMode()
    ? listDemoOrdersByPhone(phone)
    : await fetchOrdersByPhone(phone);

  return NextResponse.json({ orders });
}
