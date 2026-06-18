"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomerStore } from "@/lib/customer-store";
import type { Order } from "@/types";
import { formatPickupTime, formatPrice } from "@/lib/utils";

export function AccountPageClient() {
  const customer = useCustomerStore((s) => s.customer);
  const clearCustomer = useCustomerStore((s) => s.clearCustomer);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!customer?.phone) return;

    fetch(`/api/orders/track?phone=${encodeURIComponent(customer.phone)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []));
  }, [customer?.phone]);

  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-stone-600">Please log in to view your account.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Hi, {customer.first_name}</h1>
          <p className="mt-1 text-stone-600">Your order history</p>
        </div>
        <button
          type="button"
          onClick={clearCustomer}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          Sign out
        </button>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Order Again
      </Link>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-stone-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-stone-200 p-4">
              <div className="flex justify-between">
                <span className="font-semibold">#{order.order_number}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <p className="mt-1 text-sm capitalize text-stone-600">{order.status}</p>
              {order.pickup_time && (
                <p className="text-sm text-stone-500">
                  {formatPickupTime(order.pickup_time)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
