"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerStore } from "@/lib/customer-store";
import { formatPrice } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);
  const customer = useCustomerStore((s) => s.customer);
  const clearCustomer = useCustomerStore((s) => s.clearCustomer);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const logout = () => {
    clearCustomer();
    clearCart();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
          Sushi-Ro
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-3">
          {mounted && customer ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-2 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 sm:px-3"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-2 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 sm:px-3"
            >
              Login
            </Link>
          )}
          <Link
            href="/tracking"
            className="rounded-lg px-2 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 sm:px-3"
          >
            Tracking
          </Link>
          <Link
            href="/cart"
            className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 sm:px-4"
          >
            Cart{mounted && itemCount > 0 ? ` (${formatPrice(total)})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
