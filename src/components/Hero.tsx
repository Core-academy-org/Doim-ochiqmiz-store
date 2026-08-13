import React from 'react';
import { SiteSettings, Branch } from '../types';
import { soundFx } from '../lib/sound';
import { Translations } from '../lib/i18n';
import { ShoppingBag, MapPin, Sparkles, Clock } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  productCount: number;
  t?: Translations;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  branches,
  selectedBranchId,
  onSelectBranch,
  productCount,
  t
}) => {
  const tagline = t?.heroTagline || settings.headerTagline || "Filiallar real vaqt ombor tizimi";
  const title = t?.heroTitle || settings.siteTitle || "Doim ochiqmiz";
  const subtitle = t?.heroSubtitle || settings.siteSubtitle || "Do'konga kelishdan oldin narx va mavjudlikni bilib oling";
  const notice = t?.heroNoticeText || settings.heroNotice || "Xaridlaringizni rejalashtiring! Bizning barcha filiallarimizdagi mahsulotlar qoldig'i, narxlari va mavjudligi soniyalar ichida yangilanib turadi.";

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-sky-50/40 to-white py-10 px-4 sm:px-6 lg:px-8 border-b border-emerald-100/60">
      {/* Decorative soothing ambient circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Title & Dynamic Text Content */}
          <div className="lg:col-span-8 text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>{tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              {title} -{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-600">
                {subtitle}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {notice}
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl shadow-xs border border-emerald-100 text-xs font-semibold text-slate-700">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>{t?.availableProductsCount || "Mavjud mahsulotlar"}: <strong className="text-emerald-700">{productCount}</strong></span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl shadow-xs border border-sky-100 text-xs font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{t?.locationsCount || "Filiallar joylashuvi"}: <strong className="text-sky-700">{branches.length}</strong></span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl shadow-xs border border-amber-100 text-xs font-semibold text-slate-700">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{settings.workingHoursNotice || "Har kuni 24/7"}</span>
              </div>
            </div>
          </div>

          {/* Branch Quick Selector Cards / Pills */}
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-xs p-5 rounded-3xl border border-emerald-100/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {t?.selectBranchPrompt || "Filialni tanlang"}
              </h3>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Real-Vaqt
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Qaysi filialdagi narxlar va qoldiq ma'lumotlarini ko'rmoqchisiz?
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  soundFx.playClick('pop');
                  onSelectBranch('all');
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                  selectedBranchId === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50/50 text-slate-700 border-emerald-100 hover:bg-emerald-100/50'
                }`}
              >
                <span>{t?.allBranchesOption || "Barcha filiallar bo'yicha"}</span>
                <span className="text-[10px] opacity-80">✓</span>
              </button>

              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    soundFx.playClick('pop');
                    onSelectBranch(b.id);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                    selectedBranchId === b.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                  }`}
                >
                  <span className="truncate pr-2">📍 {b.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {b.phone ? b.phone : 'Faol'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
