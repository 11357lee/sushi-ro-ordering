import {
  getMockMenuData,
  MOCK_SETTINGS,
  MOCK_WAITING_TIME,
} from "@/lib/data/menu-mock";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  MenuData,
  MenuItem,
  Order,
  RestaurantSettings,
  WaitingTime,
} from "@/types";

export async function fetchMenuData(): Promise<MenuData> {
  if (!isSupabaseConfigured()) {
    return getMockMenuData();
  }

  const supabase = createAdminClient();

  const [
    { data: sections },
    { data: categories },
    { data: items },
    { data: featured },
    { data: options },
    { data: itemLabels },
    { data: itemOptions },
  ] = await Promise.all([
    supabase.from("menu_sections").select("*").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order"),
    supabase.from("featured_items").select("*").order("sort_order"),
    supabase.from("menu_options").select("*").order("sort_order"),
    supabase.from("menu_item_labels").select("menu_item_id, labels(id, name, slug)"),
    supabase.from("menu_item_options").select("menu_item_id, menu_option_id"),
  ]);

  const optionMap = new Map((options ?? []).map((o) => [o.id, o]));
  const sectionMap = new Map((sections ?? []).map((s) => [s.id, s]));
  const categoryMap = new Map((categories ?? []).map((c) => [c.id, c]));

  const labelsByItem = new Map<string, MenuItem["labels"]>();
  for (const row of itemLabels ?? []) {
    const label = row.labels as unknown as { id: string; name: string; slug: string };
    if (!label) continue;
    const existing = labelsByItem.get(row.menu_item_id) ?? [];
    existing.push(label);
    labelsByItem.set(row.menu_item_id, existing);
  }

  const optionsByItem = new Map<string, MenuItem["options"]>();
  for (const row of itemOptions ?? []) {
    const opt = optionMap.get(row.menu_option_id);
    if (!opt) continue;
    const existing = optionsByItem.get(row.menu_item_id) ?? [];
    existing.push(opt);
    optionsByItem.set(row.menu_item_id, existing);
  }

  const enrichedItems: MenuItem[] = (items ?? []).map((item) => {
    const category = categoryMap.get(item.category_id);
    const section = category ? sectionMap.get(category.section_id) : undefined;
    return {
      ...item,
      price: Number(item.price),
      category,
      section,
      labels: labelsByItem.get(item.id) ?? [],
      options: optionsByItem.get(item.id) ?? [],
    };
  });

  const itemMap = new Map(enrichedItems.map((i) => [i.id, i]));

  return {
    sections: sections ?? [],
    categories: categories ?? [],
    items: enrichedItems,
    featured: (featured ?? []).map((f) => ({
      ...f,
      menu_item: itemMap.get(f.menu_item_id),
    })),
    options: (options ?? []).map((o) => ({ ...o, price_modifier: Number(o.price_modifier) })),
  };
}

export async function fetchRestaurantSettings(): Promise<RestaurantSettings> {
  if (!isSupabaseConfigured()) return MOCK_SETTINGS;

  const supabase = createAdminClient();
  const { data } = await supabase.from("restaurant_settings").select("*").limit(1).single();
  return data ?? MOCK_SETTINGS;
}

export async function fetchWaitingTime(): Promise<WaitingTime> {
  if (!isSupabaseConfigured()) return MOCK_WAITING_TIME;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("waiting_time")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return data ?? MOCK_WAITING_TIME;
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), customer:customers(*)")
    .eq("id", id)
    .single();

  if (!data) return null;

  return {
    ...data,
    subtotal: Number(data.subtotal),
    customer: Array.isArray(data.customer) ? data.customer[0] : data.customer,
    order_items: (data.order_items ?? []).map((item: Record<string, unknown>) => ({
      ...item,
      unit_price: Number(item.unit_price),
      line_total: Number(item.line_total),
    })),
  } as Order;
}

export async function fetchOrdersByPhone(phone: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const normalized = phone.replace(/\D/g, "");

  const { data: customers } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", normalized);

  if (!customers?.length) return [];

  const customerIds = customers.map((c) => c.id);
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), customer:customers(*)")
    .in("customer_id", customerIds)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    customer: Array.isArray(order.customer) ? order.customer[0] : order.customer,
  })) as Order[];
}

export async function fetchCustomerOrders(customerId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
  })) as Order[];
}

export async function fetchPendingOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), customer:customers(*)")
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: true });

  return (data ?? []).map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    customer: Array.isArray(order.customer) ? order.customer[0] : order.customer,
  })) as Order[];
}
