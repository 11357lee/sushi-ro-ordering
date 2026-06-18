import type { RestaurantSettings, WaitingTime } from "@/types";
import { WAITING_TIME_COLORS, WAITING_TIME_LABELS } from "@/types";
import { getWaitingTimeText, isRestaurantOpen } from "@/lib/utils";

interface RestaurantBannerProps {
  settings: RestaurantSettings;
  waitingTime: WaitingTime;
}

export function RestaurantBanner({ settings, waitingTime }: RestaurantBannerProps) {
  const open = isRestaurantOpen(settings.is_open, settings.closing_time, settings.timezone);
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
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sushi-Ro</h1>
        <p className="mt-2 text-stone-300">Fresh sushi · Pickup only · Pay in store</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              open ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40" : "bg-red-500/20 text-red-300 ring-1 ring-red-400/40"
            }`}
          >
            {open ? "Open" : "Closed"}
          </span>
          {open && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white ${waitColor}`}
            >
              {getWaitingTimeText(waitingTime.minutes)} · {WAITING_TIME_LABELS[waitingTime.minutes]}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
