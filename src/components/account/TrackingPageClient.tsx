"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/types";
import { formatPickupTime, formatPrice } from "@/lib/utils";

export function TrackingPageClient() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

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
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
        );
      }
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">Track Your Order</h1>
      <p className="mt-2 text-stone-600">Enter your phone number to see pickup time and status.</p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
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

      {searched && orders.length === 0 && (
        <p className="mt-8 text-center text-stone-500">No orders found for this phone number.</p>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-stone-900">Order #{order.order_number}</p>
                <p className="mt-1 text-sm capitalize text-stone-600">{order.status}</p>
              </div>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.pickup_time && (
              <p className="mt-2 text-sm text-stone-600">
                Pickup: {formatPickupTime(order.pickup_time)}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <Link
                href={`/order/${order.id}/confirmation`}
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                View details
              </Link>
              {(order.status === "accepted" || order.status === "pending") && (
                <button
                  type="button"
                  onClick={() => handleCancel(order.id)}
                  disabled={cancelling === order.id}
                  className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  {cancelling === order.id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
