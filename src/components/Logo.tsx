import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 via-sky-100 to-amber-100 p-1 shadow-sm border border-emerald-200/60 flex items-center justify-center shrink-0 group hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-emerald-800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Soft Badge Circle */}
          <circle cx="50" cy="50" r="46" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
          <circle cx="50" cy="50" r="41" fill="#F0F9FF" />

          {/* Seller Figure (Body & Apron) */}
          <path d="M30 82C30 68 38 60 50 60C62 60 70 68 70 82" fill="#0284C7" />
          <path d="M42 60L40 82H60L58 60H42Z" fill="#FDE047" /> {/* Apron */}

          {/* Seller Head & Smiling Face */}
          <circle cx="50" cy="38" r="14" fill="#FDE68A" />
          {/* Hair */}
          <path d="M36 34C36 26 42 22 50 22C58 22 64 26 64 34C64 34 58 30 50 30C42 30 36 34 36 34Z" fill="#065F46" />
          {/* Cap / Visor */}
          <path d="M34 30C34 30 44 26 50 26C56 26 66 30 66 30L68 33H32L34 30Z" fill="#10B981" />
          {/* Eyes & Smile */}
          <circle cx="45" cy="38" r="1.5" fill="#064E3B" />
          <circle cx="55" cy="38" r="1.5" fill="#064E3B" />
          <path d="M46 43Q50 47 54 43" stroke="#064E3B" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Left Arm holding a Book / Ledger */}
          <path d="M32 64L20 54" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          {/* Book */}
          <rect x="10" y="44" width="14" height="18" rx="2" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" transform="rotate(-12 17 53)" />
          <path d="M14 46L22 48" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-12 17 53)" />
          <path d="M14 50L20 51.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-12 17 53)" />

          {/* Right Arm holding a Basket of Fruits */}
          <path d="M68 64L80 54" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          {/* Fruit Basket */}
          <path d="M72 52Q80 48 88 52L86 64Q80 68 74 64Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />
          {/* Fruits in Basket */}
          <circle cx="76" cy="49" r="4" fill="#EF4444" /> {/* Red Apple */}
          <circle cx="82" cy="48" r="4.5" fill="#FBBF24" /> {/* Yellow Fruit */}
          <circle cx="87" cy="51" r="3.5" fill="#10B981" /> {/* Green Pear */}
        </svg>

        {/* Live Status Badge Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-slate-800 font-sans">
              Doim <span className="text-emerald-600 underline decoration-amber-400 decoration-2 underline-offset-2">ochiqmiz</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700/80 tracking-wide uppercase">
            Jonli Mahsulot & Baha Portal
          </span>
        </div>
      )}
    </div>
  );
};
