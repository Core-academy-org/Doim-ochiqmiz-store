import React, { useState } from 'react';
import { Logo } from './Logo';
import { Branch } from '../types';
import { soundFx } from '../lib/sound';
import { Language, Translations } from '../lib/i18n';
import { 
  Store, 
  Lock, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Newspaper, 
  Menu, 
  X,
  MapPin,
  Clock,
  Globe
} from 'lucide-react';

interface HeaderProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  contactPhone?: string;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminPanel: () => void;
  activeTab: 'products' | 'branches' | 'news';
  setActiveTab: (tab: 'products' | 'branches' | 'news') => void;
  unreadChatCount?: number;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  t: Translations;
}

export const Header: React.FC<HeaderProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  contactPhone = "+998 90 123 45 67",
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminPanel,
  activeTab,
  setActiveTab,
  unreadChatCount = 0,
  lang,
  onLanguageChange,
  t
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundFx.setMuted(newMuted);
    if (!newMuted) soundFx.playClick('chime');
  };

  const handleTabClick = (tab: 'products' | 'branches' | 'news') => {
    soundFx.playClick('click');
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    soundFx.playClick('pop');
    onSelectBranch(e.target.value);
  };

  const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    soundFx.playClick('click');
    onLanguageChange(e.target.value as Language);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>{t.topNotice}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-50">
            <a 
              href="https://maps.app.goo.gl/pi9sxPeSN8Mv5Hoe8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick('click')}
              className="hover:underline flex items-center gap-1 font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>{t.mainStoreMapBtn || "Asosiy Do'kon Xaritasi"} 📍</span>
            </a>
            <a 
              href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
              onClick={() => soundFx.playClick('click')}
              className="hover:underline flex items-center gap-1 font-semibold text-amber-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{contactPhone}</span>
            </a>
            <span className="hidden md:inline-block">|</span>
            <span className="hidden md:flex items-center gap-1 text-sky-100">
              <Clock className="w-3.5 h-3.5" /> {t.service247}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleTabClick('products')}>
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/60 p-1.5 rounded-2xl border border-emerald-100">
            <button
              onClick={() => handleTabClick('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-100/50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t.products}</span>
            </button>

            <button
              onClick={() => handleTabClick('branches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'branches'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-sky-100/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.branches}</span>
              {branches.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'branches' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-800'
                }`}>
                  {branches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('news')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'news'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-100/50'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>{t.news}</span>
            </button>
          </nav>

          {/* Branch Quick Select & Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-sky-600 absolute left-3 pointer-events-none" />
              <select
                value={lang}
                onChange={handleLangSelect}
                className="pl-9 pr-7 py-2 text-xs font-bold bg-sky-50 border border-sky-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer hover:bg-sky-100/70 transition-colors uppercase"
              >
                <option value="uz">🇺🇿 O'zbek</option>
                <option value="en">🇬🇧 English</option>
                <option value="ru">🇷🇺 Русский</option>
              </select>
            </div>

            {/* Branch Dropdown Selector */}
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
              <select
                value={selectedBranchId}
                onChange={handleBranchChange}
                className="pl-9 pr-8 py-2 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-emerald-100/60 transition-colors"
              >
                <option value="all">{t.allBranches}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    📍 {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-slate-100 border-slate-200 text-slate-400' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Admin Panel Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  soundFx.playClick('success');
                  onOpenAdminPanel();
                }}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.adminPanel}</span>
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {unreadChatCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playClick('click');
                  onOpenAdminLogin();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold transition-all border border-emerald-200"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.adminLogin}</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <select
              value={lang}
              onChange={handleLangSelect}
              className="px-2 py-1.5 text-xs font-bold bg-sky-50 border border-sky-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="uz">🇺🇿 UZ</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
            </select>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border ${
                isMuted ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminPanel}
                className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                <Lock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="p-2 bg-slate-100 text-slate-700 rounded-xl text-xs"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick('pop');
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleTabClick('products')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
                activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Store className="w-5 h-5" />
              <span>{t.products}</span>
            </button>

            <button
              onClick={() => handleTabClick('branches')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
                activeTab === 'branches' ? 'bg-sky-600 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>{t.branches}</span>
            </button>

            <button
              onClick={() => handleTabClick('news')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
                activeTab === 'news' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <Newspaper className="w-5 h-5" />
              <span>{t.news}</span>
            </button>
          </div>

          {/* Branch Select Mobile */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              {t.allBranches}:
            </label>
            <select
              value={selectedBranchId}
              onChange={handleBranchChange}
              className="w-full p-2.5 text-sm bg-emerald-50 border border-emerald-200 rounded-xl text-slate-800 font-semibold"
            >
              <option value="all">{t.allBranches}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  📍 {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};

