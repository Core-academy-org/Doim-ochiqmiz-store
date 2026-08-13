import React from 'react';
import { Branch } from '../types';
import { soundFx } from '../lib/sound';
import { Translations, MAIN_STORE_GOOGLE_MAP_URL } from '../lib/i18n';
import { MainStoreMapCard } from './MainStoreMapCard';
import { MapPin, Phone, Clock, ExternalLink, Navigation, Store } from 'lucide-react';

interface BranchListProps {
  branches: Branch[];
  onSelectBranchFilter: (branchId: string) => void;
  t: Translations;
}

export const BranchList: React.FC<BranchListProps> = ({ branches, onSelectBranchFilter, t }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Featured Main Store Google Map Banner */}
      <MainStoreMapCard t={t} />

      {/* Branch List Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span>{t.branches}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          {t.allBranches}
        </h2>
        <p className="text-sm text-slate-600">
          O'zingizga yaqin filialni tanlang, xaritada manzilni ko'ring yoki to'g'ridan-to'g'ri navigatsiyani yoqing!
        </p>
      </div>

      {branches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-sky-200 max-w-md mx-auto space-y-3">
          <Store className="w-12 h-12 text-sky-400 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Filiallar Hali Qo'shilmagan</h3>
          <p className="text-xs text-slate-500">
            Admin panel orqali yangi filial joylashuvlarini kiriting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => {
            const googleMapUrl = b.mapUrl || MAIN_STORE_GOOGLE_MAP_URL;
            const yandexMapUrl = b.lat && b.lng ? `https://yandex.com/maps/?pt=${b.lng},${b.lat}&z=16&l=map` : MAIN_STORE_GOOGLE_MAP_URL;

            return (
              <div 
                key={b.id} 
                className="bg-white rounded-3xl border border-sky-100/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        📍
                      </span>
                      {b.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{b.address || "Manzil ko'rsatilmagan"}</span>
                    </div>

                    {b.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                        <a 
                          href={`tel:${b.phone.replace(/\s+/g, '')}`} 
                          onClick={() => soundFx.playClick('click')}
                          className="hover:underline font-semibold text-emerald-700"
                        >
                          {b.phone}
                        </a>
                      </div>
                    )}

                    {b.workingHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Ish vaqti: {b.workingHours}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Coordinates & Interactive Map Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playClick('click')}
                      className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-sky-100"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600" />
                      <span>Google Maps</span>
                    </a>

                    <a
                      href={yandexMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playClick('click')}
                      className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                      <span>Navigatsiya</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick('chime');
                      onSelectBranchFilter(b.id);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Ushbu Filial Mahsulotlarini Ko'rish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
