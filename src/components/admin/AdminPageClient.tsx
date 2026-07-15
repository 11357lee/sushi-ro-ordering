"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  isWithinBusinessHours,
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

function pickupIsoFromPrepMinutes(minutes: string): string {
  const prepMinutes = Math.max(1, Number(minutes) || 15);
  return addMinutes(new Date(), prepMinutes).toISOString();
}

function OrderExtras({ order }: { order: Order }) {
  const extras: string[] = [];
  extras.push(order.cutlery ? `Cutlery x${order.cutlery_quantity}` : "No cutlery");
  if (order.extra_wasabi) extras.push("Extra wasabi");
  if (order.extra_ginger) extras.push("Extra ginger");
  if (order.extra_soy_sauce) extras.push("Extra soy sauce");
  if (order.no_wasabi) extras.push("No wasabi");
  if (order.no_ginger) extras.push("No ginger");
  if (order.no_soy_sauce) extras.push("No soy sauce");

  if (!extras.length) return null;

  return (
    <ul className="flex flex-wrap gap-2 text-sm">
      {extras.map((line) => (
        <li key={line} className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-800">
          {line}
        </li>
      ))}
    </ul>
  );
}

function SpecialNotes({ order }: { order: Order }) {
  const notes = [order.allergy_notes, order.special_instructions].filter(Boolean);
  if (!notes.length) return null;

  return (
    <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
      {notes.join(" · ")}
    </div>
  );
}

