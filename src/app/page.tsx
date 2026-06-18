import { Header } from "@/components/layout/Header";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import { fetchMenuData, fetchRestaurantSettings, fetchWaitingTime } from "@/lib/data/queries";

export default async function HomePage() {
  const [menu, settings, waitingTime] = await Promise.all([
    fetchMenuData(),
    fetchRestaurantSettings(),
    fetchWaitingTime(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <MenuPageClient menu={menu} settings={settings} waitingTime={waitingTime} />
      </main>
    </>
  );
}
