"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import type { Order } from "@/types";
import {
  formatPhoneInput,
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
  const refreshCustomer = useCustomerStore((s) => s.refreshCustomer);
  const addItems = useCartStore((s) => s.addItems);
  const setExtras = useCartStore((s) => s.setExtras);
  const clearCart = useCartStore((s) => s.clearCart);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState(customer?.first_name ?? "");
  const [profileLastName, setProfileLastName] = useState(customer?.last_name ?? "");
  const [profilePhone, setProfilePhone] = useState(
    customer?.phone ? formatPhoneInput(customer.phone) : ""
  );
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!customer?.id) return;

    fetch(`/api/customers/orders?customerId=${encodeURIComponent(customer.id)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []));
  }, [customer?.id]);

  useEffect(() => {
    if (!customer) return;
    queueMicrotask(() => {
      setProfileFirstName(customer.first_name);
      setProfileLastName(customer.last_name ?? "");
      setProfilePhone(formatPhoneInput(customer.phone));
    });
  }, [customer]);

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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?.id) return;
    setProfileLoading(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(customer.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileFirstName,
          lastName: profileLastName,
          phone: profilePhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update profile");
      refreshCustomer(data.customer);
      setEditingProfile(false);
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!customer?.id) return;
    const ok = confirm(
      "Delete your account and all order history? This cannot be undone."
    );
    if (!ok) return;
    setProfileLoading(true);
    setProfileError("");

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(customer.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not delete account");
      clearCustomer();
      clearCart();
      router.push("/");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setProfileLoading(false);
    }
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

      <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-stone-900">Profile</h2>
            <p className="text-sm text-stone-600">
              {toDisplayName(customer.first_name)}{" "}
              {customer.last_name ? toDisplayName(customer.last_name) : ""} ·{" "}
              {formatPhoneInput(customer.phone)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingProfile((value) => !value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            {editingProfile ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingProfile && (
          <form onSubmit={handleProfileSave} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                First name
                <input
                  type="text"
                  value={profileFirstName}
                  onChange={(e) => setProfileFirstName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-stone-700">
                Last name
                <input
                  type="text"
                  value={profileLastName}
                  onChange={(e) => setProfileLastName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-stone-700">
              Phone number
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(formatPhoneInput(e.target.value))}
                inputMode="tel"
                required
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              />
            </label>
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save profile"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={profileLoading}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Delete account
              </button>
            </div>
          </form>
        )}
        {profileMessage && !editingProfile && (
          <p className="mt-3 text-sm text-emerald-700">{profileMessage}</p>
        )}
      </section>

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
