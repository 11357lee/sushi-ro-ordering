import type {
  FeaturedItem,
  MenuData,
  MenuItem,
  MenuOption,
  MenuSection,
} from "@/types";
import {
  CATALOG_CATEGORIES,
  CATALOG_ITEMS,
  NIGIRI_MODIFIER_BY_ITEM_ID,
  SASHIMI_OPTION_ID,
} from "@/lib/data/menu-catalog";

const SECTIONS: MenuSection[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Menu",
    slug: "menu",
    sort_order: 1,
    accent_color: "#1a1a1a",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Gluten Free",
    slug: "gluten-free",
    sort_order: 2,
    accent_color: "#0d9488",
  },
];

const OPTIONS: MenuOption[] = [
  { id: "33333333-3333-3333-3333-333333333301", name: "Deep-fried", price_modifier: 1, sort_order: 1 },
  { id: "33333333-3333-3333-3333-333333333302", name: "Replace with Soy Sheet", price_modifier: 1, sort_order: 2 },
  { id: "33333333-3333-3333-3333-333333333303", name: "Spicy", price_modifier: 1.5, sort_order: 3 },
  { id: "33333333-3333-3333-3333-333333333401", name: "2 pcs Nigiri", price_modifier: 0, sort_order: 10 },
  { id: SASHIMI_OPTION_ID, name: "3 pcs Sashimi", price_modifier: 0, sort_order: 11 },
  { id: "33333333-3333-3333-3333-333333333501", name: "Chicken Teriyaki", price_modifier: 17, sort_order: 20 },
  { id: "33333333-3333-3333-3333-333333333502", name: "Beef Teriyaki", price_modifier: 18, sort_order: 21 },
  { id: "33333333-3333-3333-3333-333333333503", name: "Salmon Teriyaki", price_modifier: 17.5, sort_order: 22 },
  { id: "33333333-3333-3333-3333-333333333504", name: "Shrimp Teriyaki", price_modifier: 18, sort_order: 23 },
  { id: "33333333-3333-3333-3333-333333333505", name: "Chicken cutlet with spicy sauce", price_modifier: 17, sort_order: 24 },
  { id: "33333333-3333-3333-3333-333333333506", name: "Pork cutlet with spicy sauce", price_modifier: 17, sort_order: 25 },
  { id: "33333333-3333-3333-3333-333333333507", name: "Fish Cutlet with spicy sauce", price_modifier: 17.5, sort_order: 26 },
  { id: "33333333-3333-3333-3333-333333333508", name: "Unagi", price_modifier: 18.5, sort_order: 27 },
  { id: "33333333-3333-3333-3333-333333333509", name: "Grilled Mackerel", price_modifier: 19, sort_order: 28 },
  { id: "33333333-3333-3333-3333-333333333601", name: "Maki (3 California and 3 BBQ Salmon)", price_modifier: 0, sort_order: 30 },
  { id: "33333333-3333-3333-3333-333333333602", name: "Tempura (3 vegetables and 1 Shrimp)", price_modifier: 0, sort_order: 31 },
  { id: "33333333-3333-3333-3333-333333333603", name: "Vegetable Gyoza", price_modifier: 0, sort_order: 32 },
  { id: "33333333-3333-3333-3333-333333333604", name: "Vegetable Spring Roll", price_modifier: 0, sort_order: 33 },
];

const NIGIRI_OPTION_ID = "33333333-3333-3333-3333-333333333401";
const SOY_SHEET_OPTION_ID = "33333333-3333-3333-3333-333333333302";
const DEEP_FRIED_OPTION_ID = "33333333-3333-3333-3333-333333333301";
const SPICY_OPTION_ID = "33333333-3333-3333-3333-333333333303";
const BENTO_OPTION_IDS = [
  "33333333-3333-3333-3333-333333333501",
  "33333333-3333-3333-3333-333333333502",
  "33333333-3333-3333-3333-333333333503",
  "33333333-3333-3333-3333-333333333504",
  "33333333-3333-3333-3333-333333333505",
  "33333333-3333-3333-3333-333333333506",
  "33333333-3333-3333-3333-333333333507",
  "33333333-3333-3333-3333-333333333508",
  "33333333-3333-3333-3333-333333333509",
  "33333333-3333-3333-3333-333333333601",
  "33333333-3333-3333-3333-333333333602",
  "33333333-3333-3333-3333-333333333603",
  "33333333-3333-3333-3333-333333333604",
];

