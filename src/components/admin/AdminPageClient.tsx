"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { addMinutes } from "date-fns";
import type { MenuData, MenuItem, Order, SpecialClosedPeriod } from "@/types";
import {
  formatPhoneDisplay,
  formatOrderDate,
  formatPickupTime,
  formatPrice,
  formatSpecialClosureLabel,
  isPauseActive,
  isRestaurantOpen,
  isWithinBusinessHours,
  normalizeSpecialClosedPeriods,
  restaurantCalendarDate,
  sortOrderItemsForAdmin,
  toDisplayName,
} from "@/lib/utils";

type AdminTab = "orders" | "settings";
type NotificationSound = "classic" | "high" | "soft" | "double" | "order";

const NOTIFICATION_SOUNDS: Record<
  NotificationSound,
  { label: string; frequencies: number[]; type: OscillatorType }
> = {
  classic: { label: "Classic beep", frequencies: [880], type: "square" },
  high: { label: "High chime", frequencies: [1046, 1318], type: "triangle" },
  soft: { label: "Soft bell", frequencies: [660, 880], type: "sine" },
  double: { label: "Double beep", frequencies: [780, 780], type: "square" },
  order: { label: "Order chime", frequencies: [659, 784, 988, 784], type: "triangle" },
};
const CUSTOMER_CANCELLED_REASON = "Customer cancelled online";
const PREP_MINUTE_OPTIONS = [
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "60",
  "90",
  "120",
];
const STORE_WAIT_MINUTES = [15, 30, 60, 120] as const;
const STORE_WAIT_LABELS: Record<(typeof STORE_WAIT_MINUTES)[number], string> = {
  15: "15m",
  30: "30m",
  60: "1h",
  120: "2h",
};
const CANCEL_ALERT_STORAGE_KEY = "sushi-ro-admin-cancel-alerts";
const REMEMBER_DEVICE_KEY = "sushi-ro-admin-remembered-key";
const SOUND_VOLUME = 0.32;
const SOUND_TONE_MS = 0.32;

type AdminAuthFailure = "empty" | "invalid" | "network";
type AdminAuthResult = { ok: true } | { ok: false; reason: AdminAuthFailure };

function normalizeAdminKey(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

function adminAuthErrorMessage(reason: AdminAuthFailure, savedDevice = false): string {
  if (reason === "network") {
    return "Cannot reach the server. Check your Wi-Fi connection and try again.";
  }
  if (reason === "empty") {
    return "Enter your admin API key.";
  }
  return savedDevice
    ? "Saved iPad login no longer works. Enter your admin key again."
    : "Incorrect admin key.";
}

function loadCancelAlertedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(CANCEL_ALERT_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistCancelAlertedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CANCEL_ALERT_STORAGE_KEY, JSON.stringify([...ids]));
}

function initialNotificationSound(key: string, fallback: NotificationSound): NotificationSound {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key) as NotificationSound | null;
  return saved && NOTIFICATION_SOUNDS[saved] ? saved : fallback;
}

function statusLabel(status: Order["status"]): string {
  if (status === "pending") return "New";
  if (status === "accepted") return "Accepted";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";
  return "Completed";
}

function customerTitle(order: Order): string {
  const first = order.customer?.first_name ? toDisplayName(order.customer.first_name) : "Guest";
  const last = order.customer?.last_name ? toDisplayName(order.customer.last_name) : "";
  return `${first}${last ? ` ${last}` : ""}`.trim();
}

