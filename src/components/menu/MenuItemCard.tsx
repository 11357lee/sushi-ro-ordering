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

const BENTO_MEAT_NAMES = new Set([
  "Chicken Teriyaki",
  "Beef Teriyaki",
  "Salmon Teriyaki",
  "Shrimp Teriyaki",
  "Chicken cutlet with spicy sauce",
  "Pork cutlet with spicy sauce",
  "Fish Cutlet with spicy sauce",
  "Unagi",
  "Grilled Mackerel",
]);

const BENTO_SIDE_NAMES = new Set([
  "Maki (3 California and 3 BBQ Salmon)",
  "Tempura (3 vegetables and 1 Shrimp)",
  "Vegetable Gyoza",
  "Vegetable Spring Roll",
]);

export function MenuItemCard({ item, featured, soldOut }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [selectedRequiredOption, setSelectedRequiredOption] = useState<SelectedOption | null>(null);
  const [selectedBentoMeat, setSelectedBentoMeat] = useState<SelectedOption | null>(null);
  const [selectedBentoSide, setSelectedBentoSide] = useState<SelectedOption | null>(null);
  const [specialRequest, setSpecialRequest] = useState("");
  const [added, setAdded] = useState(false);
  const [optionError, setOptionError] = useState("");

  const isGlutenFree = item.section?.slug === "gluten-free";
  const isBento =
    item.category?.slug.includes("bento") || item.category?.name.toLowerCase().includes("bento");
  const isVeggieBento = item.name.toLowerCase().includes("veggie bento");
  const isNigiriSashimi = item.category?.slug.includes("nigiri-sashimi");
  const accentColor = isGlutenFree ? "#7e22ce" : item.section?.accent_color ?? "#1a1a1a";
  const fallbackBentoSides: SelectedOption[] = [
    { id: "bento-side-maki", name: "Maki (3 California and 3 BBQ Salmon)", price_modifier: 0 },
    { id: "bento-side-tempura", name: "Tempura (3 vegetables and 1 Shrimp)", price_modifier: 0 },
    { id: "bento-side-veggie-gyoza", name: "Vegetable Gyoza", price_modifier: 0 },
    { id: "bento-side-spring-roll", name: "Vegetable Spring Roll", price_modifier: 0 },
  ];
  const optionChoices = item.options ?? [];
  const bentoMeats = optionChoices.filter((option) => BENTO_MEAT_NAMES.has(option.name));
  const bentoSidesFromOptions = optionChoices.filter((option) => BENTO_SIDE_NAMES.has(option.name));
  const bentoSides = bentoSidesFromOptions.length > 0 ? bentoSidesFromOptions : fallbackBentoSides;
  const isBentoBuilder =
    isBento && !isVeggieBento && (item.name.toLowerCase() === "bento box" || bentoMeats.length > 0);
  const nigiriSashimiOptions = isNigiriSashimi ? optionChoices : [];
  const optionalOptions = optionChoices.filter(
    (option) =>
      !BENTO_MEAT_NAMES.has(option.name) &&
      !BENTO_SIDE_NAMES.has(option.name) &&
      !(isNigiriSashimi && ["2 pcs Nigiri", "3 pcs Sashimi"].includes(option.name))
  );

  const toggleOption = (option: SelectedOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.id === option.id);
      if (exists) return prev.filter((o) => o.id !== option.id);
      return [...prev, option];
    });
  };

  const handleAdd = () => {
    if (soldOut) return;
    if (isBentoBuilder && !selectedBentoMeat) {
      setOptionError("Please choose one bento meat.");
      return;
    }
    if ((isBentoBuilder || (isBento && !isVeggieBento)) && !selectedBentoSide) {
      setOptionError("Please choose one bento side.");
      return;
    }
    if (isNigiriSashimi && nigiriSashimiOptions.length > 0 && !selectedRequiredOption) {
      setOptionError("Please choose nigiri or sashimi.");
      return;
    }
    const finalOptions = [
      ...selectedOptions,
      ...(selectedRequiredOption ? [selectedRequiredOption] : []),
      ...(selectedBentoMeat ? [selectedBentoMeat] : []),
      ...(selectedBentoSide ? [selectedBentoSide] : []),
    ];
    addItem(
      buildCartItemFromMenu(
        item.id,
        item.name,
        item.price,
        quantity,
        item.section?.slug ?? "menu",
        item.section?.name ?? "Menu",
        accentColor,
        finalOptions,
        specialRequest
      )
    );
    setOptionError("");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const selectedChoiceOptions = [
    ...selectedOptions,
    ...(selectedRequiredOption ? [selectedRequiredOption] : []),
    ...(selectedBentoMeat ? [selectedBentoMeat] : []),
    ...(selectedBentoSide ? [selectedBentoSide] : []),
  ];
  const optionTotal = selectedChoiceOptions.reduce((s, o) => s + o.price_modifier, 0);
  const lineTotal = (item.price + optionTotal) * quantity;
  const displayPrice =
    isBentoBuilder && bentoMeats.length > 0
      ? `From ${formatPrice(Math.min(...bentoMeats.map((option) => option.price_modifier)))}`
      : formatPrice(item.price);
  const addButtonLabel =
    isBentoBuilder && !selectedBentoMeat
      ? "Choose meat"
      : isNigiriSashimi && nigiriSashimiOptions.length > 0 && !selectedRequiredOption
        ? "Choose option"
        : `Add · ${formatPrice(lineTotal)}`;

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4 ${
        isGlutenFree ? "border-purple-300 bg-purple-50/50" : "border-stone-200"
      } ${featured ? "ring-1 ring-stone-100" : ""}`}
      style={isGlutenFree ? { borderLeftWidth: 4, borderLeftColor: accentColor } : undefined}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 sm:text-base">{toDisplayName(item.name)}</h3>
          {isGlutenFree && (
            <span className="mt-1 inline-block text-xs font-medium text-purple-800">
              Gluten free
            </span>
          )}
          {soldOut && (
            <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Sold out
            </span>
          )}
        </div>
        <span className="shrink-0 text-sm font-semibold text-stone-900 sm:text-base">
          {displayPrice}
        </span>
      </div>

      {item.description && (
        <p className="mt-2 text-xs text-stone-600 sm:text-sm">{item.description}</p>
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

      {optionalOptions.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-xs font-medium text-stone-500">Options</p>
          {optionalOptions.map((opt) => (
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

      {isNigiriSashimi && nigiriSashimiOptions.length > 0 && (
        <div className="mt-3 space-y-1.5 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs font-semibold text-stone-900">Choose one *</p>
          {nigiriSashimiOptions.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name={`nigiri-sashimi-${item.id}`}
                checked={selectedRequiredOption?.id === option.id}
                onChange={() => {
                  setSelectedRequiredOption(option);
                  setOptionError("");
                }}
                className="border-stone-300 text-teal-600 focus:ring-teal-500"
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      )}

      {isBentoBuilder && (
        <div className="mt-3 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">Choose one meat *</p>
          {bentoMeats.map((meat) => (
            <label key={meat.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name={`bento-meat-${item.id}`}
                checked={selectedBentoMeat?.id === meat.id}
                onChange={() => {
                  setSelectedBentoMeat(meat);
                  setOptionError("");
                }}
                className="border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>
                {meat.name} ({formatPrice(meat.price_modifier)})
              </span>
            </label>
          ))}
        </div>
      )}

      {(isBentoBuilder || (isBento && !isVeggieBento)) && (
        <div className="mt-3 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">Choose one side *</p>
          {bentoSides.map((side) => (
            <label key={side.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name={`bento-side-${item.id}`}
                checked={selectedBentoSide?.id === side.id}
                onChange={() => {
                  setSelectedBentoSide(side);
                  setOptionError("");
                }}
                className="border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>{side.name}</span>
            </label>
          ))}
        </div>
      )}

      {optionError && <p className="mt-2 text-sm font-medium text-red-600">{optionError}</p>}

      <div className="mt-3">
        <input
          type="text"
          placeholder="Special request"
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
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
          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm ${
            added
              ? "bg-emerald-600"
              : soldOut
                ? "bg-stone-400"
                : isGlutenFree
                  ? "bg-purple-700 hover:bg-purple-800"
                  : "bg-stone-900 hover:bg-stone-800"
          }`}
        >
          {soldOut ? "Sold out" : added ? "Added!" : addButtonLabel}
        </button>
      </div>
    </article>
  );
}
