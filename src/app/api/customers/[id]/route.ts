import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/data/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { firstName, lastName, phone } = await request.json();

  if (!firstName?.trim() || !lastName?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "First name, last name, and phone are required." },
      { status: 400 }
    );
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length !== 10) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  if (isDemoMode()) {
    return NextResponse.json({
      customer: {
        id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: normalizedPhone,
      },
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .update({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: normalizedPhone,
    })
    .eq("id", id)
    .select("id, first_name, last_name, phone")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Could not update profile. The phone number may already be used." },
      { status: 400 }
    );
  }

  return NextResponse.json({ customer: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isDemoMode()) {
    return NextResponse.json({ success: true });
  }

  const supabase = createAdminClient();
  const { error: orderError } = await supabase.from("orders").delete().eq("customer_id", id);
  if (orderError) {
    return NextResponse.json({ error: "Could not delete order history." }, { status: 500 });
  }

  const { error: customerError } = await supabase.from("customers").delete().eq("id", id);
  if (customerError) {
    return NextResponse.json({ error: "Could not delete account." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
