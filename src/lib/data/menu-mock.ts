import type {
  Category,
  FeaturedItem,
  MenuData,
  MenuItem,
  MenuOption,
  MenuSection,
} from "@/types";

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
];

const CATEGORIES: Category[] = [
  { id: "c1000001-0000-0000-0000-000000000001", section_id: SECTIONS[0].id, name: "Nigiri & Sashimi", slug: "nigiri-sashimi", sort_order: 1 },
  { id: "c1000001-0000-0000-0000-000000000002", section_id: SECTIONS[0].id, name: "Vegetable Roll", slug: "vegetable-roll", sort_order: 2 },
  { id: "c1000001-0000-0000-0000-000000000003", section_id: SECTIONS[0].id, name: "Appetizer", slug: "appetizer", sort_order: 3 },
  { id: "c1000001-0000-0000-0000-000000000004", section_id: SECTIONS[0].id, name: "Sushi Pizza", slug: "sushi-pizza", sort_order: 4 },
  { id: "c1000001-0000-0000-0000-000000000005", section_id: SECTIONS[0].id, name: "Soup & Salad", slug: "soup-salad", sort_order: 5 },
  { id: "c1000001-0000-0000-0000-000000000006", section_id: SECTIONS[0].id, name: "Traditional Roll", slug: "traditional-roll", sort_order: 6 },
  { id: "c1000001-0000-0000-0000-000000000007", section_id: SECTIONS[0].id, name: "Fusion Roll", slug: "fusion-roll", sort_order: 7 },
  { id: "c1000001-0000-0000-0000-000000000008", section_id: SECTIONS[0].id, name: "Moriawase", slug: "moriawase", sort_order: 8 },
  { id: "c1000001-0000-0000-0000-000000000009", section_id: SECTIONS[0].id, name: "Ramen", slug: "ramen", sort_order: 9 },
  { id: "c1000001-0000-0000-0000-00000000000a", section_id: SECTIONS[0].id, name: "Bento Box", slug: "bento-box", sort_order: 10 },
  { id: "c1000001-0000-0000-0000-00000000000b", section_id: SECTIONS[0].id, name: "Dessert", slug: "dessert", sort_order: 11 },
  { id: "c1000001-0000-0000-0000-00000000000c", section_id: SECTIONS[0].id, name: "Tray", slug: "tray", sort_order: 12 },
  { id: "c2000001-0000-0000-0000-000000000001", section_id: SECTIONS[1].id, name: "Traditional Roll", slug: "gf-traditional-roll", sort_order: 1 },
  { id: "c2000001-0000-0000-0000-000000000002", section_id: SECTIONS[1].id, name: "Vegetable Roll", slug: "gf-vegetable-roll", sort_order: 2 },
  { id: "c2000001-0000-0000-0000-000000000003", section_id: SECTIONS[1].id, name: "Appetizer", slug: "gf-appetizer", sort_order: 3 },
  { id: "c2000001-0000-0000-0000-000000000004", section_id: SECTIONS[1].id, name: "Fusion Roll", slug: "gf-fusion-roll", sort_order: 4 },
  { id: "c2000001-0000-0000-0000-000000000005", section_id: SECTIONS[1].id, name: "Moriawase", slug: "gf-moriawase", sort_order: 5 },
];

