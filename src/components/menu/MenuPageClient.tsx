"use client";

import { useMemo, useState } from "react";
import type { MenuData, RestaurantSettings, WaitingTime } from "@/types";
import { CategoryNav, SectionTabs } from "@/components/menu/CategoryNav";
import { FeaturedItems } from "@/components/menu/FeaturedItems";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { RestaurantBanner } from "@/components/menu/RestaurantBanner";

interface MenuPageClientProps {
  menu: MenuData;
  settings: RestaurantSettings;
  waitingTime: WaitingTime;
}

export function MenuPageClient({ menu, settings, waitingTime }: MenuPageClientProps) {
  const [activeSection, setActiveSection] = useState("menu");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const sectionCategories = useMemo(
    () =>
      menu.categories
        .filter((c) => {
          const section = menu.sections.find((s) => s.id === c.section_id);
          return section?.slug === activeSection;
        })
        .sort((a, b) => a.sort_order - b.sort_order),
    [menu.categories, menu.sections, activeSection]
  );

  const filteredItems = useMemo(() => {
    let items = menu.items.filter((item) => {
      const category = menu.categories.find((c) => c.id === item.category_id);
      const section = menu.sections.find((s) => s.id === category?.section_id);
      return section?.slug === activeSection;
    });

    if (activeCategory) {
      items = items.filter((item) => {
        const cat = menu.categories.find((c) => c.id === item.category_id);
        return cat?.slug === activeCategory;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return items.sort((a, b) => a.sort_order - b.sort_order);
  }, [menu, activeSection, activeCategory, search]);

  const featuredItems = useMemo(
    () =>
      menu.featured
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((f) => menu.items.find((i) => i.id === f.menu_item_id))
        .filter(Boolean) as typeof menu.items,
    [menu.featured, menu.items]
  );

  const groupedByCategory = useMemo(() => {
    if (activeCategory || search.trim()) return null;

    return sectionCategories
      .map((cat) => ({
        category: cat,
        items: filteredItems.filter((item) => item.category_id === cat.id),
      }))
      .filter((g) => g.items.length > 0);
  }, [sectionCategories, filteredItems, activeCategory, search]);

  return (
    <>
      <RestaurantBanner settings={settings} waitingTime={waitingTime} />

      {!search && activeSection === "menu" && <FeaturedItems items={featuredItems.slice(0, 5)} />}

      <MenuSearch value={search} onChange={setSearch} />

      <SectionTabs
        sections={menu.sections}
        activeSection={activeSection}
        onChange={(slug) => {
          setActiveSection(slug);
          setActiveCategory(null);
        }}
      />

      <CategoryNav
        categories={sectionCategories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {groupedByCategory ? (
          groupedByCategory.map(({ category, items }) => (
            <section key={category.id} id={category.slug} className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-stone-900">{category.name}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <p className="py-12 text-center text-stone-500">No items found.</p>
        )}
      </div>
    </>
  );
}