const OPTION_BY_ID = new Map(OPTIONS.map((option) => [option.id, option]));

function optionsByIds(ids: string[]): MenuOption[] {
  return ids.flatMap((id) => {
    const option = OPTION_BY_ID.get(id);
    return option ? [option] : [];
  });
}

function optionsForItem(item: MenuItem): MenuOption[] {
  const nigiriModifier = NIGIRI_MODIFIER_BY_ITEM_ID[item.id];
  if (nigiriModifier !== undefined) {
    return [
      { id: NIGIRI_OPTION_ID, name: "2 pcs Nigiri", price_modifier: nigiriModifier, sort_order: 10 },
      { id: SASHIMI_OPTION_ID, name: "3 pcs Sashimi", price_modifier: 0, sort_order: 11 },
    ];
  }
  if (item.id === "a1000001-0000-0000-0000-000000000016") return optionsByIds(BENTO_OPTION_IDS);
  if (item.id === "a1000001-0000-0000-0000-000000000007" || item.id === "a1000001-0000-0000-0000-00000000000b") {
    return optionsByIds([SPICY_OPTION_ID]);
  }
  if (!item.has_roll_options) return [];
  const rollOptionIds = [SOY_SHEET_OPTION_ID];
  if (item.id === "a1000001-0000-0000-0000-00000000000d") rollOptionIds.unshift(DEEP_FRIED_OPTION_ID);
  return optionsByIds(rollOptionIds);
}

const ITEMS_WITH_OPTIONS: MenuItem[] = CATALOG_ITEMS.map((item) => ({
  ...item,
  options: optionsForItem(item as MenuItem),
}));

const FEATURED: FeaturedItem[] = [
  { id: "f1", menu_item_id: "a1000001-0000-0000-0000-000000000010", sort_order: 1 },
  { id: "f2", menu_item_id: "a1000001-0000-0000-0000-000000000011", sort_order: 2 },
  { id: "f3", menu_item_id: "a1000001-0000-0000-0000-00000000000e", sort_order: 3 },
  { id: "f4", menu_item_id: "a1000001-0000-0000-0000-000000000014", sort_order: 4 },
  { id: "f5", menu_item_id: "a1000001-0000-0000-0000-000000000015", sort_order: 5 },
];

export function getMockMenuData(): MenuData {
  const sectionMap = new Map(SECTIONS.map((s) => [s.id, s]));
  const categoryMap = new Map(CATALOG_CATEGORIES.map((c) => [c.id, c]));
  const itemMap = new Map(ITEMS_WITH_OPTIONS.map((i) => [i.id, i]));

  const items = ITEMS_WITH_OPTIONS.map((item) => {
    const category = categoryMap.get(item.category_id);
    const section = category ? sectionMap.get(category.section_id) : undefined;
    return { ...item, category, section };
  });

  const featured = FEATURED.map((f) => ({
    ...f,
    menu_item: itemMap.get(f.menu_item_id),
  }));

  return {
    sections: SECTIONS,
    categories: CATALOG_CATEGORIES,
    items,
    featured,
    options: OPTIONS,
  };
}

import { RESTAURANT_PHONE, RESTAURANT_TIMEZONE } from "@/lib/constants";

export const MOCK_SETTINGS = {
  id: "settings-1",
  is_open: true,
  banner_image_url: null,
  closing_time: "21:00:00",
  timezone: RESTAURANT_TIMEZONE,
  business_email: "sushi-ro@sushi-ro.com",
  phone: RESTAURANT_PHONE,
  tax_rate: 0.13,
  pause_until: null,
  sold_out_item_ids: [],
  special_closed_dates: [],
};

export const MOCK_WAITING_TIME = {
  id: "wt-1",
  minutes: 15 as const,
  updated_at: new Date().toISOString(),
};
