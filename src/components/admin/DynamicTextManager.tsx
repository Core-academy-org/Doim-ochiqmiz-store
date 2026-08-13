import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { db, doc, setDoc } from '../../lib/firebase';
import { soundFx } from '../../lib/sound';
import { Type, Save, CheckCircle, Phone, Clock, FileText, Sparkles } from 'lucide-react';

interface DynamicTextManagerProps {
  settings: SiteSettings;
}

export const DynamicTextManager: React.FC<DynamicTextManagerProps> = ({ settings }) => {
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle || 'Doim ochiqmiz');
  const [siteSubtitle, setSiteSubtitle] = useState(settings.siteSubtitle || 'Real vaqt mahsulot va narx portali');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '+998 90 123 45 67');
  const [heroNotice, setHeroNotice] = useState(settings.heroNotice || "Do'konga kelishdan oldin narx va mavjudlikni ko'ring");
  const [workingHoursNotice, setWorkingHoursNotice] = useState(settings.workingHoursNotice || 'Har kuni 08:00 - 22:00');
  const [headerTagline, setHeaderTagline] = useState(settings.headerTagline || "Filiallar real vaqt ombor tizimi");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSiteTitle(settings.siteTitle || 'Doim ochiqmiz');
    setSiteSubtitle(settings.siteSubtitle || 'Real vaqt mahsulot va narx portali');
    setContactPhone(settings.contactPhone || '+998 90 123 45 67');
    setHeroNotice(settings.heroNotice || "Do'konga kelishdan oldin narx va mavjudlikni ko'ring");
    setWorkingHoursNotice(settings.workingHoursNotice || 'Har kuni 08:00 - 22:00');
    setHeaderTagline(settings.headerTagline || "Filiallar real vaqt ombor tizimi");
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick('success');

    const updatedSettings: SiteSettings = {
      siteTitle,
      siteSubtitle,
      contactPhone,
      heroNotice,
      workingHoursNotice,
      headerTagline
    };

    try {
      await setDoc(doc(db, 'siteSettings', 'config'), updatedSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving site settings:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-600" />
            Dinamik Matnlar va Aloqa Raqamlari Boshqaruvi
          </h3>
          <p className="text-xs text-slate-500">
            Kodni o'zgartirmasdan sayt sarlavhalari, tavsiflar va telefon raqamlarini birzumda yangilang.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Saqlandi!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sayt Asosiy Sarlavhasi (Title):
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quyi Sarlavha (Sub-headline):
            </label>
            <input
              type="text"
              required
              value={siteSubtitle}
              onChange={(e) => setSiteSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Markaziy Aloqa Telefoni:
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Ish Vaqti Bildirishnomasi:
            </label>
            <input
              type="text"
              required
              value={workingHoursNotice}
              onChange={(e) => setWorkingHoursNotice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Yuqori Kichik Badge Belgisi:
            </label>
            <input
              type="text"
              value={headerTagline}
              onChange={(e) => setHeaderTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" /> Bosh Sahifa Banner E'loni (Hero Notice):
            </label>
            <textarea
              rows={3}
              value={heroNotice}
              onChange={(e) => setHeroNotice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>O'zgarishlarni Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
