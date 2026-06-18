"use client";

import type { MenuItem } from "@/types";
import { MenuItemCard } from "./MenuItemCard";

interface FeaturedItemsProps {
  items: MenuItem[];
}

export function FeaturedItems({ items }: FeaturedItemsProps) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-semibold text-stone-900">Featured</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} featured />
        ))}
      </div>
    </section>
  );
}
