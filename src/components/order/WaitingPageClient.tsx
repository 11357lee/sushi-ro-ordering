"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { formatPickupTime, isRestaurantOpen } from "@/lib/utils";

interface WaitingPageClientProps {
  orderId: string;
}

export function WaitingPageClient({ orderId }: WaitingPageClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurantOpen, setRestaurantOpen] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      const settings = data.settings;
      if (settings) {
        setRestaurantOpen(
          isRestaurantOpen({
            pause_until: settings.pause_until,
            closing_time: settings.closing_time,
            timezone: settings.timezone,
            special_closed_dates: settings.special_closed_dates,
          })
        );
      }
    };
    void loadSettings();
  }, []);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        if (data.order.status === "accepted") {
          router.push(`/order/${orderId}/confirmation`);
        } else if (data.order.status === "rejected" || data.order.status === "cancelled") {
          router.push(`/order/${orderId}/confirmation`);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  const awaitingOpen =
    order?.pickup_type === "scheduled" && !restaurantOpen && order.status === "pending";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      {!awaitingOpen && (
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
      )}
      <h1 className="text-2xl font-bold text-stone-900">
        {awaitingOpen
          ? "Order received — we will confirm when we open"
          : "Waiting for restaurant confirmation..."}
      </h1>
      <p className="mt-3 text-stone-600">
        {awaitingOpen ? (
          <>
            Thank you for your order. The restaurant is not open yet, so staff will confirm your
            order as soon as we are ready to open.
            {order.pickup_time && (
              <>
                {" "}
                Your scheduled pickup is{" "}
                <span className="font-semibold text-stone-800">
                  {formatPickupTime(order.pickup_time)}
                </span>
                .
              </>
            )}{" "}
            You can close this page — we will update your order when it is accepted.
          </>
        ) : (
          "Your order has been received. This page will update automatically when staff accepts your order."
        )}
      </p>
      {order && (
        <p className="mt-4 text-sm text-stone-500">Order #{order.order_number}</p>
      )}
      {awaitingOpen && (
        <Link
          href="/"
          className="mt-8 rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-800"
        >
          Return to menu
        </Link>
      )}
    </div>
  );
}
