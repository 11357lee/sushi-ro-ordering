import { ORDER_ACCEPT_WINDOW_MS } from "@/lib/constants";
import type { Order } from "@/types";

export const MISS_STATUS_REASON = "Not accepted in time";

/** ASAP pending orders expire after ORDER_ACCEPT_WINDOW_MS. */
export function isPastAcceptWindow(order: Pick<Order, "status" | "pickup_type" | "created_at">): boolean {
  if (order.status !== "pending") return false;
  if (order.pickup_type !== "asap") return false;
  const created = new Date(order.created_at).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created >= ORDER_ACCEPT_WINDOW_MS;
}

export function acceptSecondsRemaining(
  order: Pick<Order, "status" | "pickup_type" | "created_at">
): number | null {
  if (order.status !== "pending" || order.pickup_type !== "asap") return null;
  const created = new Date(order.created_at).getTime();
  if (Number.isNaN(created)) return null;
  return Math.max(0, Math.ceil((created + ORDER_ACCEPT_WINDOW_MS - Date.now()) / 1000));
}
