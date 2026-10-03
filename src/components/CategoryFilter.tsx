import React from 'react';
import { FactCategory } from '../types';

interface CategoryFilterProps {
  categories: FactCategory[];
  activeCategory: FactCategory | 'All';
  onSelectCategory: (cat: FactCategory | 'All') => void;
  isLight: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  isLight
}) => {
  return (
    <div 
      className="w-full overflow-x-auto pb-1 scrollbar-none"
      role="region"
      aria-label="Category Filter"
    >
      <div 
        className={`inline-flex items-center gap-1 p-1 rounded-xl border text-xs font-mono transition-colors ${
          isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeCategory === 'All'
              ? isLight
                ? 'bg-white text-zinc-950 font-bold shadow-xs'
                : 'bg-zinc-800 text-zinc-50 font-bold shadow-xs'
              : isLight
              ? 'text-zinc-600 hover:text-zinc-950'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-pressed={activeCategory === 'All'}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              activeCategory === cat
                ? isLight
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'bg-zinc-800 text-zinc-50 font-bold shadow-xs'
                : isLight
                ? 'text-zinc-600 hover:text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
