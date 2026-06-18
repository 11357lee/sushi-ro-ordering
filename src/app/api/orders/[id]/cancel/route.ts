import { NextResponse } from "next/server";
import { getDemoOrder, isDemoMode, updateDemoOrder } from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isDemoMode()) {
    const order = getDemoOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "accepted" && order.status !== "pending") {
      return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
    }
    const updated = updateDemoOrder(id, { status: "cancelled" });
    return NextResponse.json({ order: updated });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const now = new Date();
  const cancelExpires = order.cancel_window_expires_at
    ? new Date(order.cancel_window_expires_at)
    : null;

  if (cancelExpires && now > cancelExpires) {
    return NextResponse.json({ error: "Cancel window has expired" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }

  return NextResponse.json({ order: updated });
}
