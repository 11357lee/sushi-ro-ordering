"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isLoggedInCustomer, useCustomerStore } from "@/lib/customer-store";
import { useCartStore } from "@/lib/cart-store";
import type { Order } from "@/types";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  canCustomerCancelOrder,
  formatPhoneInput,
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  isOrderFromToday,
  orderItemsToCartItems,
  toCustomerItemName,
  toDisplayName,
} from "@/lib/utils";

function timeLeft(pickupTime: string | null): string | null {
  if (!pickupTime) return null;
  const minutes = Math.ceil((new Date(pickupTime).getTime() - Date.now()) / 60000);
  if (minutes <= 0) return "Pickup time passed";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m left` : `${minutes}m left`;
}

function OrderCard({
  order,
  waitingMinutes,
  expandedId,
  setExpandedId,
  cancelling,
  deleting,
  canDeleteHistory,
  onCancel,
  onReorder,
  onDeleteHistory,
}: {
  order: Order;
  waitingMinutes: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  cancelling: string | null;
  deleting: string | null;
  canDeleteHistory: boolean;
  onCancel: (orderId: string) => void;
  onReorder: (order: Order) => void;
  onDeleteHistory: (orderId: string) => void;
}) {
  const canCancel = canCustomerCancelOrder(order, waitingMinutes);
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-stone-900">
            {order.customer?.first_name
              ? `${toDisplayName(order.customer.first_name)} ${order.customer.last_name ? toDisplayName(order.customer.last_name) : ""}`.trim()
              : "Your order"}
          </p>
          <p className="mt-1 text-sm text-stone-500">{formatOrderDate(order.created_at)}</p>
          <p className="mt-1 text-sm capitalize text-stone-600">{order.status}</p>
          {(order.status === "cancelled" || order.status === "rejected") &&
            order.status_reason && (
              <p className="mt-2 rounded-lg bg-stone-100 px-2.5 py-2 text-sm text-stone-700">
                Reason: {order.status_reason}
              </p>
            )}
          {order.status === "missed" && (
            <p className="mt-2 rounded-lg bg-orange-50 px-2.5 py-2 text-sm text-orange-800">
              Not accepted in time — you can reorder from the confirmation page or below.
            </p>
          )}
        </div>
        <span className="font-semibold">{formatPrice(order.total ?? order.subtotal)}</span>
      </div>
      {order.pickup_time && (
        <p className="mt-2 text-sm text-stone-600">
          Pickup: {formatPickupTime(order.pickup_time)}
          {timeLeft(order.pickup_time) ? ` · ${timeLeft(order.pickup_time)}` : ""}
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
            onClick={() => onCancel(order.id)}
            disabled={cancelling === order.id}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            {cancelling === order.id ? "Cancelling..." : "Cancel order"}
          </button>
        )}
        {canDeleteHistory && (
          <button
            type="button"
            onClick={() => onDeleteHistory(order.id)}
            disabled={deleting === order.id}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting === order.id ? "Deleting..." : "Delete history"}
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
                  {item.quantity}x {toCustomerItemName(item.name)}
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
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="mt-4 w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
            disabled={!order.order_items?.length}
          >
            Reorder
          </button>
        </div>
      )}
    </div>
  );
}

export function TrackingPageClient() {
  const router = useRouter();
  const customer = useCustomerStore((s) => s.customer);
  const loggedIn = isLoggedInCustomer(customer);
  const clearCart = useCartStore((s) => s.clearCart);
  const addItems = useCartStore((s) => s.addItems);
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [waitingMinutes, setWaitingMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setWaitingMinutes(data.waitingTime?.minutes ?? 15));
  }, []);

  useEffect(() => {
    if (!loggedIn || !customer?.id) return;

    const loadCustomerOrders = async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(`/api/customers/orders?customerId=${encodeURIComponent(customer.id)}`);
        const data = await res.json();
        setOrders(data.orders ?? []);
      } finally {
        setLoading(false);
      }
    };

    void loadCustomerOrders();
  }, [customer?.id, loggedIn]);

  const { todayOrders, historyOrders } = useMemo(() => {
    const today: Order[] = [];
    const history: Order[] = [];
    for (const order of orders) {
      if (isOrderFromToday(order.created_at)) today.push(order);
      else history.push(order);
    }
    return { todayOrders: today, historyOrders: history };
  }, [orders]);

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

  const handleReorder = (order: Order) => {
    const items = orderItemsToCartItems(order.order_items);
    if (!items.length) return;
    clearCart();
    addItems(items);
    router.push("/cart");
  };

  const isActivePickupOrder = (order: Order) => {
    if (order.status !== "pending" && order.status !== "accepted") return false;
    if (!order.pickup_time) return true;
    return new Date(order.pickup_time).getTime() > Date.now();
  };

  const handleDeleteHistory = async (orderId: string) => {
    if (!customer?.id) return;
    const ok = confirm("Delete this order from your history? This cannot be undone.");
    if (!ok) return;

    setDeleting(orderId);
    setCancelError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error ?? "Could not delete order");
        return;
      }
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      if (expandedId === orderId) setExpandedId(null);
    } catch {
      setCancelError("Could not delete order");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!customer?.id) return;
    const ok = confirm(
      "Delete all order history? Orders still waiting for pickup will be kept. This cannot be undone."
    );
    if (!ok) return;

    setDeletingAll(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(customer.id)}/history`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error ?? "Could not delete history");
        return;
      }
      setOrders((prev) => prev.filter(isActivePickupOrder));
      setExpandedId(null);
    } catch {
      setCancelError("Could not delete history");
    } finally {
      setDeletingAll(false);
    }
  };

  const cardProps = {
    waitingMinutes,
    expandedId,
    setExpandedId,
    cancelling,
    deleting,
    canDeleteHistory: loggedIn,
    onCancel: handleCancel,
    onReorder: handleReorder,
    onDeleteHistory: handleDeleteHistory,
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-stone-900">Track your order</h1>
      <p className="mt-2 text-sm text-stone-600 sm:text-base">
        {loggedIn
          ? "You are logged in. Today’s orders and past order history are shown below."
          : "Enter your phone number to see today's orders."}
      </p>

      {!loggedIn && (
        <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-2 sm:flex-row">
          <PhoneInput
            value={phone}
            onChange={setPhone}
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
      )}

      {cancelError && <p className="mt-4 text-sm text-red-600">{cancelError}</p>}

      {searched && orders.length === 0 && (
        <p className="mt-8 text-center text-stone-500">
          {loggedIn ? "No orders found." : "No orders found for today."}
        </p>
      )}

      {loggedIn ? (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-stone-900">Today’s orders</h2>
            {todayOrders.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">No orders placed today.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {todayOrders.map((order) => (
                  <OrderCard key={order.id} order={order} {...cardProps} />
                ))}
              </div>
            )}
          </section>
          <section>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Order history</h2>
                <p className="mt-1 text-sm text-stone-500">Orders from before today.</p>
              </div>
              {(historyOrders.length > 0 ||
                todayOrders.some((order) => !isActivePickupOrder(order))) && (
                <button
                  type="button"
                  onClick={() => void handleDeleteAllHistory()}
                  disabled={deletingAll}
                  className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingAll ? "Deleting..." : "Delete all history"}
                </button>
              )}
            </div>
            {historyOrders.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">No earlier orders yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {historyOrders.map((order) => (
                  <OrderCard key={order.id} order={order} {...cardProps} />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} {...cardProps} />
          ))}
        </div>
      )}
    </div>
  );
}
