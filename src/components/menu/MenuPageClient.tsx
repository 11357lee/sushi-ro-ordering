"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuData, RestaurantSettings, WaitingTime } from "@/types";
import { CategoryNav, SectionTabs } from "@/components/menu/CategoryNav";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { RestaurantBanner } from "@/components/menu/RestaurantBanner";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { CATEGORY_DESCRIPTION_FALLBACKS } from "@/lib/constants";
import { isRawOption } from "@/lib/data/menu-option-groups";
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
    // Browse and search only within the selected category — never the whole section.
    if (!activeCategory) return [];

    let items = liveMenu.items.filter((item) => {
      const category = liveMenu.categories.find((c) => c.id === item.category_id);
      const section = liveMenu.sections.find((s) => s.id === category?.section_id);
      return section?.slug === activeSection && category?.slug === activeCategory;
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((item) => {
        if (item.name.toLowerCase().includes(q)) return true;
        if (item.description?.toLowerCase().includes(q)) return true;
        if (
          item.labels?.some(
            (label) =>
              label.name.toLowerCase().includes(q) ||
              label.slug.toLowerCase().includes(q)
          )
        ) {
          return true;
        }
        if (q.length >= 2 && ("raw".startsWith(q) || q.includes("raw"))) {
          if (item.options?.some((option) => isRawOption(option.id))) return true;
        }
        return false;
      });
    }

    return [...items].sort(compareBySortOrder);
  }, [liveMenu, activeSection, activeCategory, search]);

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

      {search.trim() && (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pt-2">
          {!activeCategory ? (
            <p className="text-sm text-amber-800">
              Select a category above to search within it.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {!activeCategory ? (
          <p className="py-12 text-center text-stone-500">
            Select a category to browse the menu.
          </p>
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
            {filteredItems.length === 0 && (
              <p className="py-12 text-center text-stone-500">No items found.</p>
            )}
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
}
