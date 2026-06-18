import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createDemoOrder, isDemoMode } from "@/lib/data/demo-store";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CreateOrderPayload, Order } from "@/types";
import { calcLineTotal, calcCartSubtotal, normalizePhone } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    if (!body.firstName?.trim() || !body.phone?.trim() || !body.items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = calcCartSubtotal(body.items);
    const phone = normalizePhone(body.phone);
    const pickupType = body.pickupType;
    const pickupTime = pickupType === "asap" ? null : body.pickupTime;

    if (isDemoMode()) {
      const orderId = uuidv4();
      const order: Order = {
        id: orderId,
        order_number: 0,
        customer_id: uuidv4(),
        status: pickupType === "asap" ? "pending" : "accepted",
        pickup_type: pickupType,
        pickup_time: pickupTime,
        cutlery: body.extras.cutlery,
        cutlery_quantity: body.extras.cutleryQuantity,
        extra_wasabi: body.extras.extraWasabi,
        extra_ginger: body.extras.extraGinger,
        extra_soy_sauce: body.extras.extraSoySauce,
        no_wasabi: body.extras.noWasabi,
        no_ginger: body.extras.noGinger,
        no_soy_sauce: body.extras.noSoySauce,
        special_instructions: body.extras.specialInstructions || null,
        allergy_notes: body.allergyNotes || null,
        subtotal,
        confirmed_at: pickupType === "scheduled" ? new Date().toISOString() : null,
        cancel_window_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer: {
          id: uuidv4(),
          first_name: body.firstName.trim(),
          last_name: body.lastName?.trim() || null,
          phone,
          email: body.email?.trim() || null,
        },
        order_items: body.items.map((item) => ({
          id: uuidv4(),
          order_id: orderId,
          menu_item_id: item.menuItemId,
          section_slug: item.sectionSlug,
          name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          selected_options: item.selectedOptions,
          special_request: item.specialRequest || null,
          line_total: calcLineTotal(item.price, item.quantity, item.selectedOptions),
        })),
      };

      const saved = createDemoOrder(order);

      if (pickupType === "scheduled") {
        await sendOrderConfirmationEmail(saved);
      }

      return NextResponse.json({
        order: saved,
        redirectTo:
          pickupType === "asap"
            ? `/order/${saved.id}/waiting`
            : `/order/${saved.id}/confirmation`,
      });
    }

    const supabase = createAdminClient();

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    let customerId = existingCustomer?.id;

    if (customerId) {
      await supabase
        .from("customers")
        .update({
          first_name: body.firstName.trim(),
          last_name: body.lastName?.trim() || null,
          email: body.email?.trim() || null,
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert({
          first_name: body.firstName.trim(),
          last_name: body.lastName?.trim() || null,
          phone,
          email: body.email?.trim() || null,
        })
        .select()
        .single();

      if (error || !newCustomer) {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
      }
      customerId = newCustomer.id;
    }

    const initialStatus = pickupType === "asap" ? "pending" : "accepted";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        status: initialStatus,
        pickup_type: pickupType,
        pickup_time: pickupTime,
        cutlery: body.extras.cutlery,
        cutlery_quantity: body.extras.cutleryQuantity,
        extra_wasabi: body.extras.extraWasabi,
        extra_ginger: body.extras.extraGinger,
        extra_soy_sauce: body.extras.extraSoySauce,
        no_wasabi: body.extras.noWasabi,
        no_ginger: body.extras.noGinger,
        no_soy_sauce: body.extras.noSoySauce,
        special_instructions: body.extras.specialInstructions || null,
        allergy_notes: body.allergyNotes || null,
        subtotal,
        confirmed_at: pickupType === "scheduled" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      section_slug: item.sectionSlug,
      name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      selected_options: item.selectedOptions,
      special_request: item.specialRequest || null,
      line_total: calcLineTotal(item.price, item.quantity, item.selectedOptions),
    }));

    await supabase.from("order_items").insert(orderItems);

    const { data: fullOrder } = await supabase
      .from("orders")
      .select("*, order_items(*), customer:customers(*)")
      .eq("id", order.id)
      .single();

    if (pickupType === "scheduled" && fullOrder) {
      await sendOrderConfirmationEmail(fullOrder as Order);
    }

    return NextResponse.json({
      order: fullOrder,
      redirectTo:
        pickupType === "asap"
          ? `/order/${order.id}/waiting`
          : `/order/${order.id}/confirmation`,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
