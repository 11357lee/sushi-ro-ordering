"use client";

import type { Category, MenuSection } from "@/types";
import { toDisplayName } from "@/lib/utils";

interface SectionTabsProps {
  sections: MenuSection[];
  activeSection: string;
  onChange: (slug: string) => void;
}

export function SectionTabs({ sections, activeSection, onChange }: SectionTabsProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-2">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.slug)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:py-2.5 ${
            activeSection === section.slug
              ? section.slug === "gluten-free"
                ? "bg-purple-700 text-white"
                : "bg-stone-900 text-white"
              : section.slug === "gluten-free"
                ? "bg-purple-100 text-purple-900 hover:bg-purple-200"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          {toDisplayName(section.name)}
        </button>
      ))}
    </div>
  );
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  variant?: "default" | "gluten-free";
  onChange: (slug: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  variant = "default",
  onChange,
}: CategoryNavProps) {
  const activeClass =
    variant === "gluten-free"
      ? "bg-purple-100 text-purple-900 ring-1 ring-purple-300"
      : "bg-teal-50 text-teal-800 ring-1 ring-teal-200";

  return (
    <div
      className={`sticky top-[57px] z-40 border-b ${
        variant === "gluten-free"
          ? "border-purple-200 bg-purple-50/95"
          : "border-stone-200 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !activeCategory ? activeClass : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.slug)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              activeCategory === cat.slug ? activeClass : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {toDisplayName(cat.name)}
          </button>
        ))}
      </div>
    </div>
  );
}
