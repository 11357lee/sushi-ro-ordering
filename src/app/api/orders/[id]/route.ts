import { NextResponse } from "next/server";
import {
  deleteDemoOrderForCustomer,
  getDemoOrder,
  isDemoMode,
} from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchOrderById } from "@/lib/data/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isDemoMode()) {
    const order = getDemoOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  const order = await fetchOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

/** Logged-in customer deletes one of their own history orders. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { customerId?: string };
  const customerId = body.customerId?.trim();

  if (!customerId) {
    return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
  }

  if (isDemoMode()) {
    const ok = deleteDemoOrderForCustomer(id, customerId);
    if (!ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  }

  const supabase = createAdminClient();
  const { data: existing, error: lookupError } = await supabase
    .from("orders")
    .select("id, customer_id")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "Could not delete order." }, { status: 500 });
  }
  if (!existing || existing.customer_id !== customerId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // order_items cascade via FK ON DELETE CASCADE
  const { error } = await supabase.from("orders").delete().eq("id", id).eq("customer_id", customerId);
  if (error) {
    return NextResponse.json({ error: "Could not delete order." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
