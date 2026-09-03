import type { MenuOption } from "@/types";

/** Required single-select choices (radio). Not soy sheet / deep-fried / spicy. */
export const REQUIRED_CHOICE_OPTION_IDS = new Set<string>([
  // Dragon toppings
  "33333333-3333-3333-3333-333333333701",
  "33333333-3333-3333-3333-333333333702",
  "33333333-3333-3333-3333-333333333703",
  "33333333-3333-3333-3333-333333333704",
  "33333333-3333-3333-3333-333333333705",
  "33333333-3333-3333-3333-333333333706",
  // House toppings
  "33333333-3333-3333-3333-333333333711",
  "33333333-3333-3333-3333-333333333712",
  "33333333-3333-3333-3333-333333333713",
  // BBQ / Alaska / Tataki / Gyoza proteins
  "33333333-3333-3333-3333-333333333721",
  "33333333-3333-3333-3333-333333333722",
  "33333333-3333-3333-3333-333333333723",
  "33333333-3333-3333-3333-333333333724",
  "33333333-3333-3333-3333-333333333725",
  "33333333-3333-3333-3333-333333333726",
  "33333333-3333-3333-3333-333333333727",
  "33333333-3333-3333-3333-333333333728",
  // Pizza
  "33333333-3333-3333-3333-333333333731",
  "33333333-3333-3333-3333-333333333732",
  "33333333-3333-3333-3333-333333333733",
  "33333333-3333-3333-3333-333333333734",
  // Drinks
  "33333333-3333-3333-3333-333333333741",
  "33333333-3333-3333-3333-333333333742",
  "33333333-3333-3333-3333-333333333743",
  "33333333-3333-3333-3333-333333333744",
  "33333333-3333-3333-3333-333333333745",
  "33333333-3333-3333-3333-333333333746",
  "33333333-3333-3333-3333-333333333747",
  "33333333-3333-3333-3333-333333333748",
]);

/** Sweet-roll flavours: pick up to 2, duplicates allowed. */
export const MULTI_MAX2_OPTION_IDS = new Set<string>([
  "33333333-3333-3333-3333-333333333801",
  "33333333-3333-3333-3333-333333333802",
  "33333333-3333-3333-3333-333333333803",
]);

export const SOY_SHEET_OPTION_ID = "33333333-3333-3333-3333-333333333302";
export const SOY_SHEET_MAKI_MORI_OPTION_ID = "33333333-3333-3333-3333-333333333307";

export function isRequiredChoiceOption(option: Pick<MenuOption, "id">): boolean {
  return REQUIRED_CHOICE_OPTION_IDS.has(option.id);
}

export function isMultiMax2Option(option: Pick<MenuOption, "id">): boolean {
  return MULTI_MAX2_OPTION_IDS.has(option.id);
}

export function formatChoicePriceLabel(
  option: Pick<MenuOption, "price_modifier">,
  itemBasePrice: number
): string {
  const total = itemBasePrice + option.price_modifier;
  if (itemBasePrice === 0) {
    return option.price_modifier > 0 ? `$${option.price_modifier.toFixed(2)}` : "";
  }
  if (option.price_modifier === 0) return "";
  const sign = option.price_modifier > 0 ? "+" : "";
  return `(${sign}$${option.price_modifier.toFixed(2)} · $${total.toFixed(2)})`;
}
