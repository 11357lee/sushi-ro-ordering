import { Header } from "@/components/layout/Header";
import { LoginPageClient } from "@/components/account/LoginPageClient";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <LoginPageClient />
      </main>
    </>
  );
}
