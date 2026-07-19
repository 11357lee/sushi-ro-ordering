"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order } from "@/types";

interface WaitingPageClientProps {
  orderId: string;
}

export function WaitingPageClient({ orderId }: WaitingPageClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

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

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
      <h1 className="text-2xl font-bold text-stone-900">Waiting for restaurant confirmation...</h1>
      <p className="mt-3 text-stone-600">
        Your order has been received. This page will update automatically when staff accepts your
        order.
      </p>
      {order && (
        <p className="mt-4 text-sm text-stone-500">Order #{order.order_number}</p>
      )}
    </div>
  );
}
