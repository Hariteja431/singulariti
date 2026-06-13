"use client";

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex gap-2.5 min-w-max px-1">
        <button
          onClick={() => onSelectCategory("All")}
          className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
            selectedCategory === "All"
              ? "bg-teal-600 border-teal-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
          }`}
        >
          All Articles
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
