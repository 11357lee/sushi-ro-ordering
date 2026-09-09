"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuData, RestaurantSettings, WaitingTime } from "@/types";
import { CategoryNav, SectionTabs } from "@/components/menu/CategoryNav";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { RestaurantBanner } from "@/components/menu/RestaurantBanner";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { CATEGORY_DESCRIPTION_FALLBACKS } from "@/lib/constants";
import { toDisplayName } from "@/lib/utils";

interface MenuPageClientProps {
  menu: MenuData;
  settings: RestaurantSettings;
  waitingTime: WaitingTime;
}

const SINGLE_COLUMN_CATEGORY_SLUGS = new Set([
  "moriawase-tray",
  "moriawase",
  "tray",
  "sushi-pizza-bento-box",
  "dessert",
  "fusion-roll",
  "gf-moriawase",
  "gf-fusion-roll",
]);

function itemGridClass(categorySlug?: string | null): string {
  return SINGLE_COLUMN_CATEGORY_SLUGS.has(categorySlug ?? "")
    ? "grid grid-cols-1 gap-3 sm:gap-4"
    : "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3";
}

function compareBySortOrder<T extends { sort_order: number; name: string }>(a: T, b: T) {
  return a.sort_order - b.sort_order || a.name.localeCompare(b.name);
}

export function MenuPageClient({ menu, settings, waitingTime }: MenuPageClientProps) {
  const [fetchedMenu, setFetchedMenu] = useState<MenuData | null>(null);
  const liveMenu = fetchedMenu ?? menu;
  const [activeSection, setActiveSection] = useState("menu");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [soldOutIds, setSoldOutIds] = useState<string[]>(settings.sold_out_item_ids ?? []);

  useEffect(() => {
    const refresh = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings?.sold_out_item_ids) {
        setSoldOutIds(data.settings.sold_out_item_ids);
      }
    };
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refreshMenu = async () => {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as MenuData;
      if (data?.items && data?.categories) {
        setFetchedMenu(data);
      }
    };
    refreshMenu();
    const interval = setInterval(refreshMenu, 30000);
    return () => clearInterval(interval);
  }, []);

  const sectionCategories = useMemo(
    () =>
      liveMenu.categories
        .filter((c) => {
          const section = liveMenu.sections.find((s) => s.id === c.section_id);
          if (section?.slug !== activeSection) return false;
          // Hide empty / legacy categories (e.g. old Sushi Pizza after merge)
          return liveMenu.items.some((item) => item.category_id === c.id);
        })
        .sort(compareBySortOrder),
    [liveMenu.categories, liveMenu.items, liveMenu.sections, activeSection]
  );

  const filteredItems = useMemo(() => {
    let items = liveMenu.items.filter((item) => {
      const category = liveMenu.categories.find((c) => c.id === item.category_id);
      const section = liveMenu.sections.find((s) => s.id === category?.section_id);
      return section?.slug === activeSection;
    });

    if (activeCategory) {
      items = items.filter((item) => {
        const cat = liveMenu.categories.find((c) => c.id === item.category_id);
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

    return [...items].sort(compareBySortOrder);
  }, [liveMenu, activeSection, activeCategory, search]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory || search.trim()) return null;

    return sectionCategories
      .map((cat) => ({
        category: cat,
        items: filteredItems
          .filter((item) => item.category_id === cat.id)
          .sort(compareBySortOrder),
      }))
      .filter((g) => g.items.length > 0);
  }, [sectionCategories, filteredItems, activeCategory, search]);

  const activeCategoryDetails = useMemo(
    () => sectionCategories.find((cat) => cat.slug === activeCategory) ?? null,
    [activeCategory, sectionCategories]
  );

  return (
    <>
      <RestaurantBanner initialSettings={settings} initialWaitingTime={waitingTime} />

      <MenuSearch value={search} onChange={setSearch} />

      <SectionTabs
        sections={liveMenu.sections}
        activeSection={activeSection}
        onChange={(slug) => {
          setActiveSection(slug);
          setActiveCategory(null);
        }}
      />

      <CategoryNav
        categories={sectionCategories}
        activeCategory={activeCategory}
        variant={activeSection === "gluten-free" ? "gluten-free" : "default"}
        onChange={setActiveCategory}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {groupedByCategory ? (
          groupedByCategory.map(({ category, items }) => (
            <section key={category.id} id={category.slug} className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-stone-900">
                {toDisplayName(category.name)}
              </h2>
              {(category.description || CATEGORY_DESCRIPTION_FALLBACKS[category.slug]) && (
                <p className="-mt-2 mb-4 max-w-2xl text-sm text-stone-600">
                  {category.description || CATEGORY_DESCRIPTION_FALLBACKS[category.slug]}
                </p>
              )}
              <div className={itemGridClass(category.slug)}>
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    soldOut={soldOutIds.includes(item.id)}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <>
            {activeCategoryDetails && (
              <section className="mb-5">
                <h2 className="mb-2 text-xl font-semibold text-stone-900">
                  {toDisplayName(activeCategoryDetails.name)}
                </h2>
                {(activeCategoryDetails.description ||
                  CATEGORY_DESCRIPTION_FALLBACKS[activeCategoryDetails.slug]) && (
                  <p className="max-w-2xl text-sm text-stone-600">
                    {activeCategoryDetails.description ||
                      CATEGORY_DESCRIPTION_FALLBACKS[activeCategoryDetails.slug]}
                  </p>
                )}
              </section>
            )}
            <div className={itemGridClass(activeCategoryDetails?.slug)}>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  soldOut={soldOutIds.includes(item.id)}
                />
              ))}
            </div>
          </>
        )}

        {filteredItems.length === 0 && (
          <p className="py-12 text-center text-stone-500">No items found.</p>
        )}
      </div>
      <BackToTopButton />
    </>
  );
}
