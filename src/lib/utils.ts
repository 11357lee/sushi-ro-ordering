import {
  addDays,
  addMinutes,
  format,
  isSunday,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import type { CartItem, Order, RestaurantSettings, SelectedOption, SpecialClosedPeriod } from "@/types";
import {
  BUSINESS_HOURS,
  ORDERING_DISABLED_END,
  ORDERING_DISABLED_START,
  RESTAURANT_TIMEZONE,
  TAX_RATE,
} from "@/lib/constants";

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function formatPhoneInput(value: string): string {
  const digits = normalizePhone(value).slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function toDisplayName(text: string): string {
  if (!text) return "";
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

/** Customer-facing menu titles: hide redundant (GF) when the gluten-free tag/section already shows it. */
export function toCustomerItemName(text: string): string {
  if (!text) return "";
  return toDisplayName(text)
    .replace(/\s*\(\s*gf\s*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
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

export function formatPickupTime(iso: string | null, timezone = RESTAURANT_TIMEZONE): string {
  if (!iso) return "As soon as possible";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function formatOrderDate(iso: string, timezone = RESTAURANT_TIMEZONE): string {
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

function restaurantWallClock(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
}

export function isWithinBusinessHours(now = new Date()): boolean {
  const localNow = restaurantWallClock(now);
  const hours = isSunday(localNow) ? BUSINESS_HOURS.sunday : BUSINESS_HOURS.weekday;
  const open = parseTimeOnDate(hours.open, localNow);
  const close = parseTimeOnDate(hours.close, localNow);
  return isWithinInterval(localNow, { start: open, end: close });
}

export function isPauseActive(pauseUntil: string | null | undefined): boolean {
  if (!pauseUntil) return false;
  return new Date(pauseUntil) > new Date();
}

export function normalizeSpecialClosedPeriods(
  raw: (string | SpecialClosedPeriod)[] | undefined
): SpecialClosedPeriod[] {
  if (!raw?.length) return [];
  return raw.map((entry) => {
    if (typeof entry === "string") return { start: entry, end: entry };
    return { start: entry.start, end: entry.end, message: entry.message };
  });
}

export function isDateInSpecialClosure(
  dateKey: string,
  periods: SpecialClosedPeriod[]
): boolean {
  return periods.some((period) => dateKey >= period.start && dateKey <= period.end);
}

export function getActiveSpecialClosure(
  settings: Pick<RestaurantSettings, "special_closed_dates">,
  now = new Date()
): SpecialClosedPeriod | null {
  const dateKey = restaurantCalendarDate(now);
  const periods = normalizeSpecialClosedPeriods(settings.special_closed_dates);
  return periods.find((period) => isDateInSpecialClosure(dateKey, [period])) ?? null;
}

export function formatSpecialClosureLabel(period: SpecialClosedPeriod): string {
  if (period.start === period.end) return period.start;
  return `${period.start} to ${period.end}`;
}

export function isRestaurantOpen(
  settings: Pick<
    RestaurantSettings,
    "pause_until" | "closing_time" | "timezone" | "special_closed_dates"
  >,
  now = new Date()
): boolean {
  if (isPauseActive(settings.pause_until)) return false;
  const dateKey = restaurantCalendarDate(now);
  const periods = normalizeSpecialClosedPeriods(settings.special_closed_dates);
  if (isDateInSpecialClosure(dateKey, periods)) return false;
  return isWithinBusinessHours(now);
}

export function isOrderingDisabled(now = new Date()): boolean {
  const localNow = restaurantWallClock(now);
  const start = parseTimeOnDate(ORDERING_DISABLED_START, localNow);
  const end = parseTimeOnDate(ORDERING_DISABLED_END, localNow);
  return localNow >= start || localNow < end;
}

export function generateScheduledPickupSlots(
  closingTime = "21:00:00",
  leadMinutes = 60
): { value: string; label: string }[] {
  return generateBusinessPickupSlots({ closingTime, leadMinutes });
}

export function generateBusinessPickupSlots({
  closingTime = "21:00:00",
  leadMinutes = 60,
  days = 3,
}: {
  closingTime?: string;
  leadMinutes?: number;
  days?: number;
} = {}): { value: string; label: string }[] {
  const now = new Date();
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);
  const slots: { value: string; label: string }[] = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const day = addDays(now, dayOffset);
    const hours = isSunday(day) ? BUSINESS_HOURS.sunday : BUSINESS_HOURS.weekday;
    const open = parseTimeOnDate(hours.open, day);
    const close = setSeconds(setMinutes(setHours(day, closeHour), closeMinute), 0);
    const earliest = dayOffset === 0 ? addMinutes(now, leadMinutes) : open;
    const start = earliest > open ? earliest : open;
    const roundedMinutes = Math.ceil(start.getMinutes() / 15) * 15;
    let slot = setSeconds(setMinutes(setHours(start, start.getHours()), roundedMinutes), 0);

    while (slot <= close) {
      slots.push({
        value: slot.toISOString(),
        label: `${dayOffset === 0 ? "Today" : format(slot, "EEE")} ${format(slot, "h:mm a")}`,
      });
      slot = addMinutes(slot, 15);
    }

    if (slots.length >= 24) break;
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
  if (order.cancel_window_expires_at) {
    return new Date(order.cancel_window_expires_at) > new Date();
  }
  if (waitingMinutes <= 60) return false;
  if (!order.pickup_time) return true;
  const pickup = new Date(order.pickup_time);
  const cutoff = addMinutes(new Date(), 30);
  return pickup > cutoff;
}

export function restaurantCalendarDate(value: string | Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function isOrderFromToday(iso: string): boolean {
  return restaurantCalendarDate(iso) === restaurantCalendarDate(new Date());
}

/** UTC instant for midnight at the start of the restaurant's local calendar day. */
export function restaurantStartOfToday(now = new Date()): Date {
  const today = restaurantCalendarDate(now);
  let t = now.getTime();
  while (restaurantCalendarDate(new Date(t)) === today) {
    t -= 60 * 60 * 1000;
  }
  while (restaurantCalendarDate(new Date(t)) !== today) {
    t += 60 * 1000;
  }
  return new Date(t);
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

/** Admin kitchen display order — regular items first, then gluten-free, grouped by category. */
const ADMIN_ITEM_CATEGORY_ORDER: Record<string, number> = {
  appetizer: 1,
  "appetizer-salad": 1,
  "gf-appetizer": 1,
  soup: 2,
  salad: 2,
  ramen: 3,
  "bento-box": 4,
  "sushi-pizza": 5,
  "nigiri-sashimi": 6,
  "gf-nigiri-sashimi": 6,
  "traditional-roll": 7,
  "gf-traditional-roll": 7,
  "vegetable-roll": 8,
  "gf-vegetable-roll": 8,
  "fusion-roll": 9,
  "gf-fusion-roll": 9,
  moriawase: 10,
  "moriawase-tray": 10,
  "gf-moriawase": 10,
  "drinks-extra": 11,
};

function adminCategorySortKey(
  categorySlug: string | undefined,
  isGlutenFree: boolean
): [number, number, string] {
  const order = ADMIN_ITEM_CATEGORY_ORDER[categorySlug ?? ""] ?? 99;
  return [isGlutenFree ? 1 : 0, order, categorySlug ?? "zzz"];
}

export function sortOrderItemsForAdmin(
  items: NonNullable<Order["order_items"]>,
  menuItemsById?: Map<string, { categorySlug: string }>
): NonNullable<Order["order_items"]> {
  return [...items].sort((a, b) => {
    const aIsGF = a.section_slug === "gluten-free";
    const bIsGF = b.section_slug === "gluten-free";
    const aCat = menuItemsById?.get(a.menu_item_id ?? "")?.categorySlug;
    const bCat = menuItemsById?.get(b.menu_item_id ?? "")?.categorySlug;
    const [aSection, aOrder, aSlug] = adminCategorySortKey(aCat, aIsGF);
    const [bSection, bOrder, bSlug] = adminCategorySortKey(bCat, bIsGF);
    if (aSection !== bSection) return aSection - bSection;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (aSlug !== bSlug) return aSlug.localeCompare(bSlug);
    return a.name.localeCompare(b.name);
  });
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
