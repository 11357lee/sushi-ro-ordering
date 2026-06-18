"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { calcLineTotal, formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const { items, extras, updateQuantity, removeItem, setExtras, subtotal } = useCartStore();

  const toggleExtra = (key: keyof typeof extras, value?: boolean) => {
    if (key === "cutlery") {
      setExtras({ cutlery: value ?? !extras.cutlery });
    } else if (key === "cutleryQuantity") {
      return;
    } else if (key === "specialInstructions") {
      return;
    } else {
      setExtras({ [key]: value ?? !extras[key] });
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-600">Add some delicious sushi to get started.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-800"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Your Cart</h1>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const isGF = item.sectionSlug === "gluten-free";
          return (
            <div
              key={item.cartId}
              className={`rounded-xl border p-4 ${isGF ? "border-teal-300 bg-teal-50/30" : "border-stone-200 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-stone-900">{item.name}</h3>
                  {isGF && (
                    <span className="text-xs font-medium text-teal-700">Gluten Free</span>
                  )}
                  {item.selectedOptions.length > 0 && (
                    <p className="mt-1 text-sm text-stone-600">
                      {item.selectedOptions.map((o) => o.name).join(", ")}
                    </p>
                  )}
                  {item.specialRequest && (
                    <p className="mt-1 text-sm italic text-stone-500">{item.specialRequest}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.cartId)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="px-3 py-1.5 text-stone-600"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="px-3 py-1.5 text-stone-600"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold">
                  {formatPrice(calcLineTotal(item.price, item.quantity, item.selectedOptions))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Cutlery</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExtras({ cutlery: false, cutleryQuantity: 0 })}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              !extras.cutlery ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            No cutlery
          </button>
          <button
            type="button"
            onClick={() => setExtras({ cutlery: true, cutleryQuantity: extras.cutleryQuantity || 1 })}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              extras.cutlery ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            Yes cutlery
          </button>
          {extras.cutlery && (
            <div className="flex items-center rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() =>
                  setExtras({ cutleryQuantity: Math.max(1, extras.cutleryQuantity - 1) })
                }
                className="px-3 py-1.5"
              >
                −
              </button>
              <span className="px-2 text-sm">{extras.cutleryQuantity}</span>
              <button
                type="button"
                onClick={() => setExtras({ cutleryQuantity: extras.cutleryQuantity + 1 })}
                className="px-3 py-1.5"
              >
                +
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Extras</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["extraWasabi", "Extra Wasabi"],
              ["extraGinger", "Extra Ginger"],
              ["extraSoySauce", "Extra Soy Sauce"],
              ["noWasabi", "No Wasabi"],
              ["noGinger", "No Ginger"],
              ["noSoySauce", "No Soy Sauce"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleExtra(key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                extras[key] ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">General Special Instructions</h2>
        <textarea
          value={extras.specialInstructions}
          onChange={(e) => setExtras({ specialInstructions: e.target.value })}
          placeholder="Price may differ depending on your request."
          rows={3}
          className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </section>

      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-6">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-xl font-bold">{formatPrice(subtotal())}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-xl bg-stone-900 py-4 text-center text-lg font-semibold text-white hover:bg-stone-800"
      >
        Continue to Checkout
      </Link>
    </div>
  );
}
