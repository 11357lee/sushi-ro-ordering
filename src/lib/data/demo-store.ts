import type { Order, OrderStatus } from "@/types";
import { isOrderFromToday, normalizePhone } from "@/lib/utils";
import { isPastAcceptWindow, MISS_STATUS_REASON } from "@/lib/order-accept-window";

const globalStore = globalThis as unknown as {
  demoOrders?: Map<string, Order>;
  demoOrderCounter?: number;
  demoWaitingMinutes?: number;
  demoPauseUntil?: string | null;
  demoSoldOutIds?: Set<string>;
  demoSpecialClosedDates?: { start: string; end: string; message?: string }[];
  demoTestMode?: boolean;
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
  const order = getStore().orders.get(id);
  if (!order) return undefined;
  return expireDemoOrderIfNeeded(order);
}

function expireDemoOrderIfNeeded(order: Order): Order {
  if (!isPastAcceptWindow(order)) return order;
  return (
    updateDemoOrder(order.id, {
      status: "missed",
      status_reason: MISS_STATUS_REASON,
    }) ?? order
  );
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
  const normalized = normalizePhone(phone);
  return Array.from(getStore().orders.values())
    .map(expireDemoOrderIfNeeded)
    .filter(
      (o) =>
        o.customer?.phone === normalized &&
        isOrderFromToday(o.created_at) &&
        !o.admin_dismissed
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listDemoOrdersByCustomerId(customerId: string): Order[] {
  return Array.from(getStore().orders.values())
    .map(expireDemoOrderIfNeeded)
    .filter((o) => o.customer_id === customerId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listDemoAdminOrders(): Order[] {
  return Array.from(getStore().orders.values())
    .map(expireDemoOrderIfNeeded)
    .filter((o) => {
      if (o.admin_dismissed) return false;
      if (isOrderFromToday(o.created_at)) return true;
      return o.status === "pending" || o.status === "accepted";
    })
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
  statusReason?: string | null,
  selectedPrepMinutes?: number
): Order | undefined {
  const updates: Partial<Order> = {
    status,
    status_reason: statusReason,
    updated_at: new Date().toISOString(),
  };
  if (status === "accepted") {
    updates.confirmed_at = new Date().toISOString();
    if (pickupTime) updates.pickup_time = pickupTime;

    const existing = getDemoOrder(id);
    const prepMinutes =
      selectedPrepMinutes ??
      (pickupTime
        ? Math.round((new Date(pickupTime).getTime() - Date.now()) / 60000)
        : getDemoWaitingTimeMinutes());
    if (existing?.pickup_type === "asap" && prepMinutes >= 60) {
      updates.cancel_window_expires_at = new Date(Date.now() + 120_000).toISOString();
    } else {
      updates.cancel_window_expires_at = null;
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

export function getDemoSpecialClosedDates(): { start: string; end: string; message?: string }[] {
  return globalStore.demoSpecialClosedDates ?? [];
}

export function setDemoSpecialClosedDates(
  periods: { start: string; end: string; message?: string }[]
): void {
  globalStore.demoSpecialClosedDates = periods;
}

export function getDemoTestMode(): boolean {
  return Boolean(globalStore.demoTestMode);
}

export function setDemoTestMode(enabled: boolean): void {
  globalStore.demoTestMode = enabled;
}

export function findDemoCustomer(firstName: string, phone: string) {
  const normalized = normalizePhone(phone);
  const name = firstName.trim().toLowerCase().replace(/\s+/g, "");
  const retained = Array.from(getStore().orders.values())
    .map((o) => o.customer)
    .filter((c): c is NonNullable<typeof c> => Boolean(c?.save_history && c.phone === normalized));

  const uniqueById = new Map(retained.map((c) => [c.id, c]));
  const customers = Array.from(uniqueById.values());
  if (!customers.length) return null;

  const exact = customers.find(
    (c) => c.first_name.trim().toLowerCase().replace(/\s+/g, "") === name
  );
  if (exact) return exact;

  if (customers.length === 1) {
    customers[0].first_name = firstName.trim();
    return customers[0];
  }
  return null;
}
