import { Resend } from "resend";
import type { Order } from "@/types";
import { formatPickupTime, formatPrice } from "@/lib/utils";

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? "sushi-ro@sushi-ro.com";

  if (!apiKey || apiKey.startsWith("re_your")) {
    console.log("[Email] Skipped — RESEND_API_KEY not configured");
    return false;
  }

  const customer = order.customer;
  if (!customer?.email) return false;

  const resend = new Resend(apiKey);
  const pickupLabel = formatPickupTime(order.pickup_time);
  const itemsHtml = (order.order_items ?? [])
    .map(
      (item) =>
        `<tr><td>${item.quantity}x ${item.name}</td><td style="text-align:right">${formatPrice(item.line_total)}</td></tr>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: `Sushi-Ro <${fromEmail}>`,
      to: customer.email,
      subject: `Order #${order.order_number} confirmed — Sushi-Ro`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h1 style="color:#1a1a1a">Thank you for your order!</h1>
          <p>Hi ${customer.first_name},</p>
          <p>Your order <strong>#${order.order_number}</strong> has been confirmed.</p>
          <p><strong>Pickup time:</strong> ${pickupLabel}</p>
          <p>Please pay in-store when collecting your order.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            ${itemsHtml}
            <tr><td><strong>Total</strong></td><td style="text-align:right"><strong>${formatPrice(order.subtotal)}</strong></td></tr>
          </table>
          <p style="color:#666;font-size:14px">Sushi-Ro — Pickup only. No online payment required.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}
