import {
  addMinutes,
  format,
  isSunday,
  isToday,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import type { CartItem, Order, RestaurantSettings, SelectedOption } from "@/types";
import { BUSINESS_HOURS, TAX_RATE } from "@/lib/constants";

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toDisplayName(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      if (word.includes("'")) {
        const parts = word.split("'");
        return parts
          .map((p, i) =>
            i === 0
              ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
              : p.toLowerCase()
          )
          .join("'");
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function calcLineTotal(
  price: number,
  quantity: number,
  options: SelectedOption[]
): number {
  const optionTotal = options.reduce((sum, o) => sum + o.price_modifier, 0);
  return (price + optionTotal) * quantity;
}

export function calcCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum + calcLineTotal(item.price, item.quantity, item.selectedOptions),
    0
  );
}

export function calcTax(subtotal: number, rate = TAX_RATE): number {
  return Math.round(subtotal * rate * 100) / 100;
}

export function calcTotal(subtotal: number, rate = TAX_RATE): number {
  return Math.round((subtotal + calcTax(subtotal, rate)) * 100) / 100;
}

export function formatPickupTime(iso: string | null, timezone = "America/Vancouver"): string {
  if (!iso) return "As soon as possible";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function formatOrderDate(iso: string, timezone = "America/Vancouver"): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

function parseTimeOnDate(timeStr: string, ref: Date): Date {
  const [h, m] = timeStr.split(":").map(Number);
  return setSeconds(setMinutes(setHours(ref, h), m), 0);
}

export function isWithinBusinessHours(now = new Date()): boolean {
  const hours = isSunday(now) ? BUSINESS_HOURS.sunday : BUSINESS_HOURS.weekday;
  const open = parseTimeOnDate(hours.open, now);
  const close = parseTimeOnDate(hours.close, now);
  return isWithinInterval(now, { start: open, end: close });
}

export function isPauseActive(pauseUntil: string | null | undefined): boolean {
  if (!pauseUntil) return false;
  return new Date(pauseUntil) > new Date();
}

export function isRestaurantOpen(
  settings: Pick<RestaurantSettings, "pause_until" | "closing_time" | "timezone">,
  now = new Date()
): boolean {
  if (isPauseActive(settings.pause_until)) return false;
  return isWithinBusinessHours(now);
}

export function generateScheduledPickupSlots(
  closingTime = "21:00:00",
  leadMinutes = 60
): { value: string; label: string }[] {
  const now = new Date();
  const start = addMinutes(now, leadMinutes);
  const roundedMinutes = Math.ceil(start.getMinutes() / 15) * 15;
  let slot = setSeconds(setMinutes(setHours(start, start.getHours()), roundedMinutes), 0);

  const [closeHour, closeMinute] = closingTime.split(":").map(Number);
  const closeToday = setSeconds(setMinutes(setHours(now, closeHour), closeMinute), 0);

  const slots: { value: string; label: string }[] = [];

  while (slot <= closeToday) {
    slots.push({
      value: slot.toISOString(),
      label: format(slot, "h:mm a"),
    });
    slot = addMinutes(slot, 15);
  }

  return slots;
}

export const generatePickupSlots = generateScheduledPickupSlots;

export function getWaitingTimeText(minutes: number): string {
  const map: Record<number, string> = {
    15: "Approx. 15 min wait",
    30: "Approx. 30 min wait",
    60: "Approx. 1 hour wait",
    120: "Approx. 2 hour wait",
  };
  return map[minutes] ?? `${minutes} min wait`;
}

export function canCustomerCancelOrder(
  order: Order,
  waitingMinutes: number
): boolean {
  if (order.status !== "accepted" && order.status !== "pending") return false;
  if (waitingMinutes <= 60) return false;
  if (!order.pickup_time) return true;
  const pickup = new Date(order.pickup_time);
  const cutoff = addMinutes(new Date(), 30);
  return pickup > cutoff;
}

export function isOrderFromToday(iso: string): boolean {
  return isToday(new Date(iso));
}

export function cartItemKey(
  menuItemId: string,
  options: SelectedOption[],
  specialRequest: string
): string {
  const optKey = options
    .map((o) => o.id)
    .sort()
    .join("-");
  return `${menuItemId}:${optKey}:${specialRequest.trim()}`;
}

export function orderItemsToCartItems(
  orderItems: Order["order_items"]
): Omit<import("@/types").CartItem, "cartId">[] {
  if (!orderItems) return [];
  return orderItems.map((item) => ({
    menuItemId: item.menu_item_id ?? item.id,
    name: item.name,
    price: item.unit_price,
    quantity: item.quantity,
    sectionSlug: item.section_slug,
    sectionName: item.section_slug === "gluten-free" ? "Gluten Free" : "Menu",
    accentColor: item.section_slug === "gluten-free" ? "#0d9488" : "#1a1a1a",
    selectedOptions: item.selected_options ?? [],
    specialRequest: item.special_request ?? "",
  }));
}
