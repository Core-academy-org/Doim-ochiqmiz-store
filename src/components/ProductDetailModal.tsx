import React, { useState } from 'react';
import { Product, Branch } from '../types';
import { soundFx } from '../lib/sound';
import { Translations, Language, getLocalizedCategory } from '../lib/i18n';
import { X, MapPin, CheckCircle2, Clock, MessageSquare, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  branchMap: Record<string, Branch>;
  onClose: () => void;
  onOpenChatWithProduct: (productName: string) => void;
  t?: Translations;
  lang?: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  branchMap,
  onClose,
  onOpenChatWithProduct,
  t,
  lang = 'uz'
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);
  const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
  const currentImageUrl = productImages[activeImageIndex] || productImages[0] || fallbackImage;

  const branch = branchMap[product.branchId];
  const inStock = product.quantity > 0;
  
  const currencyStr = t?.currency || "so'm";
  const formattedPrice = `${new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ').format(product.price)} ${currencyStr}`;

  const localizedCategory = getLocalizedCategory(product.category, lang as Language);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick('click');
    setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick('click');
    setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick('pop');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Image Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-slate-100/90 rounded-2xl overflow-hidden group flex items-center justify-center p-2">
              <img
                src={currentImageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-110 pointer-events-none"
              />
              <img
                src={currentImageUrl}
                alt={product.name}
                className="relative z-1 w-full h-full object-contain transition-all duration-300 drop-shadow-md"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t?.inStockQty || "Mavjud"} ({product.quantity})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-bold shadow-md">
                    <Clock className="w-3.5 h-3.5" /> {t?.restockingBadge || "Yo'lda / Restocking"}
                  </span>
                )}
              </div>

              {/* Gallery Counter */}
              {productImages.length > 1 && (
                <div className="absolute top-3 right-14 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>{activeImageIndex + 1} / {productImages.length} {t?.imageCountBadge || "rasm"}</span>
                </div>
              )}

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-all shadow-md opacity-90 hover:scale-110"
                    title="Oldingi rasm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-all shadow-md opacity-90 hover:scale-110"
                    title="Keyingi rasm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playClick('click');
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                {localizedCategory}
              </span>
              {branch && (
                <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {branch.name}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-800">
              {product.name}
            </h2>

            <div className="text-3xl font-extrabold text-emerald-700 pt-1">
              {formattedPrice}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Tavsif / Ma'lumot:</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Branch Availability Card */}
          {branch && (
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-2">
              <h4 className="text-xs font-bold text-sky-800 uppercase flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" /> Filial Haqida:
              </h4>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Manzil:</strong> {branch.address}</p>
                {branch.phone && <p><strong>Telefon:</strong> {branch.phone}</p>}
                {branch.workingHours && <p><strong>Ish vaqti:</strong> {branch.workingHours}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick('chime');
                onClose();
                onOpenChatWithProduct(product.name);
              }}
              className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t?.startChatBtn || "Sotuvchi bilan bog'lanish (Chat)"}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick('pop');
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-semibold transition-all"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
