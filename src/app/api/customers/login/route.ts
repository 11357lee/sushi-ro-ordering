import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchCustomerOrders } from "@/lib/data/queries";
import { normalizePhone } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { firstName, phone } = await request.json();

    if (!firstName?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "First name and phone required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);

    if (isDemoMode()) {
      return NextResponse.json(
        { error: "No account found with that name and phone number." },
        { status: 404 }
      );
    }

    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", normalized)
      .ilike("first_name", firstName.trim())
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "No account found with that name and phone number." },
        { status: 404 }
      );
    }

    const orders = await fetchCustomerOrders(existing.id);
    if (!orders.length) {
      return NextResponse.json(
        { error: "No order history found for this account." },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer: existing, orders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
