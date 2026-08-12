"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import { formatPhoneInput, toDisplayName } from "@/lib/utils";

export function LoginPageClient() {
  const router = useRouter();
  const customer = useCustomerStore((s) => s.customer);
  const setCustomer = useCustomerStore((s) => s.setCustomer);
  const clearCustomer = useCustomerStore((s) => s.clearCustomer);
  const refreshCustomer = useCustomerStore((s) => s.refreshCustomer);
  const clearCart = useCartStore((s) => s.clearCart);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!customer) return;
    queueMicrotask(() => {
      setProfileFirstName(customer.first_name);
      setProfileLastName(customer.last_name ?? "");
      setProfilePhone(formatPhoneInput(customer.phone));
    });
  }, [customer]);

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

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">Login</h1>
      {customer ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="font-medium text-stone-900">
              Logged in as {toDisplayName(customer.first_name)}
              {customer.last_name ? ` ${toDisplayName(customer.last_name)}` : ""}
            </p>
            <p className="mt-1 text-sm text-stone-600">{formatPhoneInput(customer.phone)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditingProfile((value) => !value)}
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                {editingProfile ? "Cancel edit" : "Edit profile"}
              </button>
              <Link
                href="/account"
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                Order history
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearCustomer();
                  clearCart();
                  router.push("/");
                }}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          </div>

          {editingProfile && (
            <form
              onSubmit={handleProfileSave}
              className="rounded-xl border border-stone-200 bg-white p-4 space-y-3"
            >
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
              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save profile"}
              </button>
            </form>
          )}
          {profileMessage && !editingProfile && (
            <p className="text-sm text-emerald-700">{profileMessage}</p>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-stone-600">
            Sign in with the first name and phone number from a previous order. You must have
            accepted Privacy Policy and Terms at checkout to keep an account.
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
