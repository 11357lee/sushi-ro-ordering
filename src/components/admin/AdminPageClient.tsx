"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addMinutes } from "date-fns";
import type { MenuData, MenuItem, Order } from "@/types";
import { WAITING_TIME_LABELS } from "@/types";
import {
  formatPhoneDisplay,
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  isPauseActive,
  isRestaurantOpen,
  toDisplayName,
} from "@/lib/utils";

type AdminTab = "orders" | "settings";

function customerTitle(order: Order): string {
  const first = order.customer?.first_name ? toDisplayName(order.customer.first_name) : "Guest";
  const last = order.customer?.last_name ? toDisplayName(order.customer.last_name) : "";
  return `${first}${last ? ` ${last}` : ""}`.trim();
}

function defaultPickupTime(order: Order, waitingMinutes: number): string {
  if (order.pickup_type === "scheduled" && order.pickup_time) {
    return order.pickup_time;
  }
  return addMinutes(new Date(), waitingMinutes).toISOString();
}

function formatCountdown(pickupTime: string | null, now: Date): string | null {
  if (!pickupTime) return null;
  const diffMs = new Date(pickupTime).getTime() - now.getTime();
  if (diffMs <= 0) return "Pickup time passed";
  const totalMinutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
}

function pickupInputFromIso(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
}

function pickupIsoFromInput(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 3 || digits.length > 4) return null;
  const hourDigits = digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2);
  const minuteDigits = digits.length === 3 ? digits.slice(1) : digits.slice(2);
  let hour = Number(hourDigits);
  const minute = Number(minuteDigits);
  if (Number.isNaN(hour) || Number.isNaN(minute) || minute > 59) return null;
  if (hour >= 1 && hour <= 9) hour += 12;
  if (hour > 23) return null;

  const pickup = new Date();
  pickup.setHours(hour, minute, 0, 0);
  if (pickup < new Date()) {
    pickup.setDate(pickup.getDate() + 1);
  }
  return pickup.toISOString();
}

