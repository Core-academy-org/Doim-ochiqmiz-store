export type Language = 'uz' | 'en' | 'ru';

export interface Translations {
  topNotice: string;
  contactPhone: string;
  service247: string;
  products: string;
  branches: string;
  news: string;
  allBranches: string;
  adminLogin: string;
  adminPanel: string;
  searchPlaceholder: string;
  priceSortDefault: string;
  priceLowHigh: string;
  priceHighLow: string;
  resetFilters: string;
  status: string;
  allStatus: string;
  inStock: string;
  restocking: string;
  category: string;
  allCategories: string;
  quickInquiry: string;
  viewDetails: string;
  chatBallTitle: string;
  chatBallSub: string;
  liveChatHeader: string;
  startChatBtn: string;
  yourName: string;
  yourPhone: string;
  inquiryReason: string;
  systemStatus: string;
  connectedFirestore: string;
  copyright: string;
  
  // Main Store & Map
  mainStoreTitle: string;
  mainStoreSubtitle: string;
  openGoogleMaps: string;
  getDirections: string;
  copyAddress: string;
  addressCopied: string;
  mainStoreBranchName: string;
  mainStoreAddress: string;

  // Hero & Stats
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroNoticeText: string;
  availableProductsCount: string;
  locationsCount: string;
  selectBranchPrompt: string;
  allBranchesOption: string;

  // Product Card & Details
  priceLabel: string;
  currency: string;
  inStockQty: string;
  restockingBadge: string;
  imageCountBadge: string;
  askAvailability: string;
  branchLabel: string;
  categoryLabel: string;

  // News
  newsTitle: string;
  newsSubtitle: string;
  readMore: string;

  // Categories
  catFruitsVeg: string;
  catSports: string;
  catKitchen: string;
  catDrinksDairy: string;
  catElectronics: string;
  catSweets: string;
}

