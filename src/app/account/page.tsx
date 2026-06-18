import { Header } from "@/components/layout/Header";
import { AccountPageClient } from "@/components/account/AccountPageClient";

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <AccountPageClient />
      </main>
    </>
  );
}
