"use client";

import { useEffect, useState } from "react";
import type { RestaurantSettings, WaitingTime } from "@/types";
import { RESTAURANT_PHONE, RESTAURANT_PHONE_LINK } from "@/lib/constants";
import { WAITING_TIME_COLORS, WAITING_TIME_LABELS } from "@/types";
import { getWaitingTimeText, isPauseActive, isRestaurantOpen } from "@/lib/utils";

interface RestaurantBannerProps {
  initialSettings: RestaurantSettings;
  initialWaitingTime: WaitingTime;
}

export function RestaurantBanner({
  initialSettings,
  initialWaitingTime,
}: RestaurantBannerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [waitingTime, setWaitingTime] = useState(initialWaitingTime);

  useEffect(() => {
    const refresh = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.waitingTime) setWaitingTime(data.waitingTime);
    };
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  const phone = settings.phone || RESTAURANT_PHONE;
  const open = isRestaurantOpen(settings);
  const paused = isPauseActive(settings.pause_until);
  const waitColor = WAITING_TIME_COLORS[waitingTime.minutes] ?? "bg-emerald-500";

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: settings.banner_image_url
            ? `url(${settings.banner_image_url})`
            : "linear-gradient(135deg, #1a1a1a 0%, #374151 100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sushi-Ro</h1>
          <a
            href={`tel:${RESTAURANT_PHONE_LINK}`}
            className="text-sm text-stone-200 hover:text-white sm:text-base"
          >
            {phone}
          </a>
        </div>
        <p className="mt-2 text-sm text-stone-300 sm:text-base">
          Pickup only · Pay in store
        </p>
        <p className="mt-1 text-xs text-stone-400 sm:text-sm">
          Mon–Sat 11:30am–9pm · Sun 12pm–9pm
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
              open && !paused
                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-400/40"
            }`}
          >
            {paused ? "Paused" : open ? "Open" : "Closed"}
          </span>
          {open && !paused && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white sm:text-sm ${waitColor}`}
            >
              {getWaitingTimeText(waitingTime.minutes)} ·{" "}
              {WAITING_TIME_LABELS[waitingTime.minutes]}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