export const translations: Record<Language, Translations> = {
  uz: {
    topNotice: "Eshiklarimiz har doim ochiq! Do'konga kelishdan oldin narx va mavjudlikni ko'ring.",
    contactPhone: "Murojaat uchun",
    service247: "24/7 Xizmatda",
    products: "Mahsulotlar",
    branches: "Filiallarimiz & Xarita",
    news: "Yangiliklar",
    allBranches: "Barcha Filiallar (Hammasi)",
    adminLogin: "Admin Login",
    adminPanel: "Admin Boshqaruv",
    searchPlaceholder: "Mahsulot nomini izlash...",
    priceSortDefault: "Narx Saralash: Odatiy",
    priceLowHigh: "Narx: Arzondan Qimmatga ⬆️",
    priceHighLow: "Narx: Qimmatdan Arzonroqqa ⬇️",
    resetFilters: "Tozalash",
    status: "Holat",
    allStatus: "Hammasi",
    inStock: "Mavjud (In Stock)",
    restocking: "Yo'lda / Restocking",
    category: "Kategoriya",
    allCategories: "Barchasi",
    quickInquiry: "So'rov yuborish",
    viewDetails: "Batafsil ko'rish",
    chatBallTitle: "So'rov / Jonli Chat",
    chatBallSub: "Menejer bilan bog'lanish",
    liveChatHeader: "Doim Ochiqmiz Live Chat",
    startChatBtn: "Chatni Boshlash",
    yourName: "Ismingiz",
    yourPhone: "Telefon Raqamingiz",
    inquiryReason: "Murojaat Sababi / So'rovingiz",
    systemStatus: "TIZIM HOLATI: FAOL",
    connectedFirestore: "REAL-TIME FIRESTOREGA UGLANGAN",
    copyright: "DOIM OCHIQMIZ © 2026",

    mainStoreTitle: "📍 BOSH DO'KON VA GOOGLE XARITA",
    mainStoreSubtitle: "Doim Ochiqmiz markaziy do'koniga to'g'ridan-to mehmonga keling va navigatsiyani yoqing!",
    openGoogleMaps: "Google Xaritada Ochish",
    getDirections: "Marshrut Tuzish",
    copyAddress: "Manzilni Nusxalash",
    addressCopied: "Manzil nusxalandi!",
    mainStoreBranchName: "Doim Ochiqmiz - Bosh Do'kon",
    mainStoreAddress: "Toshkent shahri, Toshkent xalqa yo'li / Google Map Geolocation",

    heroTagline: "Filiallar real vaqt ombor tizimi",
    heroTitle: "Doim Ochiqmiz",
    heroSubtitle: "Do'konga kelishdan oldin narx va mavjudlikni bilib oling",
    heroNoticeText: "Xaridlaringizni rejalashtiring! Bizning barcha filiallarimizdagi mahsulotlar qoldig'i, narxlari va mavjudligi soniyalar ichida yangilanib turadi.",
    availableProductsCount: "Mavjud mahsulotlar",
    locationsCount: "Filiallar joylashuvi",
    selectBranchPrompt: "Filialni tanlang",
    allBranchesOption: "Barcha filiallar bo'yicha",

    priceLabel: "Narxi",
    currency: "so'm",
    inStockQty: "Mavjud",
    restockingBadge: "Yo'lda / Kutilmoqda",
    imageCountBadge: "ta rasm",
    askAvailability: "Mavjudligini so'rash",
    branchLabel: "Filial",
    categoryLabel: "Kategoriya",

    newsTitle: "Yangiliklar va Aksiyalar",
    newsSubtitle: "Do'konimizdagi yangi kelgan mahsulotlar va maxsus takliflar",
    readMore: "Batafsil o'qish",

    catFruitsVeg: "Mevalar & Sabzavotlar",
    catSports: "Sport tovarlari",
    catKitchen: "Oshxona jihozlari",
    catDrinksDairy: "Ichimliklar & Sut",
    catElectronics: "Elektronika & Ro'zg'or",
    catSweets: "Shirinliklar & Konservalar"
  },
  en: {
    topNotice: "Our doors are always open! Check live availability and prices before visiting.",
    contactPhone: "Contact Support",
    service247: "24/7 Support Service",
    products: "Products",
    branches: "Our Branches & Map",
    news: "News & Announcements",
    allBranches: "All Store Branches",
    adminLogin: "Admin Login",
    adminPanel: "Admin Panel",
    searchPlaceholder: "Search product name...",
    priceSortDefault: "Sort: Default",
    priceLowHigh: "Price: Low to High ⬆️",
    priceHighLow: "Price: High to Low ⬇️",
    resetFilters: "Reset",
    status: "Status",
    allStatus: "All",
    inStock: "In Stock",
    restocking: "Restocking Soon",
    category: "Category",
    allCategories: "All Categories",
    quickInquiry: "Quick Inquiry",
    viewDetails: "View Details",
    chatBallTitle: "Live Chat / Inquiry",
    chatBallSub: "Connect with support",
    liveChatHeader: "Doim Ochiqmiz Live Chat",
    startChatBtn: "Start Live Chat",
    yourName: "Your Full Name",
    yourPhone: "Phone Number",
    inquiryReason: "Inquiry / Request Details",
    systemStatus: "SYSTEM STATUS: OPERATIONAL",
    connectedFirestore: "CONNECTED TO REAL-TIME FIRESTORE",
    copyright: "DOIM OCHIQMIZ © 2026",

    mainStoreTitle: "📍 MAIN STORE & GOOGLE MAPS",
    mainStoreSubtitle: "Visit our central location or start live turn-by-turn navigation directly in Google Maps!",
    openGoogleMaps: "Open on Google Maps",
    getDirections: "Get Directions",
    copyAddress: "Copy Location Address",
    addressCopied: "Address copied to clipboard!",
    mainStoreBranchName: "Doim Ochiqmiz - Flagship Main Store",
    mainStoreAddress: "Tashkent City, Main Ring Road / Google Map Geolocation",

    heroTagline: "Real-time Store Inventory System",
    heroTitle: "Doim Ochiqmiz",
    heroSubtitle: "Check exact prices and stock availability before heading to the store",
    heroNoticeText: "Plan your shopping effortlessly! Live stock levels, prices, and locations update across all store branches in real time.",
    availableProductsCount: "In-stock items",
    locationsCount: "Store branches",
    selectBranchPrompt: "Select Branch Location",
    allBranchesOption: "All Store Branches",

    priceLabel: "Price",
    currency: "UZS",
    inStockQty: "In Stock",
    restockingBadge: "Restocking Soon",
    imageCountBadge: "photos",
    askAvailability: "Ask Availability",
    branchLabel: "Branch",
    categoryLabel: "Category",

    newsTitle: "News & Store Alerts",
    newsSubtitle: "Discover fresh arrivals, seasonal discounts, and store updates",
    readMore: "Read Details",

    catFruitsVeg: "Fruits & Vegetables",
    catSports: "Sports Equipment",
    catKitchen: "Kitchen Tools",
    catDrinksDairy: "Drinks & Dairy",
    catElectronics: "Electronics & Home",
    catSweets: "Sweets & Pantry"
  },
  ru: {
    topNotice: "Наши двери всегда открыты! Проверяйте наличие и цены перед визитом.",
    contactPhone: "Телефон поддержки",
    service247: "Служба 24/7",
    products: "Товары",
    branches: "Наши Филиалы и Карта",
    news: "Новости и Акции",
    allBranches: "Все Филиалы",
    adminLogin: "Вход Admin",
    adminPanel: "Панель Управления",
    searchPlaceholder: "Поиск по названию товара...",
    priceSortDefault: "Сортировка: По умолчанию",
    priceLowHigh: "Цена: Сначала дешевые ⬆️",
    priceHighLow: "Цена: Сначала дорогие ⬇️",
    resetFilters: "Сбросить",
    status: "Статус",
    allStatus: "Все",
    inStock: "В наличии",
    restocking: "Ожидается поставка",
    category: "Категория",
    allCategories: "Все Категории",
    quickInquiry: "Быстрый Запрос",
    viewDetails: "Подробнее",
    chatBallTitle: "Онлайн-чат / Запрос",
    chatBallSub: "Связаться с менеджером",
    liveChatHeader: "Doim Ochiqmiz Онлайн Чат",
    startChatBtn: "Начать диалог",
    yourName: "Ваше имя",
    yourPhone: "Номер телефона",
    inquiryReason: "Тема обращения / Запрос",
    systemStatus: "СТАТУС СИСТЕМЫ: АКТИВЕН",
    connectedFirestore: "ПОДКЛЮЧЕНО К FIRESTORE REAL-TIME",
    copyright: "DOIM OCHIQMIZ © 2026",

    mainStoreTitle: "📍 ГЛАВНЫЙ МАГАЗИН И GOOGLE КАРТЫ",
    mainStoreSubtitle: "Посетите наш центральный магазин или запустите навигатор прямо в Google Картах!",
    openGoogleMaps: "Открыть в Google Картах",
    getDirections: "Построить Маршрут",
    copyAddress: "Скопировать Адрес",
    addressCopied: "Адрес скопирован!",
    mainStoreBranchName: "Doim Ochiqmiz - Главный Магазин",
    mainStoreAddress: "город Ташкент, Ташкентская кольцевая / Google Map Geolocation",

    heroTagline: "Система складского учета в реальном времени",
    heroTitle: "Doim Ochiqmiz",
    heroSubtitle: "Узнайте точные цены и наличие товаров перед поездкой в магазин",
    heroNoticeText: "Планируйте покупки с удобством! Остатки товаров, цены и наличие по всем филиалам обновляются каждую секунду.",
    availableProductsCount: "Товаров в наличии",
    locationsCount: "Филиалов магазина",
    selectBranchPrompt: "Выберите филиал",
    allBranchesOption: "По всем филиалам",

    priceLabel: "Цена",
    currency: "сум",
    inStockQty: "В наличии",
    restockingBadge: "В пути / Ожидается",
    imageCountBadge: "фото",
    askAvailability: "Узнать наличие",
    branchLabel: "Филиал",
    categoryLabel: "Категория",

    newsTitle: "Новости и Новости Магазина",
    newsSubtitle: "Новые поступления товаров, скидки и объявления сети",
    readMore: "Читать далее",

    catFruitsVeg: "Фрукты и Овощи",
    catSports: "Спорттовары",
    catKitchen: "Кухонные принадлежности",
    catDrinksDairy: "Напитки и Молочка",
    catElectronics: "Электроника и Быт",
    catSweets: "Сладости и Бакалея"
  }
};

