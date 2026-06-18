"use client";

import type { Category, MenuSection } from "@/types";

interface SectionTabsProps {
  sections: MenuSection[];
  activeSection: string;
  onChange: (slug: string) => void;
}

export function SectionTabs({ sections, activeSection, onChange }: SectionTabsProps) {
  return (
    <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-2">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.slug)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeSection === section.slug
              ? section.slug === "gluten-free"
                ? "bg-teal-600 text-white"
                : "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          {section.name}
        </button>
      ))}
    </div>
  );
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  onChange: (slug: string) => void;
}

export function CategoryNav({ categories, activeCategory, onChange }: CategoryNavProps) {
  return (
    <div className="sticky top-[57px] z-40 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.slug)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
