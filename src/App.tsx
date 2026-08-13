/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { db, collection, doc, onSnapshot, query, orderBy, setDoc, addDoc } from './lib/firebase';
import { Product, Branch, SiteSettings, NewsItem, ChatSession } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductFilterBar } from './components/ProductFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BranchList } from './components/BranchList';
import { NewsSection } from './components/NewsSection';
import { CustomerChatWidget } from './components/CustomerChatWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { soundFx } from './lib/sound';
import { Language, translations, defaultCategories } from './lib/i18n';
import { ShoppingBag, Lock } from 'lucide-react';

export default function App() {
  // i18n Multi-language state
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('doim_ochiqmiz_lang') as Language) || 'uz';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('doim_ochiqmiz_lang', lang);
  };

  const t = translations[currentLang];

  // Real-time Firestore State Collections
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteTitle: 'Doim ochiqmiz',
    siteSubtitle: "Do'konga kelishdan oldin narx va mavjudlikni bilib oling",
    contactPhone: '+998 90 123 45 67',
    heroNotice: "Xaridlaringizni rejalashtiring! Bizning barcha filiallarimizdagi mahsulotlar qoldig'i, narxlari va mavjudligi soniyalar ichida yangilanib turadi.",
    workingHoursNotice: 'Har kuni 08:00 - 22:00',
    headerTagline: 'Filiallar real vaqt ombor tizimi'
  });
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Navigation & UI Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'branches' | 'news'>('products');

  // Customer Filters
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'none' | 'low-to-high' | 'high-to-low'>('none');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'restocking'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected Product Detail Modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Preset product inquiry for chat
  const [presetInquiryProduct, setPresetInquiryProduct] = useState<string | null>(null);

  // Admin Login & Panel State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('doim_ochiqmiz_admin_logged') === 'true';
  });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // 1. Subscribe to Firestore Real-time Collections
  useEffect(() => {
    // Products
    const qProducts = query(collection(db, 'products'));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(list);
    }, (err) => console.error("Firestore Products error:", err));

    // Branches
    const qBranches = query(collection(db, 'branches'));
    const unsubBranches = onSnapshot(qBranches, (snapshot) => {
      const list: Branch[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Branch);
      });
      setBranches(list);
    }, (err) => console.error("Firestore Branches error:", err));

    // Dynamic Text Settings
    const unsubSettings = onSnapshot(doc(db, 'siteSettings', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteSettings(snapshot.data() as SiteSettings);
      }
    }, (err) => console.error("Firestore Settings error:", err));

    // News
    const qNews = query(collection(db, 'news'));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      const list: NewsItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as NewsItem);
      });
      setNewsList(list);
    }, (err) => console.error("Firestore News error:", err));

    // Chats
    const qChats = query(collection(db, 'chats'));
    const unsubChats = onSnapshot(qChats, (snapshot) => {
      const list: ChatSession[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      setChatSessions(list);
    }, (err) => console.error("Firestore Chats error:", err));

    return () => {
      unsubProducts();
      unsubBranches();
      unsubSettings();
      unsubNews();
      unsubChats();
    };
  }, []);

  // Map of branch ID to branch details
  const branchMap = useMemo(() => {
    const map: Record<string, Branch> = {};
    branches.forEach((b) => {
      map[b.id] = b;
    });
    return map;
  }, [branches]);

  // Unique Categories list (combines predefined categories like Fruits, Sports, Kitchen with DB categories)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    defaultCategories.forEach((c) => cats.add(c));
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  // Filtered & Sorted Products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Branch filter
      if (selectedBranchId !== 'all' && p.branchId !== selectedBranchId) {
        return false;
      }
      // Search query (search in name, category, and description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !descMatch) {
          return false;
        }
      }
      // Category filter (exact, substring, or semantic match)
      if (selectedCategory !== 'all') {
        const catSelected = selectedCategory.toLowerCase().trim();
        const pCat = (p.category || '').toLowerCase().trim();
        
        const isExact = pCat === catSelected;
        const isSubstring = pCat.includes(catSelected) || catSelected.includes(pCat);
        const isSemantic =
          (catSelected.includes('meva') && (pCat.includes('meva') || pCat.includes('sabzavot') || pCat.includes('fruit') || pCat.includes('овощ') || pCat.includes('фрукт'))) ||
          (catSelected.includes('sport') && (pCat.includes('sport') || pCat.includes('mashq') || pCat.includes('спорт'))) ||
          (catSelected.includes('oshxona') && (pCat.includes('oshxona') || pCat.includes('pichoq') || pCat.includes('tova') || pCat.includes('kitchen') || pCat.includes('посуда') || pCat.includes('кухон'))) ||
          (catSelected.includes('ichimlik') && (pCat.includes('ichimlik') || pCat.includes('sut') || pCat.includes('drink') || pCat.includes('sok') || pCat.includes('напитки'))) ||
          (catSelected.includes('elektronika') && (pCat.includes('elektronika') || pCat.includes('ro\'zg\'or') || pCat.includes('maishiy') || pCat.includes('быт')));

        if (!isExact && !isSubstring && !isSemantic) {
          return false;
        }
      }
      // Stock status filter
      if (stockFilter === 'instock' && p.quantity <= 0) {
        return false;
      }
      if (stockFilter === 'restocking' && p.quantity > 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (priceSort === 'low-to-high') {
        return a.price - b.price;
      }
      if (priceSort === 'high-to-low') {
        return b.price - a.price;
      }
      return 0;
    });
  }, [products, selectedBranchId, searchQuery, selectedCategory, stockFilter, priceSort]);

  // Handle Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('doim_ochiqmiz_admin_logged');
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
  };

  // Handle Admin Login Success
  const handleAdminLoginSuccess = () => {
    localStorage.setItem('doim_ochiqmiz_admin_logged', 'true');
    setIsAdminLoggedIn(true);
    setIsAdminPanelOpen(true);
  };

  const unreadChatCount = chatSessions.filter((s) => s.unreadByAdmin).length;

  return (
    <div className="min-h-screen bg-[#ebf7f5] text-slate-800 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Main Header */}
      <Header
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        contactPhone={siteSettings.contactPhone}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadChatCount={unreadChatCount}
        lang={currentLang}
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'products' && (
          <div className="space-y-8 pb-16">
            {/* Dynamic Hero Section */}
            <Hero
              settings={siteSettings}
              branches={branches}
              selectedBranchId={selectedBranchId}
              onSelectBranch={setSelectedBranchId}
              productCount={products.length}
              t={t}
            />

            {/* Filter Bar & Products Catalog */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <ProductFilterBar
                branches={branches}
                selectedBranchId={selectedBranchId}
                onSelectBranch={setSelectedBranchId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priceSort={priceSort}
                onPriceSortChange={setPriceSort}
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                lang={currentLang}
                t={t}
              />

              {/* Empty Database Initial State View */}
              {products.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-emerald-200 max-w-2xl mx-auto my-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Baza Bosh (Hali Mahsulotlar Kiritilmagan)
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Tizim ma'lumotlar bazasida hozircha mahsulotlar yo'q. Admin panel orqali yangi mahsulotlar va filiallar qo'shishingiz mumkin.
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                /* No match for current search/filter */
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <p className="text-sm font-bold text-slate-700">
                    Siz qidirgan mezon bo'yicha mahsulotlar topilmadi.
                  </p>
                  <p className="text-xs text-slate-400">
                    Filtrni tozalab ko'ring yoki boshqa so'rov yozing.
                  </p>
                  <button
                    onClick={() => {
                      soundFx.playClick('pop');
                      setSelectedBranchId('all');
                      setSearchQuery('');
                      setStockFilter('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold"
                  >
                    Filtrlarni Qayta Tiklash
                  </button>
                </div>
              ) : (
                /* Product Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      branchMap={branchMap}
                      onOpenDetail={(p) => setSelectedProductDetail(p)}
                      onOpenChatWithProduct={(name) => setPresetInquiryProduct(name)}
                      t={t}
                      lang={currentLang}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <BranchList
            branches={branches}
            onSelectBranchFilter={(branchId) => {
              setSelectedBranchId(branchId);
              setActiveTab('products');
            }}
            t={t}
            siteSettings={siteSettings}
          />
        )}

        {activeTab === 'news' && (
          <NewsSection newsList={newsList} />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        branchMap={branchMap}
        onClose={() => setSelectedProductDetail(null)}
        onOpenChatWithProduct={(name) => setPresetInquiryProduct(name)}
        t={t}
        lang={currentLang}
      />

      {/* Floating Real-Time Customer Chat Widget */}
      <CustomerChatWidget
        presetInquiryProduct={presetInquiryProduct}
        onClearPresetInquiry={() => setPresetInquiryProduct(null)}
        t={t}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        branchesCount={branches.length}
        newsCount={newsList.length}
        t={t}
      />

      {/* Admin Security Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccessLogin={handleAdminLoginSuccess}
      />

      {/* Admin Full Dashboard Panel */}
      {isAdminPanelOpen && (
        <AdminPanel
          products={products}
          branches={branches}
          settings={siteSettings}
          newsList={newsList}
          chatSessions={chatSessions}
          onCloseAdminPanel={() => setIsAdminPanelOpen(false)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Sleek Interface Footer */}
      <footer className="bg-emerald-900 text-emerald-400 px-6 sm:px-8 py-3 text-[10px] font-mono flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-emerald-800 mt-auto uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {t.systemStatus}</span>
          <span className="hidden md:inline text-emerald-700">•</span>
          <span className="hidden md:inline text-emerald-300">{t.connectedFirestore}</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-300 font-semibold">
          <span>{t.contactPhone}: <strong className="text-amber-300">{siteSettings.contactPhone}</strong></span>
          <span>{t.copyright}</span>
        </div>
      </footer>
    </div>
  );
}

