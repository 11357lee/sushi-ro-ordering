"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import { generatePickupSlots, formatPrice } from "@/lib/utils";
import type { CreateOrderPayload } from "@/types";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, extras, subtotal, clearCart } = useCartStore();
  const customer = useCustomerStore((s) => s.customer);
  const setCustomer = useCustomerStore((s) => s.setCustomer);

  const [firstName, setFirstName] = useState(customer?.first_name ?? "");
  const [lastName, setLastName] = useState(customer?.last_name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [pickupSlot, setPickupSlot] = useState("asap");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickupSlots, setPickupSlots] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setPickupSlots(
          generatePickupSlots(data.settings?.closing_time ?? "20:45:00", data.settings?.timezone)
        );
      });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Your cart is empty.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload: CreateOrderPayload = {
      firstName,
      lastName,
      email,
      phone,
      pickupType: pickupSlot === "asap" ? "asap" : "scheduled",
      pickupTime: pickupSlot === "asap" ? null : pickupSlot,
      allergyNotes,
      items,
      extras,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      if (data.order?.customer) {
        setCustomer(data.order.customer);
      }

      clearCart();
      router.push(data.redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Pickup &amp; Customer Info</h1>
      <p className="mt-1 text-sm text-stone-600">
        Pay in store when collecting · Subtotal {formatPrice(subtotal())}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700">Pickup Time</label>
          <select
            value={pickupSlot}
            onChange={(e) => setPickupSlot(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            required
          >
            {pickupSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-stone-700">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-stone-500">Confirmation email from sushi-ro@sushi-ro.com</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            Allergy / Ingredient Request
          </label>
          <textarea
            value={allergyNotes}
            onChange={(e) => setAllergyNotes(e.target.value)}
            placeholder="Price may differ depending on your request."
            rows={3}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-stone-900 py-4 text-lg font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Sending Order..." : "Send Order"}
        </button>
      </form>
    </div>
  );
}
