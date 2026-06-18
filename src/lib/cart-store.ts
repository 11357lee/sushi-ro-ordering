import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartExtras, CartItem, SelectedOption } from "@/types";
import { calcCartSubtotal, cartItemKey } from "@/lib/utils";

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
  addItem: (item: Omit<CartItem, "cartId">) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  setExtras: (extras: Partial<CartExtras>) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      extras: defaultExtras,

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
            };
          }
          return {
            items: [...state.items, { ...item, cartId: key }],
          };
        });
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
        }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        }));
      },

      setExtras: (extras) => {
        set((state) => ({
          extras: { ...state.extras, ...extras },
        }));
      },

      clearCart: () => set({ items: [], extras: defaultExtras }),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () => calcCartSubtotal(get().items),
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
