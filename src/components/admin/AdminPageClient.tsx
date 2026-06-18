"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/types";
import { WAITING_TIME_LABELS } from "@/types";
import { formatPickupTime, formatPrice } from "@/lib/utils";
import { addMinutes } from "date-fns";

export function AdminPageClient() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [waitingMinutes, setWaitingMinutes] = useState(15);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

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
    setIsOpen(data.settings?.is_open ?? true);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
      fetchSettings();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchOrders, fetchSettings]);

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

  const acceptOrder = (order: Order) => {
    const pickupTime = addMinutes(new Date(), waitingMinutes).toISOString();
    updateOrder(order.id, "accepted", pickupTime);
  };

  const updateWaitingTime = async (minutes: number) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_waiting_time", waitingMinutes: minutes }),
    });
    setWaitingMinutes(minutes);
  };

  const toggleOpen = async () => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_open_status", isOpen: !isOpen }),
    });
    setIsOpen(!isOpen);
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-stone-900">Admin Panel</h1>
        <p className="mt-2 text-sm text-stone-600">
          Development admin for order management. Uses the same API as the future iOS app.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Admin API Key"
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">Admin — Incoming Orders</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleOpen}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              isOpen ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </button>
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
      </div>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-stone-500">No pending orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-bold">#{order.order_number}</p>
                  <p className="text-sm text-stone-600">
                    {order.customer?.first_name} {order.customer?.last_name} ·{" "}
                    {order.customer?.phone}
                  </p>
                  <p className="mt-1 text-sm capitalize">
                    Status: <strong>{order.status}</strong>
                  </p>
                  {order.pickup_type === "asap" ? (
                    <p className="text-sm text-amber-700">ASAP — needs confirmation</p>
                  ) : (
                    <p className="text-sm">
                      Scheduled: {formatPickupTime(order.pickup_time)}
                    </p>
                  )}
                </div>
                <p className="text-lg font-bold">{formatPrice(order.subtotal)}</p>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-stone-600">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.name}
                    {item.section_slug === "gluten-free" && (
                      <span className="ml-2 text-teal-600">(GF)</span>
                    )}
                  </li>
                ))}
              </ul>

              {order.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => acceptOrder(order)}
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
              )}

              {order.status === "accepted" && (
                <button
                  type="button"
                  onClick={() => updateOrder(order.id, "completed")}
                  className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
