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
      return NextResponse.json({
        customer: {
          id: "demo-customer",
          first_name: firstName.trim(),
          last_name: null,
          phone: normalized,
          email: null,
        },
        orders: [],
      });
    }

    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", normalized)
      .eq("first_name", firstName.trim())
      .maybeSingle();

    if (existing) {
      const orders = await fetchCustomerOrders(existing.id);
      return NextResponse.json({ customer: existing, orders });
    }

    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        first_name: firstName.trim(),
        phone: normalized,
      })
      .select()
      .single();

    if (error || !customer) {
      return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }

    return NextResponse.json({ customer, orders: [] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
