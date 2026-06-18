"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Sushi-Ro
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Login
          </Link>
          <Link
            href="/tracking"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Tracking
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
