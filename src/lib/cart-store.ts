import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartExtras, CartItem, PickupType, SelectedOption } from "@/types";
import { CART_TIMEOUT_MS } from "@/lib/constants";
import { calcCartSubtotal, calcTax, calcTotal, cartItemKey } from "@/lib/utils";

const defaultExtras: CartExtras = {
  cutlery: false,
  cutleryQuantity: 1,
  extraWasabi: false,
  extraGinger: false,
  extraSoySauce: false,
  noWasabi: false,
  noGinger: false,
  noSoySauce: false,
  specialInstructions: "",
};

interface CartState {
  items: CartItem[];
  extras: CartExtras;
  pickupType: PickupType;
  pickupTime: string | null;
  updatedAt: number | null;
  addItem: (item: Omit<CartItem, "cartId">) => void;
  addItems: (items: Omit<CartItem, "cartId">[]) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  setExtras: (extras: Partial<CartExtras>) => void;
  setPickup: (pickupType: PickupType, pickupTime: string | null) => void;
  clearCart: () => void;
  clearExpiredCart: () => boolean;
  itemCount: () => number;
  subtotal: () => number;
  tax: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      extras: defaultExtras,
      pickupType: "asap",
      pickupTime: null,
      updatedAt: null,

      addItem: (item) => {
        const key = cartItemKey(
          item.menuItemId,
          item.selectedOptions,
          item.specialRequest
        );
        set((state) => {
          const existing = state.items.find((i) => i.cartId === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartId === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              updatedAt: Date.now(),
            };
          }
          return {
            items: [...state.items, { ...item, cartId: key }],
            updatedAt: Date.now(),
          };
        });
      },

      addItems: (items) => {
        items.forEach((item) => get().addItem(item));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity } : i
          ),
          updatedAt: Date.now(),
        }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
          updatedAt: Date.now(),
        }));
      },

      setExtras: (extras) => {
        set((state) => ({
          extras: { ...state.extras, ...extras },
          updatedAt: Date.now(),
        }));
      },

      setPickup: (pickupType, pickupTime) => {
        set({ pickupType, pickupTime, updatedAt: Date.now() });
      },

      clearCart: () =>
        set({
          items: [],
          extras: defaultExtras,
          pickupType: "asap",
          pickupTime: null,
          updatedAt: null,
        }),

      clearExpiredCart: () => {
        const updatedAt = get().updatedAt;
        if (updatedAt && Date.now() - updatedAt > CART_TIMEOUT_MS) {
          get().clearCart();
          return true;
        }
        return false;
      },

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () => calcCartSubtotal(get().items),

      tax: () => calcTax(get().subtotal()),

      total: () => calcTotal(get().subtotal()),
    }),
    { name: "sushi-ro-cart" }
  )
);

export function buildCartItemFromMenu(
  menuItemId: string,
  name: string,
  price: number,
  quantity: number,
  sectionSlug: string,
  sectionName: string,
  accentColor: string,
  selectedOptions: SelectedOption[],
  specialRequest: string
): Omit<CartItem, "cartId"> {
  return {
    menuItemId,
    name,
    price,
    quantity,
    sectionSlug,
    sectionName,
    accentColor,
    selectedOptions,
    specialRequest,
  };
}

export function toggleCondimentExtra(
  extras: CartExtras,
  key:
    | "extraWasabi"
    | "extraGinger"
    | "extraSoySauce"
    | "noWasabi"
    | "noGinger"
    | "noSoySauce"
): Partial<CartExtras> {
  const pairs: Record<string, string> = {
    extraWasabi: "noWasabi",
    noWasabi: "extraWasabi",
    extraGinger: "noGinger",
    noGinger: "extraGinger",
    extraSoySauce: "noSoySauce",
    noSoySauce: "extraSoySauce",
  };
  const opposite = pairs[key] as keyof CartExtras;
  const next = !extras[key];
  return {
    [key]: next,
    [opposite]: next ? false : extras[opposite as keyof CartExtras],
  } as Partial<CartExtras>;
}
