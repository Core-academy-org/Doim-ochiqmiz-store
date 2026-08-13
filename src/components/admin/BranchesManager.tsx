import React, { useState, useEffect } from 'react';
import { Branch, SiteSettings } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from '../../lib/firebase';
import { soundFx } from '../../lib/sound';
import { MAIN_STORE_GOOGLE_MAP_URL } from '../../lib/i18n';
import { Plus, Edit2, Trash2, MapPin, Phone, Clock, Navigation, Map, X, Store, Save, CheckCircle2 } from 'lucide-react';

interface BranchesManagerProps {
  branches: Branch[];
  settings?: SiteSettings;
}

export const BranchesManager: React.FC<BranchesManagerProps> = ({ branches, settings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Main Store State
  const [mainStoreName, setMainStoreName] = useState(settings?.mainStoreBranchName || "Bosh Filial (Markaziy Do'kon)");
  const [mainStoreAddress, setMainStoreAddress] = useState(settings?.mainStoreAddress || "Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy");
  const [mainStoreMapUrl, setMainStoreMapUrl] = useState(settings?.mainStoreMapUrl || MAIN_STORE_GOOGLE_MAP_URL);
  const [mainStorePhone, setMainStorePhone] = useState(settings?.contactPhone || "+998 90 123 45 67");
  const [mainStoreWorkingHours, setMainStoreWorkingHours] = useState(settings?.workingHoursNotice || "Har kuni 08:00 - 22:00");
  const [mainStoreSavedSuccess, setMainStoreSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setMainStoreName(settings.mainStoreBranchName || "Bosh Filial (Markaziy Do'kon)");
      setMainStoreAddress(settings.mainStoreAddress || "Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy");
      setMainStoreMapUrl(settings.mainStoreMapUrl || MAIN_STORE_GOOGLE_MAP_URL);
      setMainStorePhone(settings.contactPhone || "+998 90 123 45 67");
      setMainStoreWorkingHours(settings.workingHoursNotice || "Har kuni 08:00 - 22:00");
    }
  }, [settings]);

  const handleSaveMainStore = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick('success');

    const updatedSettings: SiteSettings = {
      ...(settings || {
        heroNotice: "Do'konga kelishdan oldin narx va mavjudlikni ko'ring",
        headerTagline: "Filiallar real vaqt ombor tizimi"
      }),
      mainStoreBranchName: mainStoreName.trim(),
      mainStoreAddress: mainStoreAddress.trim(),
      mainStoreMapUrl: mainStoreMapUrl.trim(),
      contactPhone: mainStorePhone.trim(),
      workingHoursNotice: mainStoreWorkingHours.trim()
    };

    try {
      await setDoc(doc(db, 'siteSettings', 'config'), updatedSettings);
      setMainStoreSavedSuccess(true);
      setTimeout(() => setMainStoreSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving main store settings:", err);
    }
  };

  // Branch Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number | ''>(41.31108);
  const [lng, setLng] = useState<number | ''>(69.24056);
  const [workingHours, setWorkingHours] = useState('08:00 - 22:00');
  const [mapUrl, setMapUrl] = useState('');

  const resetForm = () => {
    setName('');
    setAddress('');
    setPhone('');
    setLat(41.31108);
    setLng(69.24056);
    setWorkingHours('08:00 - 22:00');
    setMapUrl('');
    setIsAdding(false);
    setEditingBranch(null);
  };

  const handleStartEdit = (b: Branch) => {
    soundFx.playClick('click');
    setEditingBranch(b);
    setName(b.name);
    setAddress(b.address);
    setPhone(b.phone || '');
    setLat(b.lat || 41.31108);
    setLng(b.lng || 69.24056);
    setWorkingHours(b.workingHours || '08:00 - 22:00');
    setMapUrl(b.mapUrl || '');
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playClick('success');

    const branchData = {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      lat: Number(lat) || 41.31108,
      lng: Number(lng) || 69.24056,
      workingHours: workingHours.trim(),
      mapUrl: mapUrl.trim(),
      createdAt: editingBranch?.createdAt || new Date().toISOString()
    };

    try {
      if (editingBranch) {
        await updateDoc(doc(db, 'branches', editingBranch.id), branchData);
      } else {
        await addDoc(collection(db, 'branches'), branchData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving branch:", err);
    }
  };

  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePromptDelete = (b: Branch) => {
    soundFx.playClick('click');
    setBranchToDelete(b);
  };

  const handleConfirmDelete = async () => {
    if (!branchToDelete) return;
    setIsDeleting(true);
    soundFx.playClick('pop');

    try {
      await deleteDoc(doc(db, 'branches', branchToDelete.id));
      setBranchToDelete(null);
    } catch (err) {
      console.error("Error deleting branch:", err);
      alert("Filialni o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bosh Do'kon (Main Store) Sozlamalari Card */}
      <form onSubmit={handleSaveMainStore} className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 rounded-3xl border border-sky-400/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-400/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-white text-base flex items-center gap-2">
                Asosiy Do'kon (Bosh Filial) va Google Maps Sozlamalari
              </h4>
              <p className="text-xs text-slate-300">
                Ushbu ma'lumotlar bosh sahifadagi interaktiv xaritada va barcha mijozlarga real vaqtda aks etadi
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {mainStoreSavedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Saqlandi!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Saqlash</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-800">
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-400" /> Google Maps Link (Xarita Havolasi):
            </label>
            <input
              type="url"
              required
              placeholder="https://maps.app.goo.gl/..."
              value={mainStoreMapUrl}
              onChange={(e) => setMainStoreMapUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-mono text-emerald-300 bg-slate-950/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" /> Bosh Filial Nomi:
            </label>
            <input
              type="text"
              required
              value={mainStoreName}
              onChange={(e) => setMainStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-white bg-slate-950/80 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Bosh Filial Manzili:
            </label>
            <input
              type="text"
              required
              value={mainStoreAddress}
              onChange={(e) => setMainStoreAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-white/20 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none text-white bg-slate-950/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-400" /> Telefon Raqami:
            </label>
            <input
              type="text"
              required
              value={mainStorePhone}
              onChange={(e) => setMainStorePhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-white/20 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none text-white bg-slate-950/80"
            />
          </div>
        </div>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">
            Filiallar Boshqaruvi
          </h3>
          <p className="text-xs text-slate-500">
            Do'kon filiallarini qo'shish, ularning geo-koordinatalari hamda telefon raqamlarini boshqarish.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              soundFx.playClick('click');
              resetForm();
              setIsAdding(true);
            }}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Filial Qo'shish</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border-2 border-sky-200 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              {editingBranch ? "Filialni Tahrirlash" : "Yangi Filial Joylashuvini Kiritish"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Filial Nomi:
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Chilonzor Filiali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aniq Manzil:
              </label>
              <input
                type="text"
                placeholder="Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bog'lanish Telefoni:
              </label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ish Vaqti:
              </label>
              <input
                type="text"
                placeholder="08:00 - 22:00 (Dam olish kunlarisiz)"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kenglik (Latitude - Google/Yandex):
              </label>
              <input
                type="number"
                step="0.00001"
                placeholder="41.31108"
                value={lat}
                onChange={(e) => setLat(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Uzoqlik (Longitude - Google/Yandex):
              </label>
              <input
                type="number"
                step="0.00001"
                placeholder="69.24056"
                value={lng}
                onChange={(e) => setLng(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Maps / Yandex Custom Direct URL (Ixtiyoriy):
            </label>
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold"
            >
              {editingBranch ? "Saqlash" : "Qo'shish"}
            </button>
          </div>
        </form>
      )}

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-slate-400 rounded-3xl border border-dashed border-slate-300">
            Hozircha filiallar yo'q. Avval filial kiritishingiz mumkin.
          </div>
        ) : (
          branches.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      📍
                    </span>
                    {b.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-600">{b.address}</p>
                {b.phone && <p className="text-xs font-semibold text-emerald-700">📞 {b.phone}</p>}
                {b.workingHours && <p className="text-xs text-amber-700">⏰ {b.workingHours}</p>}
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {b.lat}, {b.lng}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(b)}
                    className="p-1.5 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 rounded-lg"
                    title="Tahrirlash"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePromptDelete(b)}
                    className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {branchToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg">
                Filialni O'chirish
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Haqiqatan ham <strong className="text-slate-800">{branchToDelete.name}</strong> filialini o'chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {isDeleting ? "O'chirilmoqda..." : "Ha, O'chirilsin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
