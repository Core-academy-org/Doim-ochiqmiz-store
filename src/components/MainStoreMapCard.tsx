import React, { useState } from 'react';
import { Translations, MAIN_STORE_GOOGLE_MAP_URL } from '../lib/i18n';
import { soundFx } from '../lib/sound';
import { MapPin, Navigation, ExternalLink, Copy, Check, Store, Clock, Phone, Sparkles } from 'lucide-react';

interface MainStoreMapCardProps {
  t: Translations;
  phone?: string;
  workingHours?: string;
}

export const MainStoreMapCard: React.FC<MainStoreMapCardProps> = ({
  t,
  phone = "+998 90 123 45 67",
  workingHours = "24/7 Har kuni / 24 Hours Open"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    soundFx.playClick('chime');
    navigator.clipboard.writeText(`${t.mainStoreBranchName}: ${t.mainStoreAddress} - ${MAIN_STORE_GOOGLE_MAP_URL}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 relative overflow-hidden group">
      {/* Ambient background glow FX */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Info & Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mainStoreTitle}</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Store className="w-7 h-7 text-amber-400" />
              <span>{t.mainStoreBranchName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {t.mainStoreSubtitle}
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-200 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-medium">{t.mainStoreAddress}</span>
            </div>

            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5" /> {workingHours}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <Phone className="w-3.5 h-3.5" /> {phone}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={MAIN_STORE_GOOGLE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick('click')}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>{t.openGoogleMaps}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </a>

            <button
              onClick={handleCopyAddress}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{t.addressCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-300" />
                  <span>{t.copyAddress}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side Visual Map Frame */}
        <div className="lg:col-span-5 relative">
          <a
            href={MAIN_STORE_GOOGLE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick('click')}
            className="block relative rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-2xl group/map transform group-hover:scale-[1.02] transition-all duration-300 bg-slate-900"
          >
            {/* Map Preview Image / Decorative Pin */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="Google Map Main Store Location"
                className="w-full h-full object-cover opacity-80 group-hover/map:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/40"></div>

              {/* Central Map Pin Icon Pulse */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="relative flex items-center justify-center mb-2">
                  <span className="absolute w-12 h-12 rounded-full bg-emerald-500/50 animate-ping"></span>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white">
                    <MapPin className="w-7 h-7 fill-slate-950" />
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-950/90 text-white rounded-full text-[11px] font-black border border-emerald-400/50 backdrop-blur-md shadow-lg">
                  📍 {t.mainStoreBranchName}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold mt-1 bg-slate-900/80 px-2 py-0.5 rounded-md">
                  Google Maps Link Active
                </span>
              </div>
            </div>

            {/* Bottom Bar CTA */}
            <div className="p-3 bg-slate-950/90 backdrop-blur-md flex items-center justify-between text-xs border-t border-white/10">
              <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> maps.app.goo.gl/pi9sxPeSN8Mv5Hoe8
              </span>
              <span className="text-emerald-400 font-bold text-[11px] underline group-hover/map:text-emerald-300">
                {t.getDirections} &rarr;
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
