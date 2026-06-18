import { Header } from "@/components/layout/Header";
import { ConfirmationPageClient } from "@/components/order/ConfirmationPageClient";
import { getDemoOrder, isDemoMode } from "@/lib/data/demo-store";
import { fetchOrderById, fetchWaitingTime } from "@/lib/data/queries";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const waitingTime = await fetchWaitingTime();

  let order = null;
  if (isDemoMode()) {
    order = getDemoOrder(id) ?? null;
  } else {
    order = await fetchOrderById(id);
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <ConfirmationPageClient
          orderId={id}
          initialOrder={order}
          waitingMinutes={waitingTime.minutes}
        />
      </main>
    </>
  );
}
