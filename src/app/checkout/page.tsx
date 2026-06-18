import { Header } from "@/components/layout/Header";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <CheckoutPageClient />
      </main>
    </>
  );
}
