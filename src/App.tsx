/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { db, firebaseConfigured, collection, doc, onSnapshot, query, orderBy, setDoc, addDoc } from './lib/firebase';
import { Product, Branch, SiteSettings, NewsItem, ChatSession } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductFilterBar } from './components/ProductFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BranchList } from './components/BranchList';
import { NewsSection } from './components/NewsSection';
import { CustomerChatWidget } from './components/CustomerChatWidget';
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
    if (!firebaseConfigured) {
      console.warn('Firebase is not configured. Rendering the site with local default content.');
      return;
    }

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
      // Search query
      if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      // Category filter (support flexible category matching)
      if (selectedCategory !== 'all') {
        const catSelected = selectedCategory.toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        
        const isMatch = pCat === catSelected ||
          (catSelected.includes('meva') && (pCat.includes('meva') || pCat.includes('sabzavot') || pCat.includes('fruit'))) ||
          (catSelected.includes('sport') && (pCat.includes('sport') || pCat.includes('mashq'))) ||
          (catSelected.includes('oshxona') && (pCat.includes('oshxona') || pCat.includes('pichoq') || pCat.includes('tova') || pCat.includes('kitchen'))) ||
          (catSelected.includes('ichimlik') && (pCat.includes('ichimlik') || pCat.includes('sut') || pCat.includes('drink'))) ||
          (catSelected.includes('elektronika') && (pCat.includes('elektronika') || pCat.includes('ro\'zg\'or') || pCat.includes('maishiy')));

        if (!isMatch) return false;
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

  // Seed sample initial data with fruits, sports, kitchen tools, drinks, electronics
  const handleSeedInitialData = async () => {
    soundFx.playClick('chime');
    try {
      // Seed Branches
      const branch1 = await addDoc(collection(db, 'branches'), {
        name: 'Chilonzor Filiali',
        address: 'Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy',
        phone: '+998 90 123 45 67',
        lat: 41.2783,
        lng: 69.2081,
        workingHours: '08:00 - 22:00',
        createdAt: new Date().toISOString()
      });

      const branch2 = await addDoc(collection(db, 'branches'), {
        name: 'Yunusobod Filiali',
        address: 'Toshkent sh., Yunusobod tumani, 4-mavze, 8-uy',
        phone: '+998 91 765 43 21',
        lat: 41.3652,
        lng: 69.2894,
        workingHours: '08:00 - 23:00',
        createdAt: new Date().toISOString()
      });

      // Seed Fruits & Veg
      await addDoc(collection(db, 'products'), {
        name: 'Namangan Shirin Qizil Olma (1 kg)',
        price: 18000,
        quantity: 45,
        branchId: branch1.id,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
        category: 'Mevalar & Sabzavotlar',
        description: 'Taza terilgan sarxil Namangan shirin olmasi.',
        reactions: { '❤️': 12, '👍': 18, '🔥': 25 },
        createdAt: new Date().toISOString()
      });

      // Seed Sports
      await addDoc(collection(db, 'products'), {
        name: 'Professional Futbol Koptogi (Nike Pitch)',
        price: 185000,
        quantity: 14,
        branchId: branch1.id,
        imageUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=600&q=80',
        category: 'Sport tovarlari',
        description: 'Chidamli charm futbol koptogi. Universal foydalanish uchun.',
        reactions: { '❤️': 19, '👍': 24, '🔥': 32 },
        createdAt: new Date().toISOString()
      });

      // Seed Kitchen Tools
      await addDoc(collection(db, 'products'), {
        name: 'Granit Yopishmaydigan Tova 28sm (Tefal style)',
        price: 240000,
        quantity: 8,
        branchId: branch2.id,
        imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
        category: 'Oshxona jihozlari',
        description: 'Qalin granit qoplamali va yog\'siz qovurish imkoniga ega premium oshxona tovasi.',
        reactions: { '❤️': 30, '👍': 42, '🔥': 18 },
        createdAt: new Date().toISOString()
      });

      // Seed Drinks & Dairy
      await addDoc(collection(db, 'products'), {
        name: 'Taza Sut "Musaffo" 3.2% (1 L)',
        price: 14000,
        quantity: 20,
        branchId: branch2.id,
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
        category: 'Ichimliklar & Sut',
        description: "3.2% yog'li taza pasterizatsiyalangan natural sut.",
        reactions: { '❤️': 8, '👍': 15, '🔥': 6 },
        createdAt: new Date().toISOString()
      });

      // Seed News
      await addDoc(collection(db, 'news'), {
        title: "Yangi Meva va Sport Jihozlari Partiyasi Keldi!",
        content: "Barcha filiallarimizga yangi uzilgan sarxil mevalar, oshxona jihozlari hamda sifatli sport koptoklari yetkazib berildi.",
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error seeding initial data:", err);
    }
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
      <main className="flex-1">
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

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        soundFx.playClick('click');
                        if (isAdminLoggedIn) {
                          setIsAdminPanelOpen(true);
                        } else {
                          setIsAdminLoginOpen(true);
                        }
                      }}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Admin Panelga Kirib Mahsulot Qo'shish</span>
                    </button>

                    <button
                      onClick={handleSeedInitialData}
                      className="px-5 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl text-xs font-bold transition-colors"
                    >
                      🌱 Namuna Mahsulotlar Bilan To'ldirish (Mevalar, Sport, Oshxona)
                    </button>
                  </div>
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
