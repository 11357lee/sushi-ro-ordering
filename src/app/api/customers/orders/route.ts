import { NextResponse } from "next/server";
import { fetchCustomerOrders } from "@/lib/data/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  if (!customerId?.trim()) {
    return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
  }

  const orders = await fetchCustomerOrders(customerId);
  return NextResponse.json({ orders });
}
