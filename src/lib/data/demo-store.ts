import type { Order, OrderStatus } from "@/types";
import { isOrderFromToday } from "@/lib/utils";

const globalStore = globalThis as unknown as {
  demoOrders?: Map<string, Order>;
  demoOrderCounter?: number;
  demoWaitingMinutes?: number;
  demoPauseUntil?: string | null;
  demoSoldOutIds?: Set<string>;
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
    .filter(
      (o) =>
        o.customer?.phone === normalized &&
        isOrderFromToday(o.created_at) &&
        !o.admin_dismissed
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listDemoAdminOrders(): Order[] {
  return Array.from(getStore().orders.values())
    .filter((o) => !o.admin_dismissed)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function dismissAllDemoOrders(): void {
  for (const order of getStore().orders.values()) {
    order.admin_dismissed = true;
  }
}

export function updateDemoOrderStatus(
  id: string,
  status: OrderStatus,
  pickupTime?: string | null,
  statusReason?: string | null
): Order | undefined {
  const updates: Partial<Order> = {
    status,
    status_reason: statusReason,
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
  return globalStore.demoWaitingMinutes ?? 15;
}

export function setDemoWaitingTimeMinutes(minutes: number): void {
  globalStore.demoWaitingMinutes = minutes;
}

export function getDemoPauseUntil(): string | null {
  return globalStore.demoPauseUntil ?? null;
}

export function setDemoPauseUntil(until: string | null): void {
  globalStore.demoPauseUntil = until;
}

export function getDemoSoldOutIds(): string[] {
  if (!globalStore.demoSoldOutIds) globalStore.demoSoldOutIds = new Set();
  return Array.from(globalStore.demoSoldOutIds);
}

export function setDemoSoldOutIds(ids: string[]): void {
  globalStore.demoSoldOutIds = new Set(ids);
}

export function findDemoCustomer(firstName: string, phone: string) {
  const normalized = phone.replace(/\D/g, "");
  const orders = Array.from(getStore().orders.values()).filter(
    (o) =>
      o.customer?.phone === normalized &&
      o.customer.first_name.toLowerCase() === firstName.trim().toLowerCase()
  );
  if (!orders.length) return null;
  return orders[0].customer ?? null;
}