function OrderItems({ order }: { order: Order }) {
  return (
    <ul className="space-y-2 text-sm">
      {order.order_items?.map((item) => {
        const isGF = item.section_slug === "gluten-free";
        return (
          <li
            key={item.id}
            className={isGF ? "rounded-lg bg-purple-50 px-2 py-1 text-purple-950" : ""}
          >
            <span className="font-medium">
              {item.quantity}x {toDisplayName(item.name)}
            </span>
            {isGF && (
              <span className="ml-2 text-xs font-medium text-purple-800">Gluten free</span>
            )}
            {item.selected_options?.length > 0 && (
              <p className="text-stone-600">
                {item.selected_options.map((o) => toDisplayName(o.name)).join(", ")}
              </p>
            )}
            {item.special_request && (
              <p className="italic text-red-600">{item.special_request}</p>
            )}
          </li>
        );
      })}
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
  const [specialClosedDates, setSpecialClosedDates] = useState<string[]>([]);
  const [newClosedDate, setNewClosedDate] = useState("");
  const [closingTime, setClosingTime] = useState("21:00:00");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pickupTimes, setPickupTimes] = useState<Record<string, string>>({});
  const [pickupInputs, setPickupInputs] = useState<Record<string, string>>({});
  const [reasonInputs, setReasonInputs] = useState<Record<string, string>>({});
  const [customReasonInputs, setCustomReasonInputs] = useState<Record<string, string>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
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
    setSpecialClosedDates(data.settings?.special_closed_dates ?? []);
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
          next[order.id] = String(waitingMinutes);
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

  const updateOrder = async (
    orderId: string,
    status: string,
    pickupTime?: string,
    statusReason?: string
  ) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_order", orderId, status, pickupTime, statusReason }),
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

  const updateSpecialClosedDates = async (dates: string[]) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_special_closed_dates", specialClosedDates: dates }),
    });
    setSpecialClosedDates(dates);
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
    timezone: "America/Toronto",
  });
  const paused = isPauseActive(pauseUntil);
  const withinBusinessHours = isWithinBusinessHours();

  useEffect(() => {
    if (!authenticated || !restaurantOpen) return;
    const pendingOrders = orders.filter((order) => order.status === "pending");
    if (!pendingOrders.length) return;

    const playTone = () => {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      const hasAsap = pendingOrders.some((order) => order.pickup_type === "asap");
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = hasAsap ? 880 : 520;
      oscillator.type = hasAsap ? "square" : "sine";
      gain.gain.value = 0.04;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    };

    playTone();
    const interval = setInterval(playTone, 5000);
    return () => clearInterval(interval);
  }, [authenticated, orders, restaurantOpen]);

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
    <div className="mx-auto max-w-5xl px-4 py-6 text-base sm:py-8">
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
                const countdown = formatCountdown(order.pickup_time ?? pickupTimes[order.id] ?? null, now);

                return (
                  <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
                    <SpecialNotes order={order} />
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="w-full space-y-4 text-left"
                    >
                      <div>
                        <p className="text-xl font-bold text-stone-900">
                          {customerTitle(order)}
                          {countdown && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              {countdown}
                            </span>
                          )}
                        </p>
                        <p className="text-base text-stone-500">{formatOrderDate(order.created_at)}</p>
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
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Extras
                        </p>
                        <OrderExtras order={order} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Total
                        </p>
                        <p className="text-xl font-bold">{formatPrice(order.total ?? order.subtotal)}</p>
                        <p className="text-sm text-stone-500">
                          Subtotal {formatPrice(order.subtotal)} · Tax {formatPrice(order.tax ?? 0)}
                        </p>
                      </div>
                    </button>

                    {expanded && (
                      <div className="mt-4 border-t border-stone-100 pt-4">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
                          Items
                        </h3>
                        <OrderItems order={order} />
                      </div>
                    )}

                    {order.status === "pending" && (
                      <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700">
                            Preparation time
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["10", "15", "20", "25", "30"].map((minutes) => (
                              <button
                                key={minutes}
                                type="button"
                                onClick={() => {
                                  setPickupInputs((prev) => ({ ...prev, [order.id]: minutes }));
                                  setPickupTimes((prev) => ({
                                    ...prev,
                                    [order.id]: pickupIsoFromPrepMinutes(minutes),
                                  }));
                                }}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                                  pickupInputs[order.id] === minutes
                                    ? "bg-stone-900 text-white"
                                    : "bg-stone-100 text-stone-700"
                                }`}
                              >
                                {minutes}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={pickupInputs[order.id] ?? ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                              setPickupInputs((prev) => ({ ...prev, [order.id]: value }));
                              if (value) {
                                setPickupTimes((prev) => ({
                                  ...prev,
                                  [order.id]: pickupIsoFromPrepMinutes(value),
                                }));
                              }
                            }}
                            placeholder="Minutes"
                            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700">
                            Reject reason
                          </label>
                          <select
                            value={reasonInputs[order.id] ?? "Out of items"}
                            onChange={(e) =>
                              setReasonInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                          >
                            <option>Out of items</option>
                            <option>Restaurant too busy</option>
                            <option>Custom message</option>
                          </select>
                          {reasonInputs[order.id] === "Custom message" && (
                            <input
                              type="text"
                              placeholder="Custom reject message"
                              onChange={(e) =>
                                setCustomReasonInputs((prev) => ({
                                  ...prev,
                                  [order.id]: e.target.value,
                                }))
                              }
                              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateOrder(
                                order.id,
                                "accepted",
                                pickupTimes[order.id] ?? pickupIsoFromPrepMinutes(pickupInputs[order.id] ?? String(waitingMinutes))
                              )
                            }
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateOrder(
                                order.id,
                                "rejected",
                                undefined,
                                reasonInputs[order.id] === "Custom message"
                                  ? customReasonInputs[order.id] || "Custom message"
                                  : reasonInputs[order.id] ?? "Out of items"
                              )
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {order.status === "accepted" && (
                      <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                        <label className="block text-sm font-medium text-stone-700">
                          Cancel reason
                        </label>
                        <select
                          value={reasonInputs[order.id] ?? "Customer cancellation"}
                          onChange={(e) =>
                            setReasonInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                          }
                          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                        >
                          <option>Customer cancellation</option>
                          <option>Out of items</option>
                          <option>Custom message</option>
                        </select>
                        {reasonInputs[order.id] === "Custom message" && (
                          <input
                            type="text"
                            placeholder="Custom cancel message"
                            onChange={(e) =>
                              setCustomReasonInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            updateOrder(
                              order.id,
                              "cancelled",
                              undefined,
                              reasonInputs[order.id] === "Custom message"
                                ? customReasonInputs[order.id] || "Custom message"
                                : reasonInputs[order.id] ?? "Customer cancellation"
                            )
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Cancel order
                        </button>
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
                  disabled={!withinBusinessHours && value !== "clear"}
                  onClick={() => pauseService(value)}
                  className="rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
            {settingsMessage && (
              <p className="mt-2 text-sm text-emerald-700">{settingsMessage}</p>
            )}
            {!withinBusinessHours && (
              <p className="mt-2 text-sm text-stone-500">
                Pause buttons are available during business hours only.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Special closed dates</h2>
            <p className="mt-1 text-sm text-stone-600">
              Add holidays or one-off closure dates.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="date"
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newClosedDate || specialClosedDates.includes(newClosedDate)) return;
                  updateSpecialClosedDates([...specialClosedDates, newClosedDate].sort());
                  setNewClosedDate("");
                }}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Add closed date
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {specialClosedDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() =>
                    updateSpecialClosedDates(specialClosedDates.filter((d) => d !== date))
                  }
                  className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                >
                  {date} ×
                </button>
              ))}
              {!specialClosedDates.length && (
                <p className="text-sm text-stone-500">No special closed dates.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Sold out items</h2>
            <p className="mt-1 text-sm text-stone-600">
              Mark items unavailable on the customer menu.
            </p>
            <div className="mt-4 space-y-6">
              {menu?.sections.map((menuSection) => (
                <div key={menuSection.id}>
                  <h3
                    className={`mb-3 text-base font-bold ${
                      menuSection.slug === "gluten-free" ? "text-purple-900" : "text-stone-900"
                    }`}
                  >
                    {toDisplayName(menuSection.name)}
                  </h3>
                  <div className="space-y-3">
              {menuItemsByCategory
                .filter(({ section }) => section?.id === menuSection.id)
                .map(({ category, section, items }) => {
                const expanded = expandedSoldOutCategory === category.id;
                const soldOutCount = items.filter((item) => soldOutIds.includes(item.id)).length;
                const isGFCategory = section?.slug === "gluten-free";

                return (
                  <div
                    key={category.id}
                    className={`rounded-xl border bg-white ${
                      isGFCategory ? "border-purple-200 bg-purple-50/40" : "border-stone-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSoldOutCategory(expanded ? null : category.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className={`font-semibold ${isGFCategory ? "text-purple-950" : "text-stone-900"}`}>
                        {toDisplayName(category.name)}
                      </span>
                      <span className="text-sm text-stone-500">
                        {soldOutCount > 0 ? `${soldOutCount} sold out` : `${items.length} items`}
                      </span>
                    </button>

                    {expanded && (
                      <div className="flex flex-wrap gap-2 border-t border-stone-100 p-4">
                        {items.map((item: MenuItem) => {
                          const soldOut = soldOutIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleSoldOut(item.id)}
                              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                                soldOut
                                  ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                  : isGFCategory
                                    ? "bg-purple-100 text-purple-900 ring-1 ring-purple-300"
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
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
