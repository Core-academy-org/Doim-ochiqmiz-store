import React from 'react';
import { Store, MapPin, Newspaper } from 'lucide-react';
import { soundFx } from '../lib/sound';
import { Translations } from '../lib/i18n';

interface MobileBottomNavProps {
  activeTab: 'products' | 'branches' | 'news';
  setActiveTab: (tab: 'products' | 'branches' | 'news') => void;
  branchesCount: number;
  newsCount: number;
  t: Translations;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  branchesCount,
  newsCount,
  t,
}) => {
  const handleTabClick = (tab: 'products' | 'branches' | 'news') => {
    soundFx.playClick('click');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => handleTabClick('products')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'products'
            ? 'text-emerald-700 font-bold bg-emerald-50'
            : 'text-slate-500 font-medium hover:text-slate-800'
        }`}
      >
        <Store className={`w-5 h-5 ${activeTab === 'products' ? 'text-emerald-600 scale-110' : ''} transition-transform`} />
        <span className="text-[11px] mt-0.5">{t.products || 'Mahsulotlar'}</span>
      </button>

      <button
        onClick={() => handleTabClick('branches')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all relative cursor-pointer ${
          activeTab === 'branches'
            ? 'text-sky-700 font-bold bg-sky-50'
            : 'text-slate-500 font-medium hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <MapPin className={`w-5 h-5 ${activeTab === 'branches' ? 'text-sky-600 scale-110' : ''} transition-transform`} />
          {branchesCount > 0 && (
            <span className="absolute -top-1 -right-2 text-[9px] bg-sky-600 text-white font-bold px-1 rounded-full leading-none py-0.5">
              {branchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5">{t.branches || 'Filiallar'}</span>
      </button>

      <button
        onClick={() => handleTabClick('news')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all relative cursor-pointer ${
          activeTab === 'news'
            ? 'text-amber-700 font-bold bg-amber-50'
            : 'text-slate-500 font-medium hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <Newspaper className={`w-5 h-5 ${activeTab === 'news' ? 'text-amber-600 scale-110' : ''} transition-transform`} />
          {newsCount > 0 && (
            <span className="absolute -top-1 -right-2 text-[9px] bg-amber-500 text-white font-bold px-1 rounded-full leading-none py-0.5">
              {newsCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5">{t.news || 'Yangiliklar'}</span>
      </button>
    </nav>
  );
};
