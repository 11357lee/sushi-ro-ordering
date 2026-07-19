"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORDERING_DISABLED_START, TAX_RATE } from "@/lib/constants";
import { toggleCondimentExtra, useCartStore } from "@/lib/cart-store";
import {
  calcLineTotal,
  formatPrice,
  generateBusinessPickupSlots,
  isPauseActive,
  isRestaurantOpen,
  toDisplayName,
} from "@/lib/utils";

export function CartPageClient() {
  const {
    items,
    extras,
    pickupType,
    pickupTime,
    updateQuantity,
    removeItem,
    setExtras,
    setPickup,
    clearCart,
    subtotal,
    tax,
    total,
  } = useCartStore();

  const [pickupSlots, setPickupSlots] = useState<{ value: string; label: string }[]>([]);
  const [canAsap, setCanAsap] = useState(true);
  const [orderingDisabled, setOrderingDisabled] = useState(false);
  const [pickupNotice, setPickupNotice] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const settings = data.settings;
        const openNow = settings ? isRestaurantOpen(settings) : true;
        const paused = isPauseActive(settings?.pause_until);
        const disabledNow = Boolean(data.orderingDisabled);
        const nextSlots = generateBusinessPickupSlots({
          closingTime: ORDERING_DISABLED_START,
          days: 1,
        });
        setPickupSlots(nextSlots);
        setOrderingDisabled(disabledNow);
        setCanAsap(openNow && !paused);
        setPickupNotice(
          disabledNow
            ? "Online ordering is closed from 8:45 PM to 6:00 AM. Please order again after 6:00 AM."
            : openNow && !paused
            ? ""
            : "ASAP is unavailable while service is paused or outside business hours. Please choose Later."
        );
        if ((!openNow || paused) && pickupType === "asap" && nextSlots[0]) {
          setPickup("scheduled", nextSlots[0].value);
        } else if (pickupType === "scheduled" && !nextSlots.length) {
          setPickup("asap", null);
        }
      });
  }, [pickupType, setPickup]);

  const handleCondiment = (
    key:
      | "extraWasabi"
      | "extraGinger"
      | "extraSoySauce"
      | "noWasabi"
      | "noGinger"
      | "noSoySauce"
  ) => {
    setExtras(toggleCondimentExtra(extras, key));
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
          Browse menu
        </Link>
      </div>
    );
  }

  const condimentRows = [
    { extra: "extraWasabi" as const, no: "noWasabi" as const, label: "Wasabi" },
    { extra: "extraGinger" as const, no: "noGinger" as const, label: "Ginger" },
    { extra: "extraSoySauce" as const, no: "noSoySauce" as const, label: "Soy sauce" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">Your cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isGF = item.sectionSlug === "gluten-free";
          return (
            <div
              key={item.cartId}
              className={`rounded-xl border p-4 ${
                isGF ? "border-purple-300 bg-purple-50/50" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-stone-900">{toDisplayName(item.name)}</h3>
                  {isGF && (
                    <span className="text-xs font-medium text-purple-800">Gluten free</span>
                  )}
                  {item.selectedOptions.length > 0 && (
                    <p className="mt-1 text-sm text-stone-600">
                      {item.selectedOptions.map((o) => toDisplayName(o.name)).join(", ")}
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

      <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Pickup time</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPickup("asap", null)}
            disabled={!canAsap}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              pickupType === "asap"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >
            ASAP
          </button>
          <button
            type="button"
            onClick={() =>
              setPickup("scheduled", pickupTime ?? pickupSlots[0]?.value ?? null)
            }
            disabled={orderingDisabled || pickupSlots.length === 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              pickupType === "scheduled"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >
            Later
          </button>
        </div>
        {pickupNotice && <p className="mt-2 text-sm text-amber-700">{pickupNotice}</p>}
        {!orderingDisabled && pickupSlots.length === 0 && (
          <p className="mt-2 text-sm text-amber-700">
            Later pickup is not available for the rest of today.
          </p>
        )}
        {pickupType === "scheduled" && (
          <select
            value={pickupTime ?? ""}
            onChange={(e) => setPickup("scheduled", e.target.value)}
            className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          >
            {pickupSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
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
            onClick={() =>
              setExtras({ cutlery: true, cutleryQuantity: extras.cutleryQuantity || 1 })
            }
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
        <div className="mt-3 space-y-3">
          {condimentRows.map(({ extra, no, label }) => (
            <div key={label} className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-sm text-stone-600">{label}</span>
              <button
                type="button"
                onClick={() => handleCondiment(extra)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  extras[extra]
                    ? "bg-teal-600 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Extra
              </button>
              <button
                type="button"
                onClick={() => handleCondiment(no)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  extras[no]
                    ? "bg-stone-700 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                No
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Special instructions</h2>
        <textarea
          value={extras.specialInstructions}
          onChange={(e) => setExtras({ specialInstructions: e.target.value })}
          placeholder="Price may differ depending on your request."
          rows={3}
          className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </section>

      <div className="mt-6 space-y-2 border-t border-stone-200 pt-6 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-stone-600">Subtotal</span>
          <span>{formatPrice(subtotal())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Tax ({Math.round(TAX_RATE * 100)}%)</span>
          <span>{formatPrice(tax())}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-stone-900">
          <span>Total</span>
          <span>{formatPrice(total())}</span>
        </div>
      </div>

      {orderingDisabled ? (
        <button
          type="button"
          disabled
          className="mt-6 block w-full rounded-xl bg-stone-400 py-4 text-center text-lg font-semibold text-white"
        >
          Ordering unavailable until 6:00 AM
        </button>
      ) : (
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-xl bg-stone-900 py-4 text-center text-lg font-semibold text-white hover:bg-stone-800"
        >
          Continue to checkout
        </Link>
      )}
    </div>
  );
}
