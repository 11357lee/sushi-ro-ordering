"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TAX_RATE } from "@/lib/constants";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import { formatPhoneInput, formatPickupTime, formatPrice } from "@/lib/utils";
import type { CreateOrderPayload } from "@/types";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, extras, pickupType, pickupTime, subtotal, tax, total, clearCart } =
    useCartStore();
  const customer = useCustomerStore((s) => s.customer);
  const setCustomer = useCustomerStore((s) => s.setCustomer);

  const [firstName, setFirstName] = useState(customer?.first_name ?? "");
  const [lastName, setLastName] = useState(customer?.last_name ?? "");
  const [phone, setPhone] = useState(customer?.phone ? formatPhoneInput(customer.phone) : "");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Your cart is empty.</p>
      </div>
    );
  }

  if (pickupType === "scheduled" && !pickupTime) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Please choose a pickup time on the cart page.</p>
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
      phone,
      pickupType,
      pickupTime: pickupType === "asap" ? null : pickupTime,
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
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
      <p className="mt-1 text-sm text-stone-600">Pay in store when collecting your order.</p>

      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
        <p>
          <span className="font-medium">Pickup:</span>{" "}
          {pickupType === "asap" ? "ASAP" : formatPickupTime(pickupTime)}
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
            <span>{formatPrice(tax())}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total())}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-700">First name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Last name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Phone number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
            placeholder="(613) 724-6088"
            inputMode="tel"
            required
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            Allergy / ingredient request
          </label>
          <textarea
            value={allergyNotes}
            onChange={(e) => setAllergyNotes(e.target.value)}
            placeholder="Price may differ depending on your request."
            rows={3}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <label className="flex items-start gap-2 rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            required
            className="mt-1 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
          />
          <span>
            I agree to Sushi-Ro&apos;s{" "}
            <Link href="/privacy" className="font-medium text-teal-700 underline">
              Privacy Policy and Terms
            </Link>
            .
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-stone-900 py-4 text-lg font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Sending order..." : "Send order"}
        </button>
      </form>
    </div>
  );
}
