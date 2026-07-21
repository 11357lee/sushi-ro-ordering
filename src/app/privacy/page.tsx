import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold text-stone-900">Privacy Policy and Terms</h1>
          <p className="mt-3 text-sm text-stone-600">Last updated: July 21, 2026</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-stone-900">Privacy policy</h2>
            <p className="text-stone-700">
              Sushi-Ro collects the name, phone number, order details, pickup time, and special
              instructions you provide when placing or tracking pickup orders. We use this
              information to prepare orders, show order history, contact you about your order, and
              improve restaurant operations.
            </p>
            <p className="text-stone-700">
              We do not sell customer information. Order and account data is stored in our ordering
              system provider database and is accessed by Sushi-Ro staff only for restaurant
              operations.
            </p>
            <p className="text-stone-700">
              You can update your profile or delete your account from the account page. Deleting an
              account removes your saved customer profile and order history from the ordering
              system.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold text-stone-900">Terms and conditions</h2>
            <ul className="list-disc space-y-2 pl-5 text-stone-700">
              <li>Online orders are pickup only and payment is made in store at pickup.</li>
              <li>Prices, availability, and preparation times may change depending on the order.</li>
              <li>
                Orders are not final until accepted by Sushi-Ro staff. If an order is rejected or
                cancelled, the order page will show the reason when available.
              </li>
              <li>
                Large orders, catering requests, and cancellation questions should be handled by
                phone so staff can confirm details directly.
              </li>
              <li>
                Please review allergy and special requests carefully. Staff may call you if an item
                or request cannot be prepared as entered.
              </li>
            </ul>
          </section>

          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-stone-900 px-5 py-2.5 font-semibold text-white hover:bg-stone-800"
          >
            Back to menu
          </Link>
        </div>
      </main>
    </>
  );
}
