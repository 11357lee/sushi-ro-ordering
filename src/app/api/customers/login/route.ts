import { NextResponse } from "next/server";
import { findDemoCustomer, isDemoMode, listDemoOrdersByCustomerId } from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchCustomerOrders } from "@/lib/data/queries";
import { normalizePhone } from "@/lib/utils";

function namesMatch(a: string, b: string): boolean {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "");
  return normalize(a) === normalize(b);
}

export async function POST(request: Request) {
  try {
    const { firstName, phone } = await request.json();

    if (!firstName?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "First name and phone required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const name = firstName.trim();

    if (isDemoMode()) {
      const customer = findDemoCustomer(name, normalized);
      if (!customer) {
        return NextResponse.json(
          { error: "No account found with that name and phone number." },
          { status: 404 }
        );
      }
      const orders = listDemoOrdersByCustomerId(customer.id);
      return NextResponse.json({ customer, orders });
    }

    const supabase = createAdminClient();
    const { data: matches } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", normalized);

    const retained = (matches ?? []).filter((row) => row.save_history);
    if (!retained.length) {
      return NextResponse.json(
        {
          error:
            "This phone number has no saved account. Accept Privacy Policy and Terms at checkout to keep order history.",
        },
        { status: 404 }
      );
    }

    // Prefer exact/near name match; otherwise reclaim the single retained account for this phone
    // (names used to be overwritten by later guest orders).
    let existing =
      retained.find((row) => namesMatch(String(row.first_name ?? ""), name)) ?? null;

    if (!existing && retained.length === 1) {
      existing = retained[0];
      if (!namesMatch(String(existing.first_name ?? ""), name)) {
        const { data: restored } = await supabase
          .from("customers")
          .update({ first_name: name })
          .eq("id", existing.id)
          .select()
          .single();
        existing = restored ?? { ...existing, first_name: name };
      }
    }

    if (!existing) {
      return NextResponse.json(
        { error: "No account found with that name and phone number." },
        { status: 404 }
      );
    }

    const orders = await fetchCustomerOrders(existing.id);
    return NextResponse.json({ customer: existing, orders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
