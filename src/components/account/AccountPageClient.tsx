"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import type { Order } from "@/types";
import {
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  orderItemsToCartItems,
  toDisplayName,
} from "@/lib/utils";

export function AccountPageClient() {
  const router = useRouter();
  const customer = useCustomerStore((s) => s.customer);
  const clearCustomer = useCustomerStore((s) => s.clearCustomer);
  const addItems = useCartStore((s) => s.addItems);
  const setExtras = useCartStore((s) => s.setExtras);
  const clearCart = useCartStore((s) => s.clearCart);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!customer?.id) return;

    fetch(`/api/customers/orders?customerId=${encodeURIComponent(customer.id)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []));
  }, [customer?.id]);

  const handleReorder = (order: Order) => {
    const cartItems = orderItemsToCartItems(order.order_items);
    if (!cartItems.length) return;

    addItems(cartItems);
    setExtras({
      cutlery: order.cutlery,
      cutleryQuantity: order.cutlery_quantity,
      extraWasabi: order.extra_wasabi,
      extraGinger: order.extra_ginger,
      extraSoySauce: order.extra_soy_sauce,
      noWasabi: order.no_wasabi,
      noGinger: order.no_ginger,
      noSoySauce: order.no_soy_sauce,
      specialInstructions: order.special_instructions ?? "",
    });
    router.push("/cart");
  };

  const handleNewOrder = () => {
    clearCart();
    router.push("/");
  };

  const handleLogout = () => {
    clearCustomer();
    clearCart();
    router.push("/");
  };

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
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Hi, {toDisplayName(customer.first_name)}
          </h1>
          <p className="mt-1 text-stone-600">Your order history</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          Sign out
        </button>
      </div>

      <button
        type="button"
        onClick={handleNewOrder}
        className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        New order
      </button>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-stone-500">No orders yet.</p>
        ) : (
          orders.map((order) => {
            const expanded = expandedId === order.id;
            return (
            <div key={order.id} className="rounded-xl border border-stone-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-stone-500">{formatOrderDate(order.created_at)}</p>
                  <p className="mt-1 text-sm capitalize text-stone-600">{order.status}</p>
                  {order.pickup_time && (
                    <p className="text-sm text-stone-500">
                      Pickup: {formatPickupTime(order.pickup_time)}
                    </p>
                  )}
                </div>
                <span className="font-semibold">{formatPrice(order.total ?? order.subtotal)}</span>
              </div>
              {expanded && (
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
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : order.id)}
                className="mt-3 mr-2 rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                {expanded ? "Hide order" : "View order"}
              </button>
              <button
                type="button"
                onClick={() => handleReorder(order)}
                className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Reorder
              </button>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
}