export const defaultCategories = [
  "Mevalar & Sabzavotlar",
  "Sport tovarlari",
  "Oshxona jihozlari",
  "Ichimliklar & Sut",
  "Elektronika & Ro'zg'or",
  "Shirinliklar & Konservalar"
];

// Main Google Map short link provided by user
export const MAIN_STORE_GOOGLE_MAP_URL = "https://maps.app.goo.gl/pi9sxPeSN8Mv5Hoe8";

// Helper function to translate category strings to selected language
export function getLocalizedCategory(category: string, lang?: Language): string {
  if (!category) return category;
  const c = category.toLowerCase().trim();
  const targetLang: Language = (lang && translations[lang]) ? lang : 'uz';
  const t = translations[targetLang];

  if (!t) return category;

  if (c.includes('meva') || c.includes('sabzavot') || c.includes('fruit') || c.includes('фрукт')) {
    return t.catFruitsVeg || category;
  }
  if (c.includes('sport') || c.includes('спорт')) {
    return t.catSports || category;
  }
  if (c.includes('oshxona') || c.includes('kitchen') || c.includes('кухон') || c.includes('посуд')) {
    return t.catKitchen || category;
  }
  if (c.includes('ichimlik') || c.includes('sut') || c.includes('drink') || c.includes('dairy') || c.includes('напитки') || c.includes('молок')) {
    return t.catDrinksDairy || category;
  }
  if (c.includes('elektronika') || c.includes('ro\'zg\'or') || c.includes('electronic') || c.includes('быт') || c.includes('техник')) {
    return t.catElectronics || category;
  }
  if (c.includes('shirinlik') || c.includes('sweet') || c.includes('сладост') || c.includes('консерв')) {
    return t.catSweets || category;
  }

  return category;
}
