import React, { useState } from 'react';
import { Product, Branch } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, doc } from '../../lib/firebase';
import { soundFx } from '../../lib/sound';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Package, 
  MapPin, 
  Sparkles, 
  Upload, 
  ImagePlus, 
  Star, 
  Link as LinkIcon, 
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ProductsManagerProps {
  products: Product[];
  branches: Branch[];
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ products, branches }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [branchId, setBranchId] = useState('');
  const [category, setCategory] = useState('Mevalar & Sabzavotlar');
  const [description, setDescription] = useState('');

  // Multi-image state
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Sample quick image presets for seller's convenience
  const sampleImages = [
    { label: 'Olma (Qizil)', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { label: 'Banan', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Uzum', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sut Maxsuloti', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Non & Yopgan', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sharbat', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80' }
  ];

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setBranchId(branches[0]?.id || '');
    setCategory('Mevalar & Sabzavotlar');
    setDescription('');
    setImages([]);
    setUrlInput('');
    setIsAdding(false);
    setEditingProduct(null);
  };

  const handleStartEdit = (p: Product) => {
    soundFx.playClick('click');
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);
    setBranchId(p.branchId);
    setCategory(p.category || 'Mevalar & Sabzavotlar');
    setDescription(p.description || '');

    const existingImages = p.images && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []);
    setImages(existingImages);
    setIsAdding(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    soundFx.playClick('click');

    const fileList: File[] = Array.from(files);
    const readPromises = fileList.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const img = new Image();
          img.src = result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressedDataUrl);
          };
          img.onerror = () => resolve(result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
      setUploading(false);
      soundFx.playClick('chime');
    });

    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    soundFx.playClick('click');
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleSetPrimary = (index: number) => {
    soundFx.playClick('click');
    setImages((prev) => {
      const item = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [item, ...rest];
    });
  };

  const handleRemoveImage = (index: number) => {
    soundFx.playClick('pop');
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick('click');
    setImages((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price === '' || quantity === '') return;

    soundFx.playClick('success');

    const finalImages = images.length > 0 ? images : [sampleImages[0].url];
    const primaryImage = finalImages[0];

    const productData = {
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      branchId: branchId || (branches[0]?.id || 'default'),
      imageUrl: primaryImage,
      images: finalImages,
      category: category.trim(),
      description: description.trim(),
      reactions: editingProduct?.reactions || { '❤️': 0, '👍': 0, '🔥': 0 },
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Haqiqatan ham ushbu mahsulotni o'chirib tashlamoqchimisiz?")) return;
    soundFx.playClick('pop');

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">
            Mahsulotlar Boshqaruvi
          </h3>
          <p className="text-xs text-slate-500">
            Filiallar uchun yangi tovar va rasmlar yuklash, narxlar va qoldiq mahlsuot sonini real-vaqt rejimida boshqarish.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              soundFx.playClick('click');
              resetForm();
              setBranchId(branches[0]?.id || '');
              setIsAdding(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Mahsulot Qo'shish</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal/Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Kiritish"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mahsulot Nomi:
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Namangan Shirin Olmasi (1 kg)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategoriya:
              </label>
              <input
                type="text"
                placeholder="Mevalar, Sabzavotlar, Ichimliklar, Sut mahsulotlari"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Narxi (So'mda):
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Qoldiq Soni (Dona / Kg / Quti):
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="15 (0 bo'lsa 'Yo'lda / Restocking' deb ko'rinadi)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Qaysi Filialda Mavjud:
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
              >
                {branches.length === 0 && (
                  <option value="">(Hozircha filiallar yo'q, avval filial qo'shing)</option>
                )}
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    📍 {b.name} ({b.address})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MULTI-PICTURE UPLOAD & GALLERY SECTION */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <ImagePlus className="w-4 h-4 text-emerald-600" />
                  Mahsulot Rasmlari (Bir nechta rasm yuklash mumkin)
                </label>
                <p className="text-[11px] text-slate-500">
                  Kompyuter yoki telefondan rasm fayllarini yuklang, havolasini kiriting yoki namunalardan tanlang.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full w-fit">
                {images.length} ta rasm yuklangan
              </span>
            </div>

            {/* Upload & URL Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Device File Upload */}
              <label className="relative flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-emerald-100/50 text-emerald-800 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer transition-all text-xs font-bold shadow-xs group">
                <Upload className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>{uploading ? "Rasm tayyorlanmoqda..." : "Fayllarni tanlash (Galereyadan)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Rasm web havolasi (https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Qo'shish</span>
                </button>
              </div>
            </div>

            {/* Preset Image Bar */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                Tezkor rasm namunasini galereyaga qo'shish:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundFx.playClick('click');
                      setImages((prev) => [...prev, img.url]);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-slate-700 text-[11px] rounded-lg border border-slate-200 shadow-2xs transition-all font-medium"
                  >
                    🖼️ + {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Gallery Grid */}
            {images.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-emerald-100">
                <span className="text-xs font-bold text-slate-700 block">
                  Yuklangan Rasmlar Galereyasi (1-rasm asosiy hisoblanadi):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgSrc, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`relative group bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-xs ${
                          isPrimary ? 'border-emerald-500 ring-2 ring-emerald-300/50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`Product preview ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />

                        {/* Primary Badge */}
                        {isPrimary ? (
                          <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            <span>Asosiy</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Asosiy qilish
                          </button>
                        )}

                        {/* Order & Delete Controls Overlay */}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'up')}
                              className="p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md text-[10px]"
                              title="Oldinga surish"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                          )}
                          {idx < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'down')}
                              className="p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md text-[10px]"
                              title="Keyinga surish"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md shadow-xs"
                            title="Rasmni o'chirish"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="p-1 text-center bg-slate-50 text-[10px] text-slate-500 font-mono">
                          {idx + 1}-rasm
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/80 rounded-xl text-center text-xs text-slate-400 border border-slate-200">
                Hali rasmlar biriktirilmadi. Yuqoridagi "Fayllarni tanlash" tugmasi orqali rasm faylini yuklang.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Qisqacha Tavsif:
            </label>
            <textarea
              rows={2}
              placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
            >
              {editingProduct ? "Saqlash" : "Qo'shish"}
            </button>
          </div>
        </form>
      )}

      {/* Products Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 text-sm">Hozircha mahsulotlar kiritilmagan.</p>
            <p className="text-xs">
              Yuqoridagi "Yangi Mahsulot Qo'shish" tugmasini bosing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                  <th className="p-4">Rasm & Mahsulot</th>
                  <th className="p-4">Filial</th>
                  <th className="p-4">Narxi</th>
                  <th className="p-4">Qoldiq (Mavjudlik)</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const br = branches.find((b) => b.id === p.branchId);
                  const inStock = p.quantity > 0;
                  const imageCount = p.images?.length || (p.imageUrl ? 1 : 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80"}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                          />
                          {imageCount > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                              <Layers className="w-2.5 h-2.5" />
                              {imageCount}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{p.category || "Umumiy"}</span>
                            {imageCount > 1 && (
                              <span className="text-emerald-700 font-semibold">• {imageCount} ta rasm</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" />
                          {br?.name || "Barcha filiallar"}
                        </span>
                      </td>

                      <td className="p-4 font-black text-emerald-700 text-sm">
                        {new Intl.NumberFormat('uz-UZ').format(p.price)} so'm
                      </td>

                      <td className="p-4">
                        {inStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Mavjud ({p.quantity} ta)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                            Yo'lda / Restocking
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-xl transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

