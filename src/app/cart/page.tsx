import { Header } from "@/components/layout/Header";
import { CartPageClient } from "@/components/cart/CartPageClient";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <CartPageClient />
      </main>
    </>
  );
}