const ITEMS: MenuItem[] = [
  { id: "a1000001-0000-0000-0000-000000000001", category_id: "c1000001-0000-0000-0000-000000000001", name: "EBI Nigiri / Sashimi", description: "Shrimp — 2 pc nigiri or 3 pc sashimi", price: 5.5, is_available: true, has_roll_options: false, sort_order: 1, labels: [{ id: "l1", name: "Popular", slug: "popular" }] },
  { id: "a1000001-0000-0000-0000-000000000002", category_id: "c1000001-0000-0000-0000-000000000001", name: "SAKE Nigiri / Sashimi", description: "Salmon — 2 pc nigiri or 3 pc sashimi", price: 7, is_available: true, has_roll_options: false, sort_order: 2 },
  { id: "a1000001-0000-0000-0000-000000000003", category_id: "c1000001-0000-0000-0000-000000000001", name: "MAGURO Nigiri / Sashimi", description: "Red Tuna — 2 pc nigiri or 3 pc sashimi", price: 7.5, is_available: true, has_roll_options: false, sort_order: 3 },
  { id: "a1000001-0000-0000-0000-000000000004", category_id: "c1000001-0000-0000-0000-000000000002", name: "KAPPA MAKI", description: "6 pcs — Cucumber", price: 6, is_available: true, has_roll_options: true, sort_order: 1, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a1000001-0000-0000-0000-000000000005", category_id: "c1000001-0000-0000-0000-000000000002", name: "AVOCADO MAKI", description: "6 pcs", price: 7.5, is_available: true, has_roll_options: true, sort_order: 2, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a1000001-0000-0000-0000-000000000006", category_id: "c1000001-0000-0000-0000-000000000002", name: "VEGETABLE DRAGON MAKI", description: "8 pcs — Sweet potato, cucumber, topped with avocado & grilled veggies", price: 14, is_available: true, has_roll_options: true, sort_order: 3, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a1000001-0000-0000-0000-000000000007", category_id: "c1000001-0000-0000-0000-000000000003", name: "EDAMAME", description: "Steamed soybeans", price: 7, is_available: true, has_roll_options: false, sort_order: 1, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a1000001-0000-0000-0000-000000000008", category_id: "c1000001-0000-0000-0000-000000000003", name: "AGEDASHI TOFU", description: "Deep-fried tofu in dashi broth", price: 8, is_available: true, has_roll_options: false, sort_order: 2 },
  { id: "a1000001-0000-0000-0000-000000000009", category_id: "c1000001-0000-0000-0000-000000000003", name: "SHRIMP TEMPURA", description: "5 pcs", price: 10, is_available: true, has_roll_options: false, sort_order: 3 },
  { id: "a1000001-0000-0000-0000-00000000000a", category_id: "c1000001-0000-0000-0000-000000000004", name: "SALMON PIZZA", description: "Crispy rice base with salmon", price: 12.5, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-00000000000b", category_id: "c1000001-0000-0000-0000-000000000005", name: "MISO SOUP", description: "Traditional miso soup", price: 3, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-00000000000c", category_id: "c1000001-0000-0000-0000-000000000005", name: "WAKAME SALAD", description: "Japanese seaweed salad", price: 7, is_available: true, has_roll_options: false, sort_order: 2 },
  { id: "a1000001-0000-0000-0000-00000000000d", category_id: "c1000001-0000-0000-0000-000000000006", name: "CALIFORNIA MAKI", description: "6 pcs — Crab, avocado, cucumber", price: 8.5, is_available: true, has_roll_options: true, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-00000000000e", category_id: "c1000001-0000-0000-0000-000000000006", name: "SPICY SALMON MAKI", description: "6 pcs — Salmon, avocado, spicy mayo", price: 9, is_available: true, has_roll_options: true, sort_order: 2, labels: [{ id: "l4", name: "Popular", slug: "popular" }] },
  { id: "a1000001-0000-0000-0000-00000000000f", category_id: "c1000001-0000-0000-0000-000000000006", name: "SPIDER MAKI", description: "8 pcs — Softshell crab, cucumber, avocado", price: 14, is_available: true, has_roll_options: true, sort_order: 3 },
  { id: "a1000001-0000-0000-0000-000000000010", category_id: "c1000001-0000-0000-0000-000000000007", name: "DRAGON ROLL", description: "Cucumber, avocado, shrimp + your topping choice", price: 13, is_available: true, has_roll_options: true, sort_order: 1, labels: [{ id: "l4", name: "Popular", slug: "popular" }] },
  { id: "a1000001-0000-0000-0000-000000000011", category_id: "c1000001-0000-0000-0000-000000000007", name: "ROCK'N ROLL", description: "Cucumber, avocado, lobster tail. Topped with fried ginger, green onion, garlic", price: 16.5, is_available: true, has_roll_options: true, sort_order: 2, labels: [{ id: "l4", name: "Popular", slug: "popular" }] },
  { id: "a1000001-0000-0000-0000-000000000012", category_id: "c1000001-0000-0000-0000-000000000007", name: "CLOUD NINE", description: "Avocado, cream cheese, asparagus. Topped with smoked salmon", price: 15.5, is_available: true, has_roll_options: true, sort_order: 3, labels: [{ id: "l3", name: "Cheese", slug: "cheese" }, { id: "l4", name: "Popular", slug: "popular" }] },
  { id: "a1000001-0000-0000-0000-000000000013", category_id: "c1000001-0000-0000-0000-000000000008", name: "SUSHI MORIAWASE", description: "Nigiri, sashimi, maki combo", price: 21, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-000000000014", category_id: "c1000001-0000-0000-0000-000000000008", name: "SUSHI-RO BOAT FOR 2", description: "14 maki, 10 nigiri, 10 sashimi", price: 65, is_available: true, has_roll_options: false, sort_order: 2 },
  { id: "a1000001-0000-0000-0000-000000000015", category_id: "c1000001-0000-0000-0000-000000000009", name: "TONKOTSU RAMEN", description: "Rich pork bone broth ramen", price: 17, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-000000000016", category_id: "c1000001-0000-0000-0000-00000000000a", name: "SALMON TERIYAKI BENTO", description: "Salmon teriyaki with rice and sides", price: 17.5, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a1000001-0000-0000-0000-000000000017", category_id: "c1000001-0000-0000-0000-00000000000b", name: "MATCHA TIRAMISU", description: "Green tea tiramisu", price: 5.5, is_available: true, has_roll_options: false, sort_order: 1 },
  { id: "a2000001-0000-0000-0000-000000000001", category_id: "c2000001-0000-0000-0000-000000000001", name: "SAKE OR TEKKA MAKI (GF)", description: "6 pcs — Salmon or Red Tuna (+$1 for tuna)", price: 7.5, is_available: true, has_roll_options: true, sort_order: 1 },
  { id: "a2000001-0000-0000-0000-000000000002", category_id: "c2000001-0000-0000-0000-000000000001", name: "SPICY SALMON MAKI (GF)", description: "6 pcs — Salmon, avocado, spicy mayo", price: 9, is_available: true, has_roll_options: true, sort_order: 2 },
  { id: "a2000001-0000-0000-0000-000000000003", category_id: "c2000001-0000-0000-0000-000000000002", name: "KAPPA MAKI (GF)", description: "6 pcs — Cucumber", price: 6, is_available: true, has_roll_options: true, sort_order: 1, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a2000001-0000-0000-0000-000000000004", category_id: "c2000001-0000-0000-0000-000000000003", name: "EDAMAME (GF)", description: "Steamed soybeans", price: 7, is_available: true, has_roll_options: false, sort_order: 1, labels: [{ id: "l2", name: "Vegetarian", slug: "vegetarian" }] },
  { id: "a2000001-0000-0000-0000-000000000005", category_id: "c2000001-0000-0000-0000-000000000004", name: "DRAGON WITH YOUR TOPPING (GF)", description: "Cucumber, avocado, shrimp + topping", price: 14, is_available: true, has_roll_options: true, sort_order: 1 },
  { id: "a2000001-0000-0000-0000-000000000006", category_id: "c2000001-0000-0000-0000-000000000004", name: "FUJI MOUNTAIN (GF)", description: "Cucumber, avocado, salmon, spicy mayo", price: 14, is_available: true, has_roll_options: true, sort_order: 2 },
  { id: "a2000001-0000-0000-0000-000000000007", category_id: "c2000001-0000-0000-0000-000000000005", name: "SUSHI MORIAWASE (GF)", description: "Nigiri, sashimi, maki combo", price: 21, is_available: true, has_roll_options: false, sort_order: 1 },
].map((item) => ({
  ...item,
  options: item.has_roll_options ? OPTIONS : [],
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
  const categoryMap = new Map(CATEGORIES.map((c) => [c.id, c]));
  const itemMap = new Map(ITEMS.map((i) => [i.id, i]));

  const items = ITEMS.map((item) => {
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
    categories: CATEGORIES,
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