function formatCountdown(pickupTime: string | null, now: Date): string | null {
  if (!pickupTime) return null;
  const diffMs = new Date(pickupTime).getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const totalSeconds = Math.ceil(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function acceptPickupDetails(
  order: Order,
  pickupInputs: Record<string, string>,
  waitingMinutes: number
): { pickupTime: string; prepMinutes: number } {
  if (order.pickup_type === "scheduled" && order.pickup_time) {
    return { pickupTime: order.pickup_time, prepMinutes: 0 };
  }
  const prepMinutes = Math.max(
    1,
    Number(pickupInputs[order.id] ?? waitingMinutes) || waitingMinutes
  );
  return { pickupTime: pickupIsoFromPrepMinutes(String(prepMinutes)), prepMinutes };
}

function pickupIsoFromPrepMinutes(minutes: string): string {
  const prepMinutes = Math.max(1, Number(minutes) || 15);
  return addMinutes(new Date(), prepMinutes).toISOString();
}

function OrderExtras({ order }: { order: Order }) {
  const extras: string[] = [];
  extras.push(order.cutlery ? `Cutlery x${order.cutlery_quantity}` : "No cutlery");
  if (order.extra_wasabi) extras.push("Extra wasabi");
  if (order.extra_ginger) extras.push("Extra ginger");
  if (order.extra_soy_sauce) extras.push("Extra soy sauce");
  if (order.no_wasabi) extras.push("No wasabi");
  if (order.no_ginger) extras.push("No ginger");
  if (order.no_soy_sauce) extras.push("No soy sauce");

  if (!extras.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5 text-sm">
      {extras.map((line) => (
        <li
          key={line}
          className="rounded-full border border-brand/40 bg-brand-paper px-2.5 py-1 font-medium text-brand-ink"
        >
          {line}
        </li>
      ))}
    </ul>
  );
}

function SpecialNotes({ order }: { order: Order }) {
  const notes = [order.allergy_notes, order.special_instructions].filter(Boolean);
  if (!notes.length) return null;

  return (
    <div className="my-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
      {notes.join(" · ")}
    </div>
  );
}

function OrderItems({
  order,
  menuItemsById,
}: {
  order: Order;
  menuItemsById: Map<string, { categorySlug: string }>;
}) {
  const items = sortOrderItemsForAdmin(order.order_items ?? [], menuItemsById);
  const rows = items.map((item, index) => {
    const isGF = item.section_slug === "gluten-free";
    const prev = index > 0 ? items[index - 1] : null;
    const prevIsGF = prev?.section_slug === "gluten-free";
    return {
      item,
      isGF,
      showDivider: prev !== null && prevIsGF !== isGF,
    };
  });

  return (
    <ul className="divide-y divide-[#eadfc4] text-base">
      {rows.map(({ item, isGF, showDivider }) => (
        <li key={item.id}>
          {showDivider && <div className="my-2 border-t border-[#eadfc4]" />}
          <div className={isGF ? "rounded-md bg-[#f3eef8] px-1.5 py-2 text-purple-950" : "px-1.5 py-2"}>
            <span className="font-bold text-brand-ink">
              {item.quantity}x {toDisplayName(item.name)}
            </span>
            {isGF && (
              <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide text-purple-800">
                GF
              </span>
            )}
            {item.selected_options?.length > 0 && (
              <p className="text-sm font-medium text-stone-600">
                {item.selected_options.map((o) => toDisplayName(o.name)).join(", ")}
              </p>
            )}
            {item.special_request && (
              <p className="text-sm italic text-red-700">{item.special_request}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AdminPageClient() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [waitingMinutes, setWaitingMinutes] = useState(15);
  const [soldOutIds, setSoldOutIds] = useState<string[]>([]);
  const [pauseUntil, setPauseUntil] = useState<string | null>(null);
  const [specialClosedPeriods, setSpecialClosedPeriods] = useState<SpecialClosedPeriod[]>([]);
  const [closedStartDate, setClosedStartDate] = useState("");
  const [closedEndDate, setClosedEndDate] = useState("");
  const [closedMessage, setClosedMessage] = useState("");
  const [closingTime, setClosingTime] = useState("21:00:00");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pickupInputs, setPickupInputs] = useState<Record<string, string>>({});
  const [reasonInputs, setReasonInputs] = useState<Record<string, string>>({});
  const [customReasonInputs, setCustomReasonInputs] = useState<Record<string, string>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const cancellationAlertedIdsRef = useRef<Set<string>>(new Set());
  const cancellationAlertsReadyRef = useRef(false);
  const ordersReadyRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const [expandedSoldOutCategory, setExpandedSoldOutCategory] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [asapSound, setAsapSound] = useState<NotificationSound>(() =>
    initialNotificationSound("sushi-ro-admin-asap-sound", "order")
  );
  const [scheduledSound, setScheduledSound] = useState<NotificationSound>(() =>
    initialNotificationSound("sushi-ro-admin-scheduled-sound", "soft")
  );
  const [cancelOpen, setCancelOpen] = useState(false);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      "x-admin-key": apiKey,
    }),
    [apiKey]
  );

  const authenticateWithKey = useCallback(async (key: string): Promise<AdminAuthResult> => {
    const trimmed = normalizeAdminKey(key);
    if (!trimmed) return { ok: false, reason: "empty" };
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-key": trimmed } });
      if (res.status === 401) return { ok: false, reason: "invalid" };
      if (!res.ok) return { ok: false, reason: "network" };
      const data = await res.json();
      setApiKey(trimmed);
      setOrders(
        (data.orders ?? []).sort(
          (a: Order, b: Order) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      ordersReadyRef.current = true;
      setAuthenticated(true);
      setLoginError("");
      return { ok: true };
    } catch {
      return { ok: false, reason: "network" };
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!apiKey) return;
    const res = await fetch("/api/admin", { headers: { "x-admin-key": apiKey } });
    if (res.ok) {
      const data = await res.json();
      setOrders(
        (data.orders ?? []).sort(
          (a: Order, b: Order) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      ordersReadyRef.current = true;
      setAuthenticated(true);
    }
  }, [apiKey]);

  useEffect(() => {
    document.documentElement.setAttribute("data-admin-hydrated", "1");
    const warning = document.getElementById("admin-compat-warning");
    if (warning) {
      warning.style.display = "none";
      warning.classList.add("hidden");
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_DEVICE_KEY)?.trim();
    if (!saved) return;

    queueMicrotask(() => {
      setRememberDevice(true);
      setApiKey(saved);
      setLoading(true);
    });

    const timer = window.setTimeout(() => {
      void authenticateWithKey(saved)
        .then((result) => {
          if (result.ok) return;
          if (result.reason === "invalid") {
            window.localStorage.removeItem(REMEMBER_DEVICE_KEY);
            setRememberDevice(false);
            setApiKey("");
          }
          setLoginError(adminAuthErrorMessage(result.reason, result.reason === "invalid"));
        })
        .finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [authenticateWithKey]);
  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setWaitingMinutes(data.waitingTime?.minutes ?? 15);
    setSoldOutIds(data.settings?.sold_out_item_ids ?? []);
    setPauseUntil(data.settings?.pause_until ?? null);
    const today = restaurantCalendarDate();
    const periods = normalizeSpecialClosedPeriods(data.settings?.special_closed_dates).filter(
      (period) => period.end >= today
    );
    setSpecialClosedPeriods(periods);
    // Persist purge of past dates when any remain in storage
    const rawCount = normalizeSpecialClosedPeriods(data.settings?.special_closed_dates).length;
    if (rawCount > periods.length) {
      void fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": apiKey,
        },
        body: JSON.stringify({
          action: "update_special_closed_dates",
          specialClosedDates: periods,
        }),
      });
    }
    setClosingTime(data.settings?.closing_time ?? "21:00:00");
  }, [apiKey]);

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) {
      setMenu(await res.json());
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const loadAdminData = async () => {
      await Promise.all([fetchOrders(), fetchSettings(), fetchMenu()]);
    };

    void loadAdminData();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [authenticated, fetchOrders, fetchSettings, fetchMenu]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateAsapSound = (value: NotificationSound) => {
    setAsapSound(value);
    window.localStorage.setItem("sushi-ro-admin-asap-sound", value);
  };

  const updateScheduledSound = (value: NotificationSound) => {
    setScheduledSound(value);
    window.localStorage.setItem("sushi-ro-admin-scheduled-sound", value);
  };

  const playNotificationSound = useCallback(
    (kind: "asap" | "scheduled" | "customer-cancelled") => {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      void ctx.resume().then(() => setSoundUnlocked(true));
      const sound =
        kind === "customer-cancelled"
          ? { frequencies: [988, 740, 554], type: "sawtooth" as OscillatorType }
          : NOTIFICATION_SOUNDS[kind === "asap" ? asapSound : scheduledSound];

      const startTone = (frequency: number, offset: number) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.frequency.value = frequency;
        oscillator.type = sound.type;
        const startAt = ctx.currentTime + offset;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(SOUND_VOLUME, startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + SOUND_TONE_MS);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + SOUND_TONE_MS + 0.02);
      };

      sound.frequencies.forEach((frequency, index) => startTone(frequency, index * 0.18));
    },
    [asapSound, scheduledSound]
  );

  const unlockAudio = useCallback(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      setSoundUnlocked(true);
      return;
    }
    if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
    void audioContextRef.current.resume().then(() => {
      setSoundUnlocked(true);
      setSoundEnabled(true);
    });
  }, []);

  const enableSound = () => {
    setSoundEnabled(true);
    unlockAudio();
    playNotificationSound("asap");
  };

  useEffect(() => {
    if (!authenticated || soundUnlocked) return;

    const unlockOnGesture = () => {
      unlockAudio();
    };

    window.addEventListener("pointerdown", unlockOnGesture, { once: true });
    window.addEventListener("touchstart", unlockOnGesture, { once: true, passive: true });
    window.addEventListener("keydown", unlockOnGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("keydown", unlockOnGesture);
    };
  }, [authenticated, soundUnlocked, unlockAudio]);

  useEffect(() => {
    queueMicrotask(() => {
      setPickupInputs((prev) => {
        const next = { ...prev };
        orders.forEach((order) => {
          if (!next[order.id]) {
            next[order.id] = String(waitingMinutes);
          }
        });
        return next;
      });
    });
  }, [orders, waitingMinutes]);

  const handleLogin = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (loading) return;
    setLoading(true);
    setLoginError("");
    ordersReadyRef.current = false;
    cancellationAlertsReadyRef.current = false;
    // Unlock audio during this tap so order alerts work without a second touch.
    unlockAudio();
    const normalizedKey = normalizeAdminKey(apiKey);
    setApiKey(normalizedKey);
    const result = await authenticateWithKey(normalizedKey);
    if (!result.ok) {
      setLoginError(adminAuthErrorMessage(result.reason));
      setLoading(false);
      return;
    }
    if (rememberDevice) {
      window.localStorage.setItem(REMEMBER_DEVICE_KEY, normalizedKey);
    } else {
      window.localStorage.removeItem(REMEMBER_DEVICE_KEY);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setOrders([]);
    ordersReadyRef.current = false;
    cancellationAlertsReadyRef.current = false;
    setApiKey("");
    setSoundUnlocked(false);
    setRememberDevice(false);
    window.localStorage.removeItem(REMEMBER_DEVICE_KEY);
  };

  const updateOrder = async (
    orderId: string,
    status: string,
    pickupTime?: string,
    statusReason?: string,
    prepMinutes?: number
  ) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({
        action: "update_order",
        orderId,
        status,
        pickupTime,
        prepMinutes,
        statusReason,
      }),
    });
    setCancelOpen(false);
    fetchOrders();
  };

  const updateWaitingTime = async (minutes: number) => {
    if (!restaurantOpen) return;
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_waiting_time", waitingMinutes: minutes }),
    });
    setWaitingMinutes(minutes);
  };

  const dismissOrders = async () => {
    if (!confirm("Clear all orders from the screen? They remain in the database.")) return;
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "dismiss_orders" }),
    });
    fetchOrders();
  };

  const pauseService = async (pauseDuration: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "pause_service", pauseDuration, closingTime }),
    });
    fetchSettings();
    setSettingsMessage("Pause updated.");
  };

  const toggleSoldOut = async (itemId: string) => {
    const next = soldOutIds.includes(itemId)
      ? soldOutIds.filter((id) => id !== itemId)
      : [...soldOutIds, itemId];

    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_sold_out", soldOutItemIds: next }),
    });
    setSoldOutIds(next);
  };

  const updateSpecialClosedPeriods = async (periods: SpecialClosedPeriod[]) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ action: "update_special_closed_dates", specialClosedDates: periods }),
    });
    setSpecialClosedPeriods(periods);
  };

  const menuItemsByCategory = useMemo(() => {
    if (!menu) return [];
    return menu.categories.map((category) => {
      const section = menu.sections.find((s) => s.id === category.section_id);
      return {
        category,
        section,
        items: menu.items.filter((item) => item.category_id === category.id),
      };
    });
  }, [menu]);

  const menuItemsById = useMemo(() => {
    const map = new Map<string, { categorySlug: string }>();
    if (!menu) return map;
    for (const item of menu.items) {
      const category = menu.categories.find((c) => c.id === item.category_id);
      map.set(item.id, { categorySlug: category?.slug ?? "other" });
    }
    return map;
  }, [menu]);

  const restaurantOpen = isRestaurantOpen({
    pause_until: pauseUntil,
    closing_time: closingTime,
    timezone: "America/Toronto",
    special_closed_dates: specialClosedPeriods,
  });
  const paused = isPauseActive(pauseUntil);
  const withinBusinessHours = isWithinBusinessHours();
  const queuedOrders = useMemo(() => {
    const rank = (status: Order["status"]) =>
      status === "pending" ? 0 : status === "accepted" ? 1 : 2;
    return [...orders].sort((a, b) => {
      const rankDiff = rank(a.status) - rank(b.status);
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [orders]);
  const selectedOrder =
    queuedOrders.find((order) => order.id === selectedOrderId) ??
    queuedOrders.find((order) => order.status === "pending") ??
    queuedOrders[0] ??
    null;
  const selectedCountdown =
    selectedOrder?.status === "accepted"
      ? formatCountdown(selectedOrder.pickup_time ?? null, now)
      : null;

  useEffect(() => {
    if (!authenticated) {
      cancellationAlertsReadyRef.current = false;
      ordersReadyRef.current = false;
      return;
    }

    if (!ordersReadyRef.current) return;

    const customerCancelledOrders = orders.filter(
      (order) =>
        order.status === "cancelled" &&
        order.status_reason === CUSTOMER_CANCELLED_REASON
    );
    const customerCancelledIds = customerCancelledOrders.map((order) => order.id);

    if (!cancellationAlertsReadyRef.current) {
      loadCancelAlertedIds().forEach((id) => cancellationAlertedIdsRef.current.add(id));
      customerCancelledIds.forEach((id) => cancellationAlertedIdsRef.current.add(id));
      persistCancelAlertedIds(cancellationAlertedIdsRef.current);
      cancellationAlertsReadyRef.current = true;
    } else {
      const newCustomerCancelledIds = customerCancelledIds.filter(
        (id) => !cancellationAlertedIdsRef.current.has(id)
      );
      if (newCustomerCancelledIds.length > 0) {
        newCustomerCancelledIds.forEach((id) => cancellationAlertedIdsRef.current.add(id));
        persistCancelAlertedIds(cancellationAlertedIdsRef.current);
        if (soundEnabled && soundUnlocked) playNotificationSound("customer-cancelled");
      }
    }

    if (!soundEnabled || !soundUnlocked) return;

    const pendingOrders = restaurantOpen
      ? orders.filter((order) => order.status === "pending")
      : [];
    if (!pendingOrders.length) return;

    const playTone = () => {
      const hasAsap = pendingOrders.some((order) => order.pickup_type === "asap");
      playNotificationSound(hasAsap ? "asap" : "scheduled");
    };

    playTone();
    const interval = setInterval(playTone, 5000);
    return () => clearInterval(interval);
  }, [
    authenticated,
    orders,
    restaurantOpen,
    soundEnabled,
    soundUnlocked,
    playNotificationSound,
  ]);

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <Image
            src="/sushi-ro-mark.png"
            alt="Sushi-Ro"
            width={80}
            height={76}
            className="mx-auto h-20 w-20 rounded-2xl bg-brand-ink object-contain p-2"
          />
          <h1 className="mt-4 text-2xl font-bold text-brand-ink">Sushi-Ro Admin</h1>
          <p className="mt-2 text-sm text-stone-600">Pickup orders. Pay in store.</p>
        </div>
        <form method="post" action="#" onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input
              type={showApiKey ? "text" : "password"}
              name="admin-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleLogin(e);
                }
              }}
              placeholder="Admin API key"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              className="w-full rounded-lg border border-[#eadfc4] bg-white px-3 py-2.5 text-base"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((current) => !current)}
              className="text-sm font-medium text-brand-ink/70"
            >
              {showApiKey ? "Hide key" : "Show key"}
            </button>
          </div>
          <label className="flex items-start gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="mt-1 rounded border-stone-300"
            />
            <span>
              Remember this iPad — stay signed in after refresh on this device only. Use Logout to
              forget it.
            </span>
          </label>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="w-full rounded-lg bg-brand py-3 font-semibold text-brand-ink"
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  const acceptDetails = selectedOrder
    ? acceptPickupDetails(selectedOrder, pickupInputs, waitingMinutes)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-brand-paper text-brand-ink">
      <header className="sticky top-0 z-20 border-b border-brand-ink bg-brand-ink text-brand-paper">
        <div className="mx-auto max-w-[430px] px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/sushi-ro-mark.png"
              alt=""
              width={40}
              height={38}
              className="h-10 w-10 rounded-lg object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-wide">Sushi-Ro</p>
              <p className="text-xs text-brand">Admin</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-brand-paper/70">
                {paused ? "Paused" : restaurantOpen ? "Open" : "Closed"}
              </span>
              <button
                type="button"
                onClick={() => setTab(tab === "settings" ? "orders" : "settings")}
                className="rounded-full px-3 py-1.5 font-semibold ring-1 ring-white/20 hover:bg-white/10"
              >
                {tab === "settings" ? "Orders" : "Settings"}
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {STORE_WAIT_MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                disabled={!restaurantOpen}
                onClick={() => updateWaitingTime(m)}
                className={`rounded-full py-2 text-sm font-semibold ${
                  waitingMinutes === m
                    ? "bg-brand text-brand-ink"
                    : "text-brand-paper/80 ring-1 ring-white/20 disabled:opacity-40"
                }`}
              >
                {STORE_WAIT_LABELS[m]}
              </button>
            ))}
          </div>
          {!restaurantOpen && tab === "orders" && (
            <p className="mt-3 text-xs text-brand-paper/70">
              Wait time is locked while the restaurant is closed or paused.
            </p>
          )}
        </div>
      </header>

      {authenticated && !soundUnlocked && (
        <button
          type="button"
          onClick={enableSound}
          className="mx-auto mt-3 block w-full max-w-[430px] rounded-xl bg-brand px-4 py-3 text-base font-extrabold text-brand-ink"
        >
          Tap to enable loud order sounds
        </button>
      )}

      {tab === "orders" && (
        <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
          <aside className="border-b border-[#eadfc4]">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Orders
              </h2>
              <span className="text-sm text-stone-500">{queuedOrders.length}</span>
            </div>
            {queuedOrders.length === 0 ? (
              <p className="px-4 py-8 text-sm text-stone-500">No orders on screen.</p>
            ) : (
              <ul className="max-h-[30vh] overflow-y-auto pb-2">
                {queuedOrders.map((order) => {
                  const selected = order.id === selectedOrder?.id;
                  const cancelled = order.status === "cancelled" || order.status === "rejected";
                  const countdown =
                    order.status === "accepted"
                      ? formatCountdown(order.pickup_time ?? null, now)
                      : null;
                  return (
                    <li key={order.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setCancelOpen(false);
                        }}
                        className={`flex w-full flex-col gap-0.5 border-l-4 px-4 py-3 text-left ${
                          selected
                            ? "border-brand bg-white"
                            : cancelled
                              ? "border-transparent text-stone-500"
                              : "border-transparent hover:bg-white/70"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold">{customerTitle(order)}</span>
                          <span className="text-sm font-medium">
                            {formatPrice(order.total ?? order.subtotal)}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600">
                          {order.pickup_type === "asap"
                            ? "ASAP"
                            : `Later ${formatPickupTime(order.pickup_time)}`}
                          {" · "}
                          {statusLabel(order.status)}
                          {countdown && (
                            <span className="ml-1.5 font-bold tabular-nums text-brand-ink">
                              {countdown}
                            </span>
                          )}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <section className="flex-1 bg-white px-4 py-5">
            {!selectedOrder || !acceptDetails ? (
              <p className="py-16 text-center text-stone-500">Select an order from the list.</p>
            ) : (
              <div className="space-y-5">
                {selectedOrder.status === "cancelled" &&
                  selectedOrder.status_reason === CUSTOMER_CANCELLED_REASON && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                      Customer cancelled online
                    </p>
                  )}
                <div>
                  <p className="text-3xl font-bold tracking-tight">{customerTitle(selectedOrder)}</p>
                  <p className="mt-1 text-stone-600">
                    {selectedOrder.customer?.phone
                      ? formatPhoneDisplay(selectedOrder.customer.phone)
                      : ""}
                    {selectedOrder.customer?.phone ? " · " : ""}
                    {formatPickupTime(selectedOrder.created_at)}
                  </p>
                  {selectedOrder.pickup_type === "asap" ? (
                    <p className="mt-1 font-semibold text-brand-ink">ASAP pickup</p>
                  ) : (
                    <p className="mt-1 font-semibold text-brand-ink">
                      Pickup {formatPickupTime(selectedOrder.pickup_time)}
                    </p>
                  )}
                  {selectedOrder.pickup_type === "asap" &&
                    selectedOrder.status === "accepted" &&
                    selectedOrder.pickup_time && (
                      <p className="text-sm font-medium text-stone-600">
                        Pickup {formatPickupTime(selectedOrder.pickup_time)}
                      </p>
                    )}
                  {selectedCountdown && (
                    <p className="mt-3 text-5xl font-bold tabular-nums tracking-tight text-brand">
                      {selectedCountdown}
                    </p>
                  )}
                </div>

                <SpecialNotes order={selectedOrder} />
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Items
                  </p>
                  <OrderItems order={selectedOrder} menuItemsById={menuItemsById} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Extras
                  </p>
                  <OrderExtras order={selectedOrder} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Total</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(selectedOrder.total ?? selectedOrder.subtotal)}
                  </p>
                  <p className="text-sm text-stone-500">
                    Sub {formatPrice(selectedOrder.subtotal)} · Tax{" "}
                    {formatPrice(selectedOrder.tax ?? 0)}
                  </p>
                </div>

                {selectedOrder.status === "pending" && (
                  <div className="space-y-3 border-t border-[#eadfc4] pt-4">
                    {selectedOrder.pickup_type === "asap" && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Prep (min)
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {PREP_MINUTE_OPTIONS.map((minutes) => (
                            <button
                              key={minutes}
                              type="button"
                              onClick={() =>
                                setPickupInputs((prev) => ({ ...prev, [selectedOrder.id]: minutes }))
                              }
                              className={`min-h-11 rounded-lg px-1 py-2.5 text-sm font-extrabold ${
                                (pickupInputs[selectedOrder.id] ?? String(waitingMinutes)) ===
                                minutes
                                  ? "bg-brand-ink text-brand-paper"
                                  : "bg-brand-paper text-brand-ink"
                              }`}
                            >
                              {minutes}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={pickupInputs[selectedOrder.id] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                            setPickupInputs((prev) => ({ ...prev, [selectedOrder.id]: value }));
                          }}
                          placeholder="Custom min"
                          className="mt-2 w-full rounded-lg border border-[#eadfc4] px-3 py-2.5 text-base"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        updateOrder(
                          selectedOrder.id,
                          "accepted",
                          acceptDetails.pickupTime,
                          undefined,
                          acceptDetails.prepMinutes
                        )
                      }
                      className="min-h-14 w-full rounded-xl bg-emerald-700 px-3 py-3 text-lg font-bold text-white hover:bg-emerald-800"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateOrder(
                          selectedOrder.id,
                          "rejected",
                          undefined,
                          reasonInputs[selectedOrder.id] === "Custom message"
                            ? customReasonInputs[selectedOrder.id] || "Custom message"
                            : reasonInputs[selectedOrder.id] ?? "Out of items"
                        )
                      }
                      className="min-h-12 w-full rounded-xl bg-red-700 px-3 py-3 text-base font-bold text-white hover:bg-red-800"
                    >
                      Reject
                    </button>
                    <select
                      value={reasonInputs[selectedOrder.id] ?? "Out of items"}
                      onChange={(e) =>
                        setReasonInputs((prev) => ({
                          ...prev,
                          [selectedOrder.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[#eadfc4] px-3 py-2 text-sm font-medium"
                    >
                      <option>Out of items</option>
                      <option>Restaurant too busy</option>
                      <option>Custom message</option>
                    </select>
                    {reasonInputs[selectedOrder.id] === "Custom message" && (
                      <input
                        type="text"
                        placeholder="Reject message"
                        value={customReasonInputs[selectedOrder.id] ?? ""}
                        onChange={(e) =>
                          setCustomReasonInputs((prev) => ({
                            ...prev,
                            [selectedOrder.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-[#eadfc4] px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                )}

                {selectedOrder.status === "accepted" && (
                  <div className="border-t border-[#eadfc4] pt-4">
                    {!cancelOpen ? (
                      <button
                        type="button"
                        onClick={() => setCancelOpen(true)}
                        className="text-sm font-semibold text-red-700"
                      >
                        Cancel order
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={reasonInputs[selectedOrder.id] ?? "Customer cancellation"}
                          onChange={(e) =>
                            setReasonInputs((prev) => ({
                              ...prev,
                              [selectedOrder.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-[#eadfc4] px-3 py-2 text-sm"
                        >
                          <option>Customer cancellation</option>
                          <option>Out of items</option>
                          <option>Custom message</option>
                        </select>
                        {reasonInputs[selectedOrder.id] === "Custom message" && (
                          <input
                            type="text"
                            placeholder="Cancel message"
                            value={customReasonInputs[selectedOrder.id] ?? ""}
                            onChange={(e) =>
                              setCustomReasonInputs((prev) => ({
                                ...prev,
                                [selectedOrder.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-[#eadfc4] px-3 py-2 text-sm"
                          />
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateOrder(
                                selectedOrder.id,
                                "cancelled",
                                undefined,
                                reasonInputs[selectedOrder.id] === "Custom message"
                                  ? customReasonInputs[selectedOrder.id] || "Custom message"
                                  : reasonInputs[selectedOrder.id] ?? "Customer cancellation"
                              )
                            }
                            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white"
                          >
                            Confirm cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-600"
                          >
                            Keep order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "settings" && (
        <div className="mx-auto w-full max-w-[430px] space-y-8 px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-brand-ink">Settings</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void dismissOrders()}
                className="rounded-lg border border-[#eadfc4] bg-white px-3 py-2 text-sm font-semibold text-brand-ink"
              >
                Clear orders
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
          <section>
            <h2 className="text-lg font-semibold text-stone-900">Notification sounds</h2>
            <p className="mt-1 text-sm text-stone-600">
              Sounds are louder by default. Safari and iPads usually need one tap after opening the
              admin page (or when logging in) before alerts can play — use the yellow banner or the
              test button below if you do not hear them.
            </p>
            <div className="mt-4 grid gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                ASAP notification sound
                <select
                  value={asapSound}
                  onChange={(e) => updateAsapSound(e.target.value as NotificationSound)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                >
                  {Object.entries(NOTIFICATION_SOUNDS).map(([value, sound]) => (
                    <option key={value} value={value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-stone-700">
                Later notification sound
                <select
                  value={scheduledSound}
                  onChange={(e) => updateScheduledSound(e.target.value as NotificationSound)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-base"
                >
                  {Object.entries(NOTIFICATION_SOUNDS).map(([value, sound]) => (
                    <option key={value} value={value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={enableSound}
                  className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Test / unlock sound
                </button>
                <button
                  type="button"
                  onClick={() => playNotificationSound("scheduled")}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Test later sound
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Pause service</h2>
            <p className="mt-1 text-sm text-stone-600">
              Temporarily stop new orders. Store stays open by business hours unless paused.
            </p>
            {paused && pauseUntil && (
              <p className="mt-2 text-sm text-amber-700">
                Paused until {formatOrderDate(pauseUntil)}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["rest_of_day", "Rest of day"],
                ["30", "30 mins"],
                ["60", "1 hour"],
                ["120", "2 hours"],
                ["clear", "Resume service"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  disabled={!withinBusinessHours && value !== "clear"}
                  onClick={() => pauseService(value)}
                  className="rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
            {settingsMessage && (
              <p className="mt-2 text-sm text-emerald-700">{settingsMessage}</p>
            )}
            {!withinBusinessHours && (
              <p className="mt-2 text-sm text-stone-500">
                Pause buttons are available during business hours only.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Special closed dates</h2>
            <p className="mt-1 text-sm text-stone-600">
              Add a start and end date (same day = one day closed). Past periods are removed
              automatically.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                Start date
                <input
                  type="date"
                  value={closedStartDate}
                  min={restaurantCalendarDate()}
                  onChange={(e) => {
                    const start = e.target.value;
                    setClosedStartDate(start);
                    if (!closedEndDate || closedEndDate < start) setClosedEndDate(start);
                  }}
                  className="mt-1 min-h-11 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-base"
                />
              </label>
              <label className="text-sm font-medium text-stone-700">
                End date
                <input
                  type="date"
                  value={closedEndDate}
                  min={closedStartDate || restaurantCalendarDate()}
                  onChange={(e) => setClosedEndDate(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-base"
                />
              </label>
            </div>
            {closedStartDate && closedEndDate && (
              <p className="mt-2 text-sm font-medium text-stone-700">
                Duration: {formatSpecialClosureLabel({ start: closedStartDate, end: closedEndDate })}
              </p>
            )}
            <label className="mt-2 block text-sm font-medium text-stone-700">
              Banner message (optional)
              <input
                type="text"
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                placeholder="Closed for vacation — reopening Jan 2"
                className="mt-1 min-h-11 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-base"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (!closedStartDate || !closedEndDate || closedEndDate < closedStartDate) {
                  setSettingsMessage("Choose a valid start and end date.");
                  return;
                }
                const next: SpecialClosedPeriod = {
                  start: closedStartDate,
                  end: closedEndDate,
                  message: closedMessage.trim() || undefined,
                };
                const today = restaurantCalendarDate();
                updateSpecialClosedPeriods(
                  [...specialClosedPeriods, next]
                    .filter((period) => period.end >= today)
                    .sort((a, b) => a.start.localeCompare(b.start))
                );
                setClosedStartDate("");
                setClosedEndDate("");
                setClosedMessage("");
                setSettingsMessage("Closed period saved.");
              }}
              className="mt-3 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Add closed period
            </button>
            <div className="mt-3 flex flex-wrap gap-2">
              {specialClosedPeriods.map((period) => (
                <button
                  key={`${period.start}-${period.end}-${period.message ?? ""}`}
                  type="button"
                  onClick={() =>
                    updateSpecialClosedPeriods(
                      specialClosedPeriods.filter(
                        (entry) =>
                          !(
                            entry.start === period.start &&
                            entry.end === period.end &&
                            entry.message === period.message
                          )
                      )
                    )
                  }
                  className="rounded-full bg-red-50 px-3 py-1.5 text-left text-sm font-medium text-red-700"
                >
                  {formatSpecialClosureLabel(period)}
                  {period.message ? ` · ${period.message}` : ""} ×
                </button>
              ))}
              {!specialClosedPeriods.length && (
                <p className="text-sm text-stone-500">No special closed dates.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900">Sold out items</h2>
            <p className="mt-1 text-sm text-stone-600">
              Mark items unavailable on the customer menu.
            </p>
            <div className="mt-4 space-y-6">
              {menu?.sections.map((menuSection) => (
                <div key={menuSection.id}>
                  <h3
                    className={`mb-3 text-base font-bold ${
                      menuSection.slug === "gluten-free" ? "text-blue-900" : "text-stone-900"
                    }`}
                  >
                    {toDisplayName(menuSection.name)}
                  </h3>
                  <div className="space-y-3">
              {menuItemsByCategory
                .filter(({ section }) => section?.id === menuSection.id)
                .map(({ category, section, items }) => {
                const expanded = expandedSoldOutCategory === category.id;
                const soldOutCount = items.filter((item) => soldOutIds.includes(item.id)).length;
                const isGFCategory = section?.slug === "gluten-free";

                return (
                  <div
                    key={category.id}
                    className={`rounded-xl border bg-white ${
                      isGFCategory ? "border-blue-200 bg-blue-50/40" : "border-stone-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSoldOutCategory(expanded ? null : category.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className={`font-semibold ${isGFCategory ? "text-blue-950" : "text-stone-900"}`}>
                        {toDisplayName(category.name)}
                      </span>
                      <span className="text-sm text-stone-500">
                        {soldOutCount > 0 ? `${soldOutCount} sold out` : `${items.length} items`}
                      </span>
                    </button>

                    {expanded && (
                      <div className="flex flex-wrap gap-2 border-t border-stone-100 p-4">
                        {items.map((item: MenuItem) => {
                          const soldOut = soldOutIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleSoldOut(item.id)}
                              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                                soldOut
                                  ? isGFCategory
                                    ? "bg-blue-200 text-blue-950 ring-1 ring-blue-400"
                                    : "bg-red-100 text-red-800 ring-1 ring-red-200"
                                  : isGFCategory
                                    ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                                    : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              {toDisplayName(item.name)}
                              {soldOut ? " · Sold out" : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
