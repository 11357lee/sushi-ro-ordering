import { NextResponse } from "next/server";
import {
  deleteDemoCustomerHistoryExceptActive,
  isDemoMode,
} from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Delete past order history for a logged-in customer.
 * Keeps orders still waiting for pickup (pending/accepted with future pickup,
 * or ASAP not yet timed).
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: customerId } = await params;
  if (!customerId?.trim()) {
    return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
  }

  if (isDemoMode()) {
    const deleted = deleteDemoCustomerHistoryExceptActive(customerId);
    return NextResponse.json({ success: true, deleted });
  }

  const supabase = createAdminClient();
  const { data: orders, error: lookupError } = await supabase
    .from("orders")
    .select("id, status, pickup_time")
    .eq("customer_id", customerId);

  if (lookupError) {
    return NextResponse.json({ error: "Could not delete history." }, { status: 500 });
  }

  const now = Date.now();
  const toDelete = (orders ?? [])
    .filter((order) => {
      const active =
        (order.status === "pending" || order.status === "accepted") &&
        (!order.pickup_time || new Date(order.pickup_time).getTime() > now);
      return !active;
    })
    .map((order) => order.id);

  if (!toDelete.length) {
    return NextResponse.json({ success: true, deleted: 0 });
  }

  // order_items cascade via FK ON DELETE CASCADE
  const { error } = await supabase.from("orders").delete().in("id", toDelete).eq("customer_id", customerId);
  if (error) {
    return NextResponse.json({ error: "Could not delete history." }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: toDelete.length });
}
