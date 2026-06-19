"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types";
import {
  canCustomerCancelOrder,
  formatPhoneInput,
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  toDisplayName,
} from "@/lib/utils";

export function TrackingPageClient() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [waitingMinutes, setWaitingMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setWaitingMinutes(data.waitingTime?.minutes ?? 15));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setCancelError(null);

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    setCancelError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error ?? "Could not cancel order");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-stone-900">Track your order</h1>
      <p className="mt-2 text-sm text-stone-600 sm:text-base">
        Enter your phone number to see today&apos;s orders.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          placeholder="+1 (613) 724-6088"
          inputMode="tel"
          required
          className="flex-1 rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-stone-900 px-5 py-2.5 font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "..." : "Track"}
        </button>
      </form>

      {cancelError && <p className="mt-4 text-sm text-red-600">{cancelError}</p>}

      {searched && orders.length === 0 && (
        <p className="mt-8 text-center text-stone-500">No orders found for today.</p>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => {
          const canCancel = canCustomerCancelOrder(order, waitingMinutes);
          return (
            <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">
                    {order.customer?.first_name
                      ? `${toDisplayName(order.customer.first_name)} ${order.customer.last_name ? toDisplayName(order.customer.last_name) : ""}`.trim()
                      : "Your order"}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {formatOrderDate(order.created_at)}
                  </p>
                  <p className="mt-1 text-sm capitalize text-stone-600">{order.status}</p>
                </div>
                <span className="font-semibold">{formatPrice(order.total ?? order.subtotal)}</span>
              </div>
              {order.pickup_time && (
                <p className="mt-2 text-sm text-stone-600">
                  Pickup: {formatPickupTime(order.pickup_time)}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="text-sm font-medium text-teal-600 hover:underline"
                >
                  {expandedId === order.id ? "Hide details" : "View details"}
                </button>
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelling === order.id}
                    className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancelling === order.id ? "Cancelling..." : "Cancel order"}
                  </button>
                )}
              </div>
              {expandedId === order.id && (
                <div className="mt-4 border-t border-stone-100 pt-4">
                  <h2 className="text-sm font-semibold text-stone-900">Items ordered</h2>
                  <ul className="mt-2 space-y-2 text-sm text-stone-700">
                    {order.order_items?.map((item) => (
                      <li key={item.id}>
                        <span className="font-medium">
                          {item.quantity}x {toDisplayName(item.name)}
                        </span>
                        {item.selected_options?.length > 0 && (
                          <p className="text-stone-500">
                            {item.selected_options.map((o) => toDisplayName(o.name)).join(", ")}
                          </p>
                        )}
                        {item.special_request && (
                          <p className="italic text-stone-500">{item.special_request}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
