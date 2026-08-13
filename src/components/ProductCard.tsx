import React, { useState } from 'react';
import { Product, Branch } from '../types';
import { soundFx } from '../lib/sound';
import { db, doc, updateDoc, increment } from '../lib/firebase';
import { Translations, Language, getLocalizedCategory } from '../lib/i18n';
import { MapPin, ShoppingBag, Eye, Heart, ThumbsUp, Flame, AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  branchMap: Record<string, Branch>;
  onOpenDetail: (product: Product) => void;
  onOpenChatWithProduct: (productName: string) => void;
  t?: Translations;
  lang?: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  branchMap,
  onOpenDetail,
  onOpenChatWithProduct,
  t,
  lang = 'uz'
}) => {
  const [imageError, setImageError] = useState(false);
  const [reactingEmoji, setReactingEmoji] = useState<string | null>(null);

  const branch = branchMap[product.branchId];
  const inStock = product.quantity > 0;

  // React to product with emojis (❤️, 👍, 🔥)
  const handleReaction = async (e: React.MouseEvent, emoji: string) => {
    e.stopPropagation();
    soundFx.playClick('pop');
    setReactingEmoji(emoji);
    setTimeout(() => setReactingEmoji(null), 400);

    try {
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        [`reactions.${emoji}`]: increment(1)
      });
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  const currencyStr = t?.currency || "so'm";
  const formattedPrice = `${new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ').format(product.price)} ${currencyStr}`;

  const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

  const productImages = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);
  const mainImage = productImages[0] || fallbackImage;
  const imageCount = productImages.length;

  const localizedCategory = getLocalizedCategory(product.category, lang as Language);

  return (
    <div 
      onClick={() => {
        soundFx.playClick('click');
        onOpenDetail(product);
      }}
      className="group bg-white rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100/90 overflow-hidden flex items-center justify-center p-2">
        {/* Soft Background Blurred Layer for Aesthetics */}
        <img
          src={imageError ? fallbackImage : mainImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
        />
        {/* Main Product Image - Full Uncropped View */}
        <img
          src={imageError ? fallbackImage : mainImage}
          alt={product.name}
          onError={() => setImageError(true)}
          className="relative z-1 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
        />

        {/* Multi-Picture Indicator Badge */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold shadow-md border border-white/20">
              <Layers className="w-3 h-3 text-emerald-400" />
              {imageCount} {t?.imageCountBadge || "ta rasm"}
            </span>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-extrabold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
              {t?.inStockQty || "Mavjud"} ({product.quantity})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md border border-amber-300 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-900" />
              {t?.restockingBadge || "Yo'lda / Restocking"}
            </span>
          )}
        </div>

        {/* Branch Location Badge */}
        {branch && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-sky-400" />
              {branch.name}
            </span>
          </div>
        )}

        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-bold shadow-xs">
              {localizedCategory}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base group-hover:text-emerald-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Primary Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
              {t?.priceLabel || "Narxi"}
            </span>
            <span className="text-lg font-black text-emerald-700">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick('chime');
              onOpenChatWithProduct(product.name);
            }}
            className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            title={t?.askAvailability || "Sotuvchiga so'rov yuborish"}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t?.quickInquiry || "So'rash"}</span>
          </button>
        </div>

        {/* Emoji Reactions Toolbar */}
        <div className="pt-2 flex items-center justify-between bg-slate-50/80 p-2 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 pl-1">
            ❤️ 👍 🔥
          </span>

          <div className="flex items-center gap-1.5">
            {/* ❤️ Heart */}
            <button
              onClick={(e) => handleReaction(e, '❤️')}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-rose-100 hover:bg-rose-50 text-xs transition-transform active:scale-125 ${
                reactingEmoji === '❤️' ? 'scale-125 bg-rose-100' : ''
              }`}
            >
              <span className="text-sm">❤️</span>
              <span className="text-[11px] font-bold text-rose-600">
                {product.reactions?.['❤️'] || 0}
              </span>
            </button>

            {/* 👍 Like */}
            <button
              onClick={(e) => handleReaction(e, '👍')}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-sky-100 hover:bg-sky-50 text-xs transition-transform active:scale-125 ${
                reactingEmoji === '👍' ? 'scale-125 bg-sky-100' : ''
              }`}
            >
              <span className="text-sm">👍</span>
              <span className="text-[11px] font-bold text-sky-600">
                {product.reactions?.['👍'] || 0}
              </span>
            </button>

            {/* 🔥 Fire */}
            <button
              onClick={(e) => handleReaction(e, '🔥')}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-amber-100 hover:bg-amber-50 text-xs transition-transform active:scale-125 ${
                reactingEmoji === '🔥' ? 'scale-125 bg-amber-100' : ''
              }`}
            >
              <span className="text-sm">🔥</span>
              <span className="text-[11px] font-bold text-amber-600">
                {product.reactions?.['🔥'] || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
