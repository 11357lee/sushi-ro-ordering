import { addMinutes, format, parse, setHours, setMinutes, setSeconds } from "date-fns";
import type { CartItem, SelectedOption } from "@/types";

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

export function formatPickupTime(iso: string | null, timezone = "America/Vancouver"): string {
  if (!iso) return "As Soon As Possible";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function generatePickupSlots(
  closingTime = "20:45:00",
  timezone = "America/Vancouver"
): { value: string; label: string }[] {
  const now = new Date();
  const start = addMinutes(now, 60);
  const roundedMinutes = Math.ceil(start.getMinutes() / 15) * 15;
  let slot = setSeconds(setMinutes(setHours(start, start.getHours()), roundedMinutes), 0);

  const [closeHour, closeMinute] = closingTime.split(":").map(Number);
  const closeToday = setSeconds(
    setMinutes(setHours(now, closeHour), closeMinute),
    0
  );

  const slots: { value: string; label: string }[] = [
    { value: "asap", label: "As Soon As Possible" },
  ];

  while (slot <= closeToday) {
    slots.push({
      value: slot.toISOString(),
      label: format(slot, "h:mm a"),
    });
    slot = addMinutes(slot, 15);
  }

  return slots;
}

export function parseClosingTime(timeStr: string, ref = new Date()): Date {
  const [h, m, s] = timeStr.split(":").map(Number);
  return setSeconds(setMinutes(setHours(ref, h), m), s ?? 0);
}

export function isRestaurantOpen(
  isOpenFlag: boolean,
  closingTime: string,
  timezone = "America/Vancouver"
): boolean {
  if (!isOpenFlag) return false;
  const now = new Date();
  const close = parseClosingTime(closingTime, now);
  return now < close;
}

export function getWaitingTimeText(minutes: number): string {
  const map: Record<number, string> = {
    15: "Approx. 15 min wait",
    30: "Approx. 30 min wait",
    60: "Approx. 1 hour wait",
    120: "Approx. 2 hour wait",
  };
  return map[minutes] ?? `${minutes} min wait`;
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
