export const TAX_RATE = 0.13;

export const RESTAURANT_PHONE = "+1 (613) 724-6088";
export const RESTAURANT_PHONE_LINK = "+16137246088";

export const BUSINESS_HOURS = {
  weekday: { open: "11:30", close: "21:00" },
  sunday: { open: "12:00", close: "21:00" },
} as const;

export const RESTAURANT_TIMEZONE = "America/Toronto";
export const ORDERING_DISABLED_START = "20:45";
export const ORDERING_DISABLED_END = "06:00";

export const CATEGORY_DESCRIPTION_FALLBACKS: Record<string, string> = {
  ramen: "Warm noodle bowls served with rich broth and fresh toppings.",
  "sushi-pizza": "Crispy rice base topped with fresh seafood and house sauces.",
  "fusion-roll": "Creative specialty rolls with Sushi-Ro's signature combinations.",
  tray: "Shareable sushi trays for groups, parties, and family meals.",
  moriawase: "Chef-selected assortments of sushi, sashimi, and rolls.",
  "bento-box": "Complete meal boxes served with your choice of side.",
  "nigiri-sashimi": "Classic nigiri and sashimi prepared fresh to order.",
};
