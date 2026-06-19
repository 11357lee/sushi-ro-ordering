import { NextResponse } from "next/server";
import {
  getDemoOrder,
  getDemoWaitingTimeMinutes,
  isDemoMode,
  updateDemoOrder,
} from "@/lib/data/demo-store";
import { fetchWaitingTime } from "@/lib/data/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { canCustomerCancelOrder } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const waitingMinutes = isDemoMode()
    ? getDemoWaitingTimeMinutes()
    : (await fetchWaitingTime()).minutes;

  if (isDemoMode()) {
    const order = getDemoOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!canCustomerCancelOrder(order, waitingMinutes)) {
      return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
    }
    const updated = updateDemoOrder(id, { status: "cancelled" });
    return NextResponse.json({ order: updated });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, customer:customers(*)")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!canCustomerCancelOrder(order as Parameters<typeof canCustomerCancelOrder>[0], waitingMinutes)) {
    return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
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
