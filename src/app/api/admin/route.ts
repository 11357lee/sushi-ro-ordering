import { NextResponse } from "next/server";
import { addMinutes, setHours, setMinutes, setSeconds } from "date-fns";
import {
  dismissAllDemoOrders,
  getDemoWaitingTimeMinutes,
  isDemoMode,
  listDemoAdminOrders,
  setDemoPauseUntil,
  setDemoSoldOutIds,
  setDemoWaitingTimeMinutes,
  updateDemoOrderStatus,
} from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAdminOrders } from "@/lib/data/queries";
import type { OrderStatus } from "@/types";

function verifyAdmin(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return key?.trim() === process.env.ADMIN_API_KEY?.trim() && Boolean(process.env.ADMIN_API_KEY);
}

function closingTimeToday(closingTime = "21:00:00"): Date {
  const now = new Date();
  const [h, m] = closingTime.split(":").map(Number);
  return setSeconds(setMinutes(setHours(now, h), m), 0);
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = isDemoMode() ? listDemoAdminOrders() : await fetchAdminOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    action,
    orderId,
    status,
    pickupTime,
    statusReason,
    waitingMinutes,
    pauseDuration,
    soldOutItemIds,
    specialClosedDates,
    closingTime,
  } = body;

  if (action === "update_waiting_time" && waitingMinutes) {
    if (isDemoMode()) {
      setDemoWaitingTimeMinutes(Number(waitingMinutes));
      return NextResponse.json({ waitingMinutes: Number(waitingMinutes) });
    }
    const supabase = createAdminClient();
    await supabase.from("waiting_time").insert({ minutes: Number(waitingMinutes) });
    return NextResponse.json({ waitingMinutes: Number(waitingMinutes) });
  }

  if (action === "pause_service" && pauseDuration) {
    let pauseUntil: string | null = null;
    const now = new Date();

    if (pauseDuration === "rest_of_day") {
      pauseUntil = closingTimeToday(closingTime ?? "21:00:00").toISOString();
    } else if (pauseDuration === "30") {
      pauseUntil = addMinutes(now, 30).toISOString();
    } else if (pauseDuration === "60") {
      pauseUntil = addMinutes(now, 60).toISOString();
    } else if (pauseDuration === "120") {
      pauseUntil = addMinutes(now, 120).toISOString();
    } else if (pauseDuration === "clear") {
      pauseUntil = null;
    }

    if (isDemoMode()) {
      setDemoPauseUntil(pauseUntil);
      return NextResponse.json({ pauseUntil });
    }

    const supabase = createAdminClient();
    await supabase
      .from("restaurant_settings")
      .update({ pause_until: pauseUntil })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    return NextResponse.json({ pauseUntil });
  }

  if (action === "update_sold_out" && Array.isArray(soldOutItemIds)) {
    if (isDemoMode()) {
      setDemoSoldOutIds(soldOutItemIds);
      return NextResponse.json({ soldOutItemIds });
    }
    const supabase = createAdminClient();
    await supabase
      .from("restaurant_settings")
      .update({ sold_out_item_ids: soldOutItemIds })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ soldOutItemIds });
  }

  if (action === "update_special_closed_dates" && Array.isArray(specialClosedDates)) {
    if (isDemoMode()) {
      return NextResponse.json({ specialClosedDates });
    }
    const supabase = createAdminClient();
    await supabase
      .from("restaurant_settings")
      .update({ special_closed_dates: specialClosedDates })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ specialClosedDates });
  }

  if (action === "dismiss_orders") {
    if (isDemoMode()) {
      dismissAllDemoOrders();
      return NextResponse.json({ success: true });
    }
    const supabase = createAdminClient();
    await supabase
      .from("orders")
      .update({ admin_dismissed: true })
      .eq("admin_dismissed", false);
    return NextResponse.json({ success: true });
  }

  if (action === "update_order" && orderId && status) {
    const orderStatus = status as OrderStatus;

    if (isDemoMode()) {
      const waitMinutes = getDemoWaitingTimeMinutes();
      let finalPickupTime = pickupTime;

      if (orderStatus === "accepted" && !finalPickupTime) {
        finalPickupTime = addMinutes(new Date(), waitMinutes).toISOString();
      }

      const updated = updateDemoOrderStatus(orderId, orderStatus, finalPickupTime, statusReason);
      return NextResponse.json({ order: updated });
    }

    const supabase = createAdminClient();
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("pickup_type")
      .eq("id", orderId)
      .single();
    const confirmedAt = new Date();
    const updates: Record<string, unknown> = {
      status: orderStatus,
      status_reason: statusReason || null,
    };

    if (orderStatus === "accepted") {
      updates.confirmed_at = confirmedAt.toISOString();
      let finalPickupTime = pickupTime;

      if (!finalPickupTime) {
        const { data: waitingRow } = await supabase
          .from("waiting_time")
          .select("minutes")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        const waitMinutes = waitingRow?.minutes ?? 15;
        finalPickupTime = addMinutes(confirmedAt, waitMinutes).toISOString();
      }

      updates.pickup_time = finalPickupTime;

      const prepMinutes = Math.round(
        (new Date(finalPickupTime).getTime() - confirmedAt.getTime()) / 60000
      );
      if (existingOrder?.pickup_type === "asap" && prepMinutes >= 60) {
        updates.cancel_window_expires_at = addMinutes(confirmedAt, 2).toISOString();
      } else {
        updates.cancel_window_expires_at = null;
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

    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
