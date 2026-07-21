"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomerStore } from "@/lib/customer-store";
import { formatPhoneInput, toDisplayName } from "@/lib/utils";

export function LoginPageClient() {
  const router = useRouter();
  const customer = useCustomerStore((s) => s.customer);
  const setCustomer = useCustomerStore((s) => s.setCustomer);
  const clearCustomer = useCustomerStore((s) => s.clearCustomer);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");

      setCustomer(data.customer);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">Login</h1>
      {customer ? (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <p className="font-medium text-stone-900">
            Logged in as {toDisplayName(customer.first_name)}
          </p>
          <button
            type="button"
            onClick={() => {
              clearCustomer();
              router.push("/");
            }}
            className="mt-4 w-full rounded-xl bg-stone-900 py-3 font-semibold text-white hover:bg-stone-800"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
      <p className="mt-2 text-stone-600">
        Sign in with the first name and phone number from a previous order. You must have placed
        at least one order before.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        We use your name and phone number only to find your order history and contact you about
        pickup orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Phone Number</label>
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
          className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-stone-500">
        <Link href="/" className="text-teal-600 hover:underline">
          Back to menu
        </Link>
      </p>
    </div>
  );
}
