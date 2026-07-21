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

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customer: null,
      expiresAt: null,
      setCustomer: (customer) =>
        set({ customer, expiresAt: Date.now() + CUSTOMER_SESSION_TIMEOUT_MS }),
      refreshCustomer: (customer) =>
        set((state) => ({
          customer,
          expiresAt: state.expiresAt ?? Date.now() + CUSTOMER_SESSION_TIMEOUT_MS,
        })),
      clearCustomer: () => set({ customer: null, expiresAt: null }),
      clearExpiredCustomer: () => {
        const expiresAt = get().expiresAt;
        if (expiresAt && expiresAt <= Date.now()) {
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
