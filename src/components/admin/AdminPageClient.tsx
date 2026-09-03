"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addMinutes } from "date-fns";
import type { MenuData, MenuItem, Order, SpecialClosedPeriod } from "@/types";
import { WAITING_TIME_LABELS } from "@/types";
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
const PREP_MINUTE_OPTIONS_PRIMARY = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
const PREP_MINUTE_OPTIONS_EXTENDED = ["60", "70", "80", "90", "100", "120"];
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

function customerTitle(order: Order): string {
  const first = order.customer?.first_name ? toDisplayName(order.customer.first_name) : "Guest";
  const last = order.customer?.last_name ? toDisplayName(order.customer.last_name) : "";
  return `${first}${last ? ` ${last}` : ""}`.trim();
}

function formatCountdown(pickupTime: string | null, now: Date): string | null {
  if (!pickupTime) return null;
  const diffMs = new Date(pickupTime).getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const totalMinutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
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
    <ul className="flex flex-wrap gap-1 text-xs">
      {extras.map((line) => (
        <li key={line} className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-800">
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
    <div className="my-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
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
    <ul className="space-y-1.5 rounded-lg bg-stone-100 px-2 py-2 text-sm">
      {rows.map(({ item, isGF, showDivider }) => (
        <li key={item.id}>
          {showDivider && <div className="my-1.5 border-t border-stone-300" />}
          <div className={isGF ? "rounded-md bg-purple-50 px-1.5 py-1 text-purple-950" : "px-1.5 py-0.5"}>
            <span className="text-base font-bold text-stone-950">
              {item.quantity}x {toDisplayName(item.name)}
            </span>
            {isGF && (
              <span className="ml-1.5 text-xs font-medium text-purple-800">GF</span>
            )}
            {item.selected_options?.length > 0 && (
              <p className="text-sm font-semibold text-teal-700">
                {item.selected_options.map((o) => toDisplayName(o.name)).join(", ")}
              </p>
            )}
            {item.special_request && (
              <p className="text-sm italic text-red-600">{item.special_request}</p>
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [orderMenuOpenId, setOrderMenuOpenId] = useState<string | null>(null);

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
    setSpecialClosedPeriods(normalizeSpecialClosedPeriods(data.settings?.special_closed_dates));
    setClosingTime(data.settings?.closing_time ?? "21:00:00");
  }, []);

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
    const interval = setInterval(() => setNow(new Date()), 30000);
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
    if (status !== "pending") {
      setExpandedId((current) => (current === orderId ? null : current));
    }
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
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-stone-900">Admin panel</h1>
        <p className="mt-2 text-sm text-stone-600">
          Order management for Sushi-Ro. Uses the same API as a future iOS app.
        </p>
        <form
          method="post"
          action="#"
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >
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
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-base"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((current) => !current)}
              className="text-sm font-medium text-teal-700"
            >
              {showApiKey ? "Hide key" : "Show key"}
            </button>
          </div>
          <label className="flex items-start gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="mt-1 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
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
            className="w-full rounded-lg bg-stone-900 py-3 font-semibold text-white"
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 text-base sm:py-6">
      {authenticated && !soundUnlocked && (
        <button
          type="button"
          onClick={enableSound}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-base font-extrabold text-stone-950 shadow-sm"
        >
          Tap to enable loud order sounds
        </button>
      )}
      <div className="sticky top-0 z-20 -mx-4 space-y-3 border-b border-stone-200 bg-stone-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-stone-700">Waiting:</span>
          {([15, 30, 60, 120] as const).map((m) => (
            <button
              key={m}
              type="button"
              disabled={!restaurantOpen}
              onClick={() => updateWaitingTime(m)}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${
                waitingMinutes === m
                  ? m <= 15
                    ? "bg-emerald-600 text-white"
                    : m === 30
                      ? "bg-amber-400 text-stone-900"
                      : "bg-red-600 text-white"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
              }`}
            >
              {WAITING_TIME_LABELS[m]}
            </button>
          ))}
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-lg font-bold leading-none text-stone-700 hover:bg-stone-50"
              aria-label="More admin options"
            >
              ⋯
            </button>
            {moreOpen && (
              <div className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-stone-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setTab("orders");
                    setMoreOpen(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  Orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("settings");
                    setMoreOpen(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  Settings
                </button>
                {!soundUnlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      enableSound();
                      setMoreOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-amber-800 hover:bg-amber-50"
                  >
                    Enable order sounds
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    void dismissOrders();
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  Clear orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    handleLogout();
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
                <p className="border-t border-stone-100 px-3 py-2 text-xs text-stone-500">
                  {paused
                    ? "Service paused"
                    : restaurantOpen
                      ? "Open (business hours)"
                      : "Closed (business hours)"}
                </p>
              </div>
            )}
          </div>
        </div>

        {!restaurantOpen && (
          <p className="text-xs text-stone-500">
            Waiting time controls are disabled while the restaurant is closed or paused.
          </p>
        )}
      </div>

      {tab === "orders" && (
        <>
          <div className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-stone-500">No orders on screen.</p>
            ) : (
              orders.map((order) => {
                const expanded = order.status === "pending" || expandedId === order.id;
                const cancelled = order.status === "cancelled";
                const rejected = order.status === "rejected";
                const customerCancelled =
                  cancelled && order.status_reason === CUSTOMER_CANCELLED_REASON;
                const countdown =
                  order.status === "accepted"
                    ? formatCountdown(order.pickup_time ?? null, now)
                    : null;

                const acceptDetails = acceptPickupDetails(order, pickupInputs, waitingMinutes);

                return (
                  <div
                    id={`admin-order-${order.id}`}
                    key={order.id}
                    className={`rounded-xl border-2 bg-white p-3 shadow-sm ${
                      cancelled || rejected
                        ? "border-red-500 ring-2 ring-red-100"
                        : order.status === "pending"
                          ? "border-amber-300"
                          : "border-stone-200"
                    }`}
                  >
                    <div className="grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="text-left"
                      >
                        {customerCancelled && (
                          <p className="mb-1 rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                            Customer cancelled online
                          </p>
                        )}
                        <p className="text-lg font-extrabold tracking-tight text-stone-950">
                          {customerTitle(order)}
                        </p>
                        <p className="text-sm font-medium text-stone-600">
                          {formatPickupTime(order.created_at)}
                        </p>
                        <p className="text-sm font-medium text-stone-700">
                          {order.customer?.phone ? formatPhoneDisplay(order.customer.phone) : ""} ·{" "}
                          <span className="capitalize">{order.status}</span>
                        </p>
                        {order.pickup_type === "asap" ? (
                          <p className="text-sm font-bold text-amber-700">ASAP pickup</p>
                        ) : (
                          <p className="text-sm font-bold text-sky-700">
                            Pickup {formatPickupTime(order.pickup_time)}
                            {countdown && (
                              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-800">
                                {countdown}
                              </span>
                            )}
                          </p>
                        )}
                        {order.pickup_type === "asap" && order.status === "accepted" && order.pickup_time && (
                          <p className="text-sm font-bold text-stone-800">
                            Ready {formatPickupTime(order.pickup_time)}
                            {countdown && (
                              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-800">
                                {countdown}
                              </span>
                            )}
                          </p>
                        )}
                        <div className="mt-2">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                            Extras
                          </p>
                          <OrderExtras order={order} />
                        </div>
                      </button>

                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        {order.status === "pending" && order.pickup_type === "asap" && (
                          <div>
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                              Prep (min)
                            </p>
                            <div className="grid grid-cols-5 gap-1.5">
                              {PREP_MINUTE_OPTIONS_PRIMARY.map((minutes) => (
                                <button
                                  key={minutes}
                                  type="button"
                                  onClick={() => {
                                    setPickupInputs((prev) => ({ ...prev, [order.id]: minutes }));
                                  }}
                                  className={`min-h-11 rounded-lg px-1 py-2.5 text-sm font-extrabold sm:text-base ${
                                    pickupInputs[order.id] === minutes
                                      ? "bg-stone-900 text-white"
                                      : "bg-stone-100 text-stone-800"
                                  }`}
                                >
                                  {minutes}
                                </button>
                              ))}
                            </div>
                            <div className="mt-1.5 grid grid-cols-6 gap-1.5">
                              {PREP_MINUTE_OPTIONS_EXTENDED.map((minutes) => (
                                <button
                                  key={minutes}
                                  type="button"
                                  onClick={() => {
                                    setPickupInputs((prev) => ({ ...prev, [order.id]: minutes }));
                                  }}
                                  className={`min-h-11 rounded-lg px-1 py-2.5 text-sm font-extrabold sm:text-base ${
                                    pickupInputs[order.id] === minutes
                                      ? "bg-stone-900 text-white"
                                      : "bg-amber-100 text-amber-950"
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
                              value={pickupInputs[order.id] ?? ""}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                                setPickupInputs((prev) => ({ ...prev, [order.id]: value }));
                              }}
                              placeholder="Custom min"
                              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-base"
                            />
                          </div>
                        )}

                        {order.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateOrder(
                                  order.id,
                                  "accepted",
                                  acceptDetails.pickupTime,
                                  undefined,
                                  acceptDetails.prepMinutes
                                )
                              }
                              className="min-h-12 w-full rounded-xl bg-emerald-600 px-3 py-3 text-base font-bold text-white hover:bg-emerald-700"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateOrder(
                                  order.id,
                                  "rejected",
                                  undefined,
                                  reasonInputs[order.id] === "Custom message"
                                    ? customReasonInputs[order.id] || "Custom message"
                                    : reasonInputs[order.id] ?? "Out of items"
                                )
                              }
                              className="min-h-11 w-full rounded-xl bg-red-600 px-3 py-2.5 text-base font-bold text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <select
                              value={reasonInputs[order.id] ?? "Out of items"}
                              onChange={(e) =>
                                setReasonInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                              }
                              className="w-full rounded border border-stone-200 px-2 py-1 text-xs font-medium text-stone-700"
                            >
                              <option>Out of items</option>
                              <option>Restaurant too busy</option>
                              <option>Custom message</option>
                            </select>
                            {reasonInputs[order.id] === "Custom message" && (
                              <input
                                type="text"
                                placeholder="Reject message"
                                onChange={(e) =>
                                  setCustomReasonInputs((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                className="w-full rounded border border-stone-200 px-2 py-1 text-xs"
                              />
                            )}
                          </>
                        )}

                        {order.status === "accepted" && (
                          <>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                              Total
                            </p>
                            <p className="text-xl font-extrabold text-stone-950">
                              {formatPrice(order.total ?? order.subtotal)}
                            </p>
                            <p className="text-xs font-medium text-stone-600">
                              Sub {formatPrice(order.subtotal)} · Tax {formatPrice(order.tax ?? 0)}
                            </p>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOrderMenuOpenId((current) =>
                                    current === order.id ? null : order.id
                                  )
                                }
                                className="rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
                                aria-label="Order actions"
                              >
                                ⋯
                              </button>
                              {orderMenuOpenId === order.id && (
                                <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-stone-200 bg-white p-1 shadow-lg">
                                  <select
                                    value={reasonInputs[order.id] ?? "Customer cancellation"}
                                    onChange={(e) =>
                                      setReasonInputs((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    className="mb-1 w-full rounded border border-stone-200 px-2 py-1 text-xs"
                                  >
                                    <option>Customer cancellation</option>
                                    <option>Out of items</option>
                                    <option>Custom message</option>
                                  </select>
                                  {reasonInputs[order.id] === "Custom message" && (
                                    <input
                                      type="text"
                                      placeholder="Cancel message"
                                      onChange={(e) =>
                                        setCustomReasonInputs((prev) => ({
                                          ...prev,
                                          [order.id]: e.target.value,
                                        }))
                                      }
                                      className="mb-1 w-full rounded border border-stone-200 px-2 py-1 text-xs"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOrderMenuOpenId(null);
                                      void updateOrder(
                                        order.id,
                                        "cancelled",
                                        undefined,
                                        reasonInputs[order.id] === "Custom message"
                                          ? customReasonInputs[order.id] || "Custom message"
                                          : reasonInputs[order.id] ?? "Customer cancellation"
                                      );
                                    }}
                                    className="block w-full rounded px-2 py-1.5 text-left text-xs font-medium text-red-700 hover:bg-red-50"
                                  >
                                    Cancel order
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 border-t border-stone-100 pt-2">
                      <h3 className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                        Items
                      </h3>
                      <SpecialNotes order={order} />
                      {expanded ? (
                        <OrderItems order={order} menuItemsById={menuItemsById} />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setExpandedId(order.id)}
                          className="text-sm font-medium text-teal-700 hover:underline"
                        >
                          View items
                        </button>
                      )}
                      {order.status === "pending" && (
                        <div className="mt-2 text-left">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                            Total
                          </p>
                          <p className="text-lg font-extrabold text-stone-950">
                            {formatPrice(order.total ?? order.subtotal)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </>
      )}

      {tab === "settings" && (
        <div className="mt-6 space-y-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-stone-900">Settings</h2>
            <button
              type="button"
              onClick={() => setTab("orders")}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Back to orders
            </button>
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
              Add single days or date ranges (e.g. Dec 3–31 vacation). A custom message replaces the
              Open/Closed badge on the menu during the closure.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700">
                Start date
                <input
                  type="date"
                  value={closedStartDate}
                  onChange={(e) => setClosedStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-stone-700">
                End date
                <input
                  type="date"
                  value={closedEndDate}
                  onChange={(e) => setClosedEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="mt-2 block text-sm font-medium text-stone-700">
              Banner message (optional)
              <input
                type="text"
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                placeholder="Closed for vacation — reopening Jan 2"
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (!closedStartDate || !closedEndDate || closedEndDate < closedStartDate) return;
                const next: SpecialClosedPeriod = {
                  start: closedStartDate,
                  end: closedEndDate,
                  message: closedMessage.trim() || undefined,
                };
                updateSpecialClosedPeriods(
                  [...specialClosedPeriods, next].sort((a, b) => a.start.localeCompare(b.start))
                );
                setClosedStartDate("");
                setClosedEndDate("");
                setClosedMessage("");
              }}
              className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
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
                  className="rounded-full bg-red-50 px-3 py-1 text-left text-sm font-medium text-red-700"
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
                      menuSection.slug === "gluten-free" ? "text-purple-900" : "text-stone-900"
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
                      isGFCategory ? "border-purple-200 bg-purple-50/40" : "border-stone-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSoldOutCategory(expanded ? null : category.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className={`font-semibold ${isGFCategory ? "text-purple-950" : "text-stone-900"}`}>
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
                                  ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                  : isGFCategory
                                    ? "bg-purple-100 text-purple-900 ring-1 ring-purple-300"
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
