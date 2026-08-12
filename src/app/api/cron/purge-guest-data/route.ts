import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { restaurantStartOfToday } from "@/lib/utils";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/**
 * Deletes guest (no Privacy/Terms consent) customer accounts and their orders
 * from before the restaurant's current calendar day (America/Toronto midnight).
 */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ ok: true, demo: true, purgedCustomers: 0, purgedOrders: 0 });
  }

  const supabase = createAdminClient();
  const cutoff = restaurantStartOfToday().toISOString();

  const { data: guests, error: guestError } = await supabase
    .from("customers")
    .select("id")
    .eq("save_history", false);

  if (guestError) {
    return NextResponse.json({ error: guestError.message }, { status: 500 });
  }

  const guestIds = (guests ?? []).map((g) => g.id);
  if (!guestIds.length) {
    return NextResponse.json({ ok: true, purgedCustomers: 0, purgedOrders: 0 });
  }

  const { data: oldOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .in("customer_id", guestIds)
    .lt("created_at", cutoff);

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const orderIds = (oldOrders ?? []).map((o) => o.id);
  if (orderIds.length) {
    await supabase.from("order_items").delete().in("order_id", orderIds);
    await supabase.from("orders").delete().in("id", orderIds);
  }

  // Remove guest customers that no longer have any orders left.
  const { data: remaining } = await supabase
    .from("orders")
    .select("customer_id")
    .in("customer_id", guestIds);

  const stillHaveOrders = new Set((remaining ?? []).map((r) => r.customer_id));
  const removable = guestIds.filter((id) => !stillHaveOrders.has(id));

  if (removable.length) {
    await supabase.from("customers").delete().in("id", removable);
  }

  return NextResponse.json({
    ok: true,
    purgedCustomers: removable.length,
    purgedOrders: orderIds.length,
    cutoff,
  });
}
