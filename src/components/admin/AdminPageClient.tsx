"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addMinutes } from "date-fns";
import type { MenuData, MenuItem, Order } from "@/types";
import { WAITING_TIME_LABELS } from "@/types";
import {
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  generateScheduledPickupSlots,
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
  const [loading, setLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const pickupSlots = useMemo(
    () => generateScheduledPickupSlots(closingTime, 15),
    [closingTime]
  );

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
      setOrders(data.orders ?? []);
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
    setPickupTimes((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        if (!next[order.id]) {
          next[order.id] = defaultPickupTime(order, waitingMinutes);
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

  const menuItemsBySection = useMemo(() => {
    if (!menu) return [];
    return menu.sections.map((section) => ({
      section,
      items: menu.items.filter((item) => {
        const cat = menu.categories.find((c) => c.id === item.category_id);
        return cat?.section_id === section.id;
      }),
    }));
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
                        <p className="text-lg font-bold text-stone-900">{customerTitle(order)}</p>
                        <p className="text-sm text-stone-500">{formatOrderDate(order.created_at)}</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {order.customer?.phone} ·{" "}
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
                          <select
                            value={pickupTimes[order.id] ?? defaultPickupTime(order, waitingMinutes)}
                            onChange={(e) =>
                              setPickupTimes((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                          >
                            {pickupSlots.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </select>
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
            {menuItemsBySection.map(({ section, items }) => (
              <div key={section.id} className="mt-4">
                <h3 className="text-sm font-semibold text-stone-700">
                  {toDisplayName(section.name)}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((item: MenuItem) => {
                    const isGF = section.slug === "gluten-free";
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
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
