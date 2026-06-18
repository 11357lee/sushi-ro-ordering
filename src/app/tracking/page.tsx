import { Header } from "@/components/layout/Header";
import { TrackingPageClient } from "@/components/account/TrackingPageClient";

export default function TrackingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <TrackingPageClient />
      </main>
    </>
  );
}
