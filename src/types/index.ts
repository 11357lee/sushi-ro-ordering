export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export type PickupType = "asap" | "scheduled";

export interface Label {
  id: string;
  name: string;
  slug: string;
}

export interface MenuOption {
  id: string;
  name: string;
  price_modifier: number;
  sort_order: number;
}

export interface MenuSection {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  accent_color: string;
}

export interface Category {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  has_roll_options: boolean;
  sort_order: number;
  labels?: Label[];
  options?: MenuOption[];
  section?: MenuSection;
  category?: Category;
}

export interface FeaturedItem {
  id: string;
  menu_item_id: string;
  sort_order: number;
  menu_item?: MenuItem;
}

export interface RestaurantSettings {
  id: string;
  is_open: boolean;
  banner_image_url: string | null;
  closing_time: string;
  timezone: string;
  business_email: string;
  phone?: string | null;
  tax_rate?: number;
  pause_until?: string | null;
  sold_out_item_ids?: string[];
}

export interface WaitingTime {
  id: string;
  minutes: 15 | 30 | 60 | 120;
  updated_at: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
}

export interface SelectedOption {
  id: string;
  name: string;
  price_modifier: number;
}

export interface CartItem {
  cartId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  sectionSlug: string;
  sectionName: string;
  accentColor: string;
  selectedOptions: SelectedOption[];
  specialRequest: string;
}

export interface CartExtras {
  cutlery: boolean;
  cutleryQuantity: number;
  extraWasabi: boolean;
  extraGinger: boolean;
  extraSoySauce: boolean;
  noWasabi: boolean;
  noGinger: boolean;
  noSoySauce: boolean;
  specialInstructions: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  section_slug: string;
  name: string;
  unit_price: number;
  quantity: number;
  selected_options: SelectedOption[];
  special_request: string | null;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: number;
  customer_id: string;
  status: OrderStatus;
  pickup_type: PickupType;
  pickup_time: string | null;
  cutlery: boolean;
  cutlery_quantity: number;
  extra_wasabi: boolean;
  extra_ginger: boolean;
  extra_soy_sauce: boolean;
  no_wasabi: boolean;
  no_ginger: boolean;
  no_soy_sauce: boolean;
  special_instructions: string | null;
  allergy_notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  admin_dismissed?: boolean;
  confirmed_at: string | null;
  cancel_window_expires_at: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  customer?: Customer;
}

export interface MenuData {
  sections: MenuSection[];
  categories: Category[];
  items: MenuItem[];
  featured: FeaturedItem[];
  options: MenuOption[];
}

export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  phone: string;
  pickupType: PickupType;
  pickupTime: string | null;
  allergyNotes: string;
  items: CartItem[];
  extras: CartExtras;
}

export const WAITING_TIME_COLORS: Record<number, string> = {
  15: "bg-emerald-500",
  30: "bg-amber-400",
  60: "bg-red-500",
  120: "bg-red-600",
};

export const WAITING_TIME_LABELS: Record<number, string> = {
  15: "15 minutes",
  30: "30 minutes",
  60: "1 hour",
  120: "2 hours",
};

export const LABEL_COLORS: Record<string, string> = {
  vegetarian: "bg-green-100 text-green-800",
  egg: "bg-yellow-100 text-yellow-800",
  cheese: "bg-orange-100 text-orange-800",
  popular: "bg-red-100 text-red-800",
};
