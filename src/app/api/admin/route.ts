import { NextResponse } from "next/server";
import {
  getDemoWaitingTimeMinutes,
  isDemoMode,
  listDemoPendingOrders,
  setDemoIsOpen,
  setDemoWaitingTimeMinutes,
  updateDemoOrderStatus,
} from "@/lib/data/demo-store";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchOrderById, fetchPendingOrders } from "@/lib/data/queries";
import type { OrderStatus } from "@/types";
import { addMinutes } from "date-fns";

function verifyAdmin(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_API_KEY && Boolean(process.env.ADMIN_API_KEY);
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = isDemoMode() ? listDemoPendingOrders() : await fetchPendingOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, orderId, status, pickupTime, waitingMinutes, isOpen } = body;

  if (action === "update_waiting_time" && waitingMinutes) {
    if (isDemoMode()) {
      setDemoWaitingTimeMinutes(waitingMinutes);
      return NextResponse.json({ waitingMinutes });
    }
    const supabase = createAdminClient();
    await supabase.from("waiting_time").insert({ minutes: waitingMinutes });
    return NextResponse.json({ waitingMinutes });
  }

  if (action === "update_open_status" && typeof isOpen === "boolean") {
    if (isDemoMode()) {
      setDemoIsOpen(isOpen);
      return NextResponse.json({ isOpen });
    }
    const supabase = createAdminClient();
    await supabase.from("restaurant_settings").update({ is_open: isOpen }).neq("id", "00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ isOpen });
  }

  if (action === "update_order" && orderId && status) {
    const orderStatus = status as OrderStatus;

    if (isDemoMode()) {
      const waitingMinutes = getDemoWaitingTimeMinutes();
      let finalPickupTime = pickupTime;

      if (orderStatus === "accepted" && !finalPickupTime) {
        finalPickupTime = addMinutes(new Date(), waitingMinutes).toISOString();
      }

      const updated = updateDemoOrderStatus(orderId, orderStatus, finalPickupTime);

      if (updated && orderStatus === "accepted") {
        await sendOrderConfirmationEmail(updated);
      }

      return NextResponse.json({ order: updated });
    }

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = { status: orderStatus };

    if (orderStatus === "accepted") {
      updates.confirmed_at = new Date().toISOString();

      const { data: waitingRow } = await supabase
        .from("waiting_time")
        .select("minutes")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      const waitMinutes = waitingRow?.minutes ?? 15;
      const computedPickup = pickupTime ?? addMinutes(new Date(), waitMinutes).toISOString();
      updates.pickup_time = computedPickup;

      if (waitMinutes > 60) {
        updates.cancel_window_expires_at = addMinutes(new Date(), 1).toISOString();
      }
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select("*, order_items(*), customer:customers(*)")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    if (orderStatus === "accepted" && updated) {
      await sendOrderConfirmationEmail(updated);
    }

    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
