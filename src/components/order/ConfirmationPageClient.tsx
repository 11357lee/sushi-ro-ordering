"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { formatPickupTime } from "@/lib/utils";

interface ConfirmationPageClientProps {
  orderId: string;
  initialOrder: Order | null;
  waitingMinutes: number;
}

export function ConfirmationPageClient({
  orderId,
  initialOrder,
  waitingMinutes,
}: ConfirmationPageClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [cancelCountdown, setCancelCountdown] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const showCancel = waitingMinutes > 60 && order?.cancel_window_expires_at;

  useEffect(() => {
    const refresh = async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.order) setOrder(data.order);
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (!showCancel || !order?.cancel_window_expires_at) return;

    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(order.cancel_window_expires_at!).getTime() - Date.now()) / 1000
        )
      );
      setCancelCountdown(remaining);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [showCancel, order?.cancel_window_expires_at]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } finally {
      setCancelling(false);
    }
  };

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-stone-600">Order not found.</p>
        <Link href="/" className="mt-4 inline-block text-teal-600 hover:underline">
          Return to menu
        </Link>
      </div>
    );
  }

  const isRejected = order.status === "rejected";
  const isCancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      {isRejected ? (
        <>
          <h1 className="text-2xl font-bold text-red-600">Order Not Accepted</h1>
          <p className="mt-3 text-stone-600">
            Unfortunately the restaurant could not accept your order. Please call us or try again.
          </p>
        </>
      ) : isCancelled ? (
        <>
          <h1 className="text-2xl font-bold text-stone-900">Order Cancelled</h1>
          <p className="mt-3 text-stone-600">Your order has been cancelled.</p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Thank you for your order!</h1>
          <p className="mt-2 text-stone-600">Order #{order.order_number}</p>
          <div className="mt-6 rounded-xl bg-stone-50 p-6">
            <p className="text-sm font-medium text-stone-500">Your pickup time is</p>
            <p className="mt-1 text-3xl font-bold text-stone-900">
              {formatPickupTime(order.pickup_time)}
            </p>
          </div>
          <p className="mt-4 text-sm text-stone-500">Pay in store when collecting your order.</p>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {showCancel && cancelCountdown !== null && cancelCountdown > 0 && !isCancelled && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-xl border-2 border-red-500 px-6 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel ({cancelCountdown}s)
          </button>
        )}
        <Link
          href="/"
          className="rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-800"
        >
          Return to Website
        </Link>
      </div>
    </div>
  );
}
