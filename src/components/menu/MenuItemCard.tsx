"use client";

import { useState } from "react";
import type { MenuItem, SelectedOption } from "@/types";
import { LABEL_COLORS } from "@/types";
import { buildCartItemFromMenu, useCartStore } from "@/lib/cart-store";
import { formatPrice, toDisplayName } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  featured?: boolean;
  soldOut?: boolean;
}

export function MenuItemCard({ item, featured, soldOut }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [added, setAdded] = useState(false);

  const isGlutenFree = item.section?.slug === "gluten-free";
  const accentColor = item.section?.accent_color ?? "#1a1a1a";

  const toggleOption = (option: SelectedOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.id === option.id);
      if (exists) return prev.filter((o) => o.id !== option.id);
      return [...prev, option];
    });
  };

  const handleAdd = () => {
    if (soldOut) return;
    addItem(
      buildCartItemFromMenu(
        item.id,
        item.name,
        item.price,
        quantity,
        item.section?.slug ?? "menu",
        item.section?.name ?? "Menu",
        accentColor,
        selectedOptions,
        specialRequest
      )
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const optionTotal = selectedOptions.reduce((s, o) => s + o.price_modifier, 0);
  const lineTotal = (item.price + optionTotal) * quantity;

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isGlutenFree ? "border-teal-300 bg-teal-50/30" : "border-stone-200"
      } ${featured ? "ring-1 ring-stone-100" : ""}`}
      style={isGlutenFree ? { borderLeftWidth: 4, borderLeftColor: accentColor } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-stone-900">{toDisplayName(item.name)}</h3>
          {isGlutenFree && (
            <span className="mt-1 inline-block text-xs font-medium text-teal-700">
              Gluten free
            </span>
          )}
          {soldOut && (
            <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Sold out
            </span>
          )}
        </div>
        <span className="shrink-0 font-semibold text-stone-900">{formatPrice(item.price)}</span>
      </div>

      {item.description && (
        <p className="mt-2 text-sm text-stone-600">{item.description}</p>
      )}

      {item.labels && item.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.labels.map((label) => (
            <span
              key={label.id}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${LABEL_COLORS[label.slug] ?? "bg-stone-100 text-stone-700"}`}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {item.has_roll_options && item.options && item.options.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-xs font-medium text-stone-500">Options</p>
          {item.options.map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedOptions.some((o) => o.id === opt.id)}
                onChange={() =>
                  toggleOption({
                    id: opt.id,
                    name: opt.name,
                    price_modifier: opt.price_modifier,
                  })
                }
                className="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
              />
              <span>
                {opt.name} (+{formatPrice(opt.price_modifier)})
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-3">
        <input
          type="text"
          placeholder="Special request — price may differ depending on your request."
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <div className="flex items-center rounded-lg border border-stone-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-stone-600 hover:bg-stone-50"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 text-stone-600 hover:bg-stone-50"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            added
              ? "bg-emerald-600"
              : soldOut
                ? "bg-stone-400"
                : isGlutenFree
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-stone-900 hover:bg-stone-800"
          }`}
        >
          {soldOut ? "Sold out" : added ? "Added!" : `Add · ${formatPrice(lineTotal)}`}
        </button>
      </div>
    </article>
  );
}
