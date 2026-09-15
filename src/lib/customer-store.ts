import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CUSTOMER_SESSION_TIMEOUT_MS } from "@/lib/constants";
import type { Customer } from "@/types";

interface CustomerState {
  customer: Customer | null;
  expiresAt: number | null;
  setCustomer: (customer: Customer) => void;
  refreshCustomer: (customer: Customer) => void;
  clearCustomer: () => void;
  clearExpiredCustomer: () => boolean;
}

/** True only for retained accounts (privacy/terms accepted), not guest checkouts. */
export function isLoggedInCustomer(customer: Customer | null | undefined): boolean {
  return Boolean(customer?.id && customer.save_history);
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customer: null,
      expiresAt: null,
      setCustomer: (customer) =>
        set({
          customer: customer.save_history ? customer : null,
          expiresAt: customer.save_history ? Date.now() + CUSTOMER_SESSION_TIMEOUT_MS : null,
        }),
      refreshCustomer: (customer) =>
        set((state) => ({
          customer: customer.save_history ? customer : null,
          expiresAt: customer.save_history
            ? state.expiresAt ?? Date.now() + CUSTOMER_SESSION_TIMEOUT_MS
            : null,
        })),
      clearCustomer: () => set({ customer: null, expiresAt: null }),
      clearExpiredCustomer: () => {
        const { expiresAt, customer } = get();
        if ((expiresAt && expiresAt <= Date.now()) || (customer && !customer.save_history)) {
          set({ customer: null, expiresAt: null });
          return true;
        }
        return false;
      },
    }),
    {
      name: "sushi-ro-customer",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
