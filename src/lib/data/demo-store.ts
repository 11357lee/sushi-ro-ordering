import type { Order, OrderStatus } from "@/types";

const globalStore = globalThis as unknown as {
  demoOrders?: Map<string, Order>;
  demoOrderCounter?: number;
};

function getStore() {
  if (!globalStore.demoOrders) {
    globalStore.demoOrders = new Map();
    globalStore.demoOrderCounter = 1000;
  }
  return {
    orders: globalStore.demoOrders,
    counter: globalStore.demoOrderCounter!,
  };
}

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("your-project");
}

export function createDemoOrder(order: Order): Order {
  const store = getStore();
  globalStore.demoOrderCounter = store.counter + 1;
  const saved = { ...order, order_number: store.counter + 1 };
  store.orders.set(saved.id, saved);
  return saved;
}

export function getDemoOrder(id: string): Order | undefined {
  return getStore().orders.get(id);
}

export function updateDemoOrder(id: string, updates: Partial<Order>): Order | undefined {
  const store = getStore();
  const existing = store.orders.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  store.orders.set(id, updated);
  return updated;
}

export function listDemoOrdersByPhone(phone: string): Order[] {
  const normalized = phone.replace(/\D/g, "");
  return Array.from(getStore().orders.values())
    .filter((o) => o.customer?.phone === normalized)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listDemoPendingOrders(): Order[] {
  return Array.from(getStore().orders.values())
    .filter((o) => o.status === "pending" || o.status === "accepted")
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function updateDemoOrderStatus(id: string, status: OrderStatus, pickupTime?: string | null): Order | undefined {
  const updates: Partial<Order> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === "accepted") {
    updates.confirmed_at = new Date().toISOString();
    if (pickupTime) updates.pickup_time = pickupTime;

    const waitMinutes = getDemoWaitingTimeMinutes();
    if (waitMinutes > 60) {
      updates.cancel_window_expires_at = new Date(Date.now() + 60_000).toISOString();
    }
  }
  return updateDemoOrder(id, updates);
}

export function getDemoWaitingTimeMinutes(): number {
  return (globalThis as unknown as { demoWaitingMinutes?: number }).demoWaitingMinutes ?? 15;
}

export function setDemoWaitingTimeMinutes(minutes: number): void {
  (globalThis as unknown as { demoWaitingMinutes?: number }).demoWaitingMinutes = minutes;
}

export function getDemoIsOpen(): boolean {
  return (globalThis as unknown as { demoIsOpen?: boolean }).demoIsOpen ?? true;
}

export function setDemoIsOpen(isOpen: boolean): void {
  (globalThis as unknown as { demoIsOpen?: boolean }).demoIsOpen = isOpen;
}
