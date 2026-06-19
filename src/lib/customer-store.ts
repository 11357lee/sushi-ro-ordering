import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Customer } from "@/types";

interface CustomerState {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      clearCustomer: () => set({ customer: null }),
    }),
    {
      name: "sushi-ro-customer",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
