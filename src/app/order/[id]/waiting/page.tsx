import { Header } from "@/components/layout/Header";
import { WaitingPageClient } from "@/components/order/WaitingPageClient";

export default async function WaitingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <WaitingPageClient orderId={id} />
      </main>
    </>
  );
}