function OrderExtras({ order }: { order: Order }) {
  const extras: string[] = [];
  if (order.cutlery) extras.push(`Cutlery x${order.cutlery_quantity}`);
  if (order.extra_wasabi) extras.push("Extra wasabi");
  if (order.extra_ginger) extras.push("Extra ginger");
  if (order.extra_soy_sauce) extras.push("Extra soy sauce");
  if (order.no_wasabi) extras.push("No wasabi");
  if (order.no_ginger) extras.push("No ginger");
  if (order.no_soy_sauce) extras.push("No soy sauce");
  if (order.special_instructions) extras.push(`Instructions: ${order.special_instructions}`);
  if (order.allergy_notes) extras.push(`Allergy: ${order.allergy_notes}`);

  if (!extras.length) return null;

  return (
    <ul className="mt-2 space-y-1 text-sm text-stone-600">
      {extras.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export function AdminPageClient() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [waitingMinutes, setWaitingMinutes] = useState(15);
  const [soldOutIds, setSoldOutIds] = useState<string[]>([]);
  const [pauseUntil, setPauseUntil] = useState<string | null>(null);
  const [closingTime, setClosingTime] = useState("21:00:00");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pickupTimes, setPickupTimes] = useState<Record<string, string>>({});
  const [pickupInputs, setPickupInputs] = useState<Record<string, string>>({});
  const [expandedSoldOutCategory, setExpandedSoldOutCategory] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      "x-admin-key": apiKey,
    }),
    [apiKey]
  );

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin", { headers: { "x-admin-key": apiKey } });
    if (res.ok) {
      const data = await res.json();
      setOrders(
        (data.orders ?? []).sort(
          (a: Order, b: Order) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      setAuthenticated(true);
    }
  }, [apiKey]);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setWaitingMinutes(data.waitingTime?.minutes ?? 15);
    setSoldOutIds(data.settings?.sold_out_item_ids ?? []);
    setPauseUntil(data.settings?.pause_until ?? null);
    setClosingTime(data.settings?.closing_time ?? "21:00:00");
  }, []);

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) {
      setMenu(await res.json());
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    fetchOrders();
    fetchSettings();
    fetchMenu();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [authenticated, fetchOrders, fetchSettings, fetchMenu]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPickupTimes((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        if (!next[order.id]) {
          next[order.id] = defaultPickupTime(order, waitingMinutes);
        }
      });
      return next;
    });
    setPickupInputs((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        if (!next[order.id]) {
          next[order.id] = pickupInputFromIso(defaultPickupTime(order, waitingMinutes));
        }
      });
      return next;
    });
  }, [orders, waitingMinutes]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetchOrders();
    setLoading(false);
  };

  const updateOrder = async (orderId: string, status: string, pickupTime?: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_order", orderId, status, pickupTime }),
    });
    fetchOrders();
  };

  const updateWaitingTime = async (minutes: number) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_waiting_time", waitingMinutes: minutes }),
    });
    setWaitingMinutes(minutes);
  };

  const dismissOrders = async () => {
    if (!confirm("Clear all orders from the screen? They remain in the database.")) return;
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "dismiss_orders" }),
    });
    fetchOrders();
  };

  const pauseService = async (pauseDuration: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "pause_service", pauseDuration, closingTime }),
    });
    fetchSettings();
    setSettingsMessage("Pause updated.");
  };

  const toggleSoldOut = async (itemId: string) => {
    const next = soldOutIds.includes(itemId)
      ? soldOutIds.filter((id) => id !== itemId)
      : [...soldOutIds, itemId];

    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_sold_out", soldOutItemIds: next }),
    });
    setSoldOutIds(next);
  };

  const menuItemsByCategory = useMemo(() => {
    if (!menu) return [];
    return menu.categories.map((category) => {
      const section = menu.sections.find((s) => s.id === category.section_id);
      return {
        category,
        section,
        items: menu.items.filter((item) => item.category_id === category.id),
      };
    });
  }, [menu]);

  const restaurantOpen = isRestaurantOpen({
    pause_until: pauseUntil,
    closing_time: closingTime,
    timezone: "America/Vancouver",
  });
  const paused = isPauseActive(pauseUntil);

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-stone-900">Admin panel</h1>
        <p className="mt-2 text-sm text-stone-600">
          Order management for Sushi-Ro. Uses the same API as a future iOS app.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Admin API key"
            className="w-full rounded-lg border border-stone-200 px-3 py-2.5"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-900 py-3 font-semibold text-white"
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Admin</h1>
          <p className="mt-1 text-sm text-stone-600">
            {paused ? "Service paused" : restaurantOpen ? "Open (business hours)" : "Closed (business hours)"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={dismissOrders}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Clear orders
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-b border-stone-200">
        {(["orders", "settings"] as AdminTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-semibold capitalize ${
              tab === t
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="self-center text-sm text-stone-600">Waiting time:</span>
            {([15, 30, 60, 120] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateWaitingTime(m)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  waitingMinutes === m
                    ? m <= 15
                      ? "bg-emerald-600 text-white"
                      : m === 30
                        ? "bg-amber-400 text-stone-900"
                        : "bg-red-600 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {WAITING_TIME_LABELS[m]}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {orders.length === 0 ? (
              <p className="text-stone-500">No orders on screen.</p>
            ) : (
              orders.map((order) => {
                const expanded = expandedId === order.id;
                const isGF = (item: { section_slug: string }) =>
                  item.section_slug === "gluten-free";

                return (
                  <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="flex w-full items-start justify-between gap-2 text-left"
                    >
                      <div>
                        <p className="text-lg font-bold text-stone-900">
                          {customerTitle(order)}
                          {formatCountdown(order.pickup_time ?? pickupTimes[order.id] ?? null, now) && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              {formatCountdown(order.pickup_time ?? pickupTimes[order.id] ?? null, now)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-stone-500">{formatOrderDate(order.created_at)}</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {order.customer?.phone ? formatPhoneDisplay(order.customer.phone) : ""} ·{" "}
                          <span className="capitalize">{order.status}</span>
                        </p>
                        {order.pickup_type === "asap" ? (
                          <p className="text-sm text-amber-700">ASAP pickup</p>
                        ) : (
                          <p className="text-sm">
                            Scheduled: {formatPickupTime(order.pickup_time)}
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold">{formatPrice(order.total ?? order.subtotal)}</p>
                    </button>

                    {expanded && (
                      <div className="mt-4 border-t border-stone-100 pt-4">
                        <ul className="space-y-2 text-sm">
                          {order.order_items?.map((item) => (
                            <li
                              key={item.id}
                              className={
                                isGF(item) ? "rounded-lg bg-teal-50 px-2 py-1 text-teal-900" : ""
                              }
                            >
                              <span className="font-medium">
                                {item.quantity}x {toDisplayName(item.name)}
                              </span>
                              {isGF(item) && (
                                <span className="ml-2 text-xs font-medium text-teal-700">
                                  Gluten free
                                </span>
                              )}
                              {item.selected_options?.length > 0 && (
                                <p className="text-stone-600">
                                  {item.selected_options
                                    .map((o) => toDisplayName(o.name))
                                    .join(", ")}
                                </p>
                              )}
                              {item.special_request && (
                                <p className="italic text-stone-500">{item.special_request}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                        <OrderExtras order={order} />
                      </div>
                    )}

                    {order.status === "pending" && (
                      <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700">
                            Pickup time
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={pickupInputs[order.id] ?? ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                              const iso = pickupIsoFromInput(value);
                              setPickupInputs((prev) => ({ ...prev, [order.id]: value }));
                              if (iso) {
                                setPickupTimes((prev) => ({ ...prev, [order.id]: iso }));
                              }
                            }}
                            placeholder="630 or 1830"
                            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                          />
                          <p className="mt-1 text-xs text-stone-500">
                            Type 630 for 6:30 PM, or 1830 for 6:30 PM.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateOrder(
                                order.id,
                                "accepted",
                                pickupTimes[order.id] ?? defaultPickupTime(order, waitingMinutes)
                              )
                            }
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => updateOrder(order.id, "rejected")}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {tab === "settings" && (
        <div className="mt-6 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-stone-900">Pause service</h2>
            <p className="mt-1 text-sm text-stone-600">
              Temporarily stop new orders. Store stays open by business hours unless paused.
            </p>
            {paused && pauseUntil && (
              <p className="mt-2 text-sm text-amber-700">
                Paused until {formatOrderDate(pauseUntil)}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["rest_of_day", "Rest of day"],
                ["30", "30 mins"],
                ["60", "1 hour"],
                ["120", "2 hours"],
                ["clear", "Resume service"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => pauseService(value)}
                  className="rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
                >
                  {label}
                </button>
              ))}
            </div>
            {settingsMessage && (
              <p className="mt-2 text-sm text-emerald-700">{settingsMessage}</p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Sold out items</h2>
            <p className="mt-1 text-sm text-stone-600">
              Mark items unavailable on the customer menu.
            </p>
            <div className="mt-4 space-y-3">
              {menuItemsByCategory.map(({ category, section, items }) => {
                const expanded = expandedSoldOutCategory === category.id;
                const soldOutCount = items.filter((item) => soldOutIds.includes(item.id)).length;

                return (
                  <div key={category.id} className="rounded-xl border border-stone-200 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSoldOutCategory(expanded ? null : category.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="font-semibold text-stone-900">
                        {toDisplayName(category.name)}
                      </span>
                      <span className="text-sm text-stone-500">
                        {soldOutCount > 0 ? `${soldOutCount} sold out` : `${items.length} items`}
                      </span>
                    </button>

                    {expanded && (
                      <div className="flex flex-wrap gap-2 border-t border-stone-100 p-4">
                        {items.map((item: MenuItem) => {
                          const isGF = section?.slug === "gluten-free";
                          const soldOut = soldOutIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleSoldOut(item.id)}
                              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                                soldOut
                                  ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                  : isGF
                                    ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                                    : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              {toDisplayName(item.name)}
                              {soldOut ? " · Sold out" : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
