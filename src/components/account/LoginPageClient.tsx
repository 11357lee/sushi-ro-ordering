"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomerStore } from "@/lib/customer-store";

export function LoginPageClient() {
  const router = useRouter();
  const setCustomer = useCustomerStore((s) => s.setCustomer);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
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
      <p className="mt-2 text-stone-600">
        Sign in with the first name and phone number from a previous order. You must have placed
        at least one order before.
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
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        <Link href="/" className="text-teal-600 hover:underline">
          Back to menu
        </Link>
      </p>
    </div>
  );
}
