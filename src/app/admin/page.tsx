import { AdminPageClient } from "@/components/admin/AdminPageClient";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-stone-100">
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){setTimeout(function(){if(document.documentElement.getAttribute("data-admin-hydrated")==="1")return;var el=document.getElementById("admin-compat-warning");if(el){el.style.display="block";}},2500);})();`,
        }}
      />
      <p
        id="admin-compat-warning"
        className="mx-auto mt-6 max-w-md rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-900"
        style={{ display: "none" }}
      >
        This iPad could not start the admin app. Next.js needs a newer Safari than iOS 15 can
        provide unless the site is rebuilt for older iPads. The sticker passcode on the device is
        not the admin key — enter the ADMIN_API_KEY from Vercel, or try a newer iPad/phone.
      </p>
      <AdminPageClient />
    </main>
  );
}
