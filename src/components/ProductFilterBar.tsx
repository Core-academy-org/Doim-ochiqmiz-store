import React from 'react';
import { Branch } from '../types';
import { soundFx } from '../lib/sound';
import { Translations, Language, getLocalizedCategory } from '../lib/i18n';
import { Search, MapPin, ArrowUpDown, RotateCcw, Tag } from 'lucide-react';

interface ProductFilterBarProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceSort: 'none' | 'low-to-high' | 'high-to-low';
  onPriceSortChange: (sort: 'none' | 'low-to-high' | 'high-to-low') => void;
  stockFilter: 'all' | 'instock' | 'restocking';
  onStockFilterChange: (filter: 'all' | 'instock' | 'restocking') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  lang: Language;
  t: Translations;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  searchQuery,
  onSearchChange,
  priceSort,
  onPriceSortChange,
  stockFilter,
  onStockFilterChange,
  selectedCategory,
  onCategoryChange,
  categories,
  lang,
  t
}) => {
  const handleResetFilters = () => {
    soundFx.playClick('pop');
    onSelectBranch('all');
    onSearchChange('');
    onPriceSortChange('none');
    onStockFilterChange('all');
    onCategoryChange('all');
  };

  // Helper for category icons
  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('meva') || c.includes('sabzavot') || c.includes('fruit') || c.includes('фрукт')) return '🍏';
    if (c.includes('sport') || c.includes('спорт')) return '⚽';
    if (c.includes('oshxona') || c.includes('kitchen') || c.includes('кухон')) return '🍳';
    if (c.includes('ichimlik') || c.includes('sut') || c.includes('drink') || c.includes('напитки')) return '🥛';
    if (c.includes('elektronika') || c.includes('ro\'zg\'or') || c.includes('electronic') || c.includes('быт')) return '⚡';
    if (c.includes('shirinlik') || c.includes('sweet') || c.includes('сладост')) return '🍬';
    return '📦';
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Branch Filter */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-4 h-4 text-sky-600 absolute left-3.5 top-3 pointer-events-none z-10" />
          <select
            value={selectedBranchId}
            onChange={(e) => {
              soundFx.playClick('pop');
              onSelectBranch(e.target.value);
            }}
            className="w-full pl-10 pr-8 py-2.5 text-xs bg-sky-50/60 border border-sky-100 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">{t.allBranches}</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                📍 {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Sort Filter */}
        <div className="md:col-span-3 relative">
          <ArrowUpDown className="w-4 h-4 text-amber-600 absolute left-3.5 top-3 pointer-events-none z-10" />
          <select
            value={priceSort}
            onChange={(e) => {
              soundFx.playClick('click');
              onPriceSortChange(e.target.value as any);
            }}
            className="w-full pl-10 pr-8 py-2.5 text-xs bg-amber-50/60 border border-amber-100 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="none">{t.priceSortDefault}</option>
            <option value="low-to-high">{t.priceLowHigh}</option>
            <option value="high-to-low">{t.priceHighLow}</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-2">
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      </div>

      {/* Stock Status Filter Pills & Categories */}
      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        {/* Stock Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="font-bold text-slate-400 text-[11px] pr-1 shrink-0">{t.status}:</span>

          <button
            onClick={() => {
              soundFx.playClick('click');
              onStockFilterChange('all');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              stockFilter === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.allStatus}
          </button>

          <button
            onClick={() => {
              soundFx.playClick('click');
              onStockFilterChange('instock');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              stockFilter === 'instock'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            {t.inStock}
          </button>

          <button
            onClick={() => {
              soundFx.playClick('click');
              onStockFilterChange('restocking');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              stockFilter === 'restocking'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {t.restocking}
          </button>
        </div>

        {/* Category Pills Bar */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <span className="font-bold text-slate-400 text-[11px] pr-1 flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3 text-sky-600" />
              <span>{t.category}:</span>
            </span>

            <button
              onClick={() => {
                soundFx.playClick('click');
                onCategoryChange('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedCategory === 'all' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-100'
              }`}
            >
              <span>✨</span>
              <span>{t.allCategories}</span>
            </button>

            {categories.map((cat) => {
              const localizedCatName = getLocalizedCategory(cat, lang);
              const isSelected = selectedCategory === cat;
              const icon = getCategoryIcon(cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick('click');
                    onCategoryChange(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-sky-600 text-white shadow-xs scale-[1.02]' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{localizedCatName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

