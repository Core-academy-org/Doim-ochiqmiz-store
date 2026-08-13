import React, { useState, useEffect, useRef } from 'react';
import { Product, Branch, SiteSettings, NewsItem, ChatSession } from '../../types';
import { ProductsManager } from './ProductsManager';
import { BranchesManager } from './BranchesManager';
import { DynamicTextManager } from './DynamicTextManager';
import { NewsManager } from './NewsManager';
import { ChatCenter } from './ChatCenter';
import { AdminToast, ToastMessage } from './AdminToast';
import { soundFx } from '../../lib/sound';
import { 
  Lock, 
  LogOut, 
  Package, 
  MapPin, 
  Type, 
  Newspaper, 
  MessageSquare, 
  ShieldCheck, 
  X,
  Sparkles,
  Bell
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  branches: Branch[];
  settings: SiteSettings;
  newsList: NewsItem[];
  chatSessions: ChatSession[];
  onCloseAdminPanel: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  branches,
  settings,
  newsList,
  chatSessions,
  onCloseAdminPanel,
  onLogout
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'branches' | 'text' | 'news' | 'chats'>('products');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null);

  const unreadChatCount = chatSessions.filter((s) => s.unreadByAdmin).length;

  // Track previous chat sessions state to detect new incoming messages
  const prevSessionsMapRef = useRef<Record<string, { unreadByAdmin: boolean; lastMessage: string }>>({});
  const isFirstRenderRef = useRef(true);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenChatFromToast = (sessionId: string) => {
    setActiveAdminTab('chats');
    setSelectedChatSessionId(sessionId);
  };

  // Trigger test toast for demonstration / manual testing
  const triggerTestToast = () => {
    const sampleNames = ["Baxodir Temirov", "Shaxnoza Alimova", "Sardor Karimov", "Azizbek Tursunov"];
    const samplePhones = ["+998 90 987 65 43", "+998 93 111 22 33", "+998 97 444 55 66"];
    const sampleMessages = [
      "Namangan olmasidan 5 kg qolganmi?",
      "Futbol koptogi Yunusobod filialida bormi?",
      "To'lovni Payme orqali qilsa bo'ladimi?",
      "Do'koningiz soat nechagacha ochiq?"
    ];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPhone = samplePhones[Math.floor(Math.random() * samplePhones.length)];
    const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: "Yangi Chat Xabari!",
      customerName: randomName,
      customerPhone: randomPhone,
      messageText: randomMsg,
      sessionId: chatSessions[0]?.id || undefined,
      timestamp: "Hozirgina",
      type: 'chat'
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));
  };

  // Listen to chatSessions updates and trigger visual toast alert when unreadByAdmin is true or new message arrives
  useEffect(() => {
    if (isFirstRenderRef.current) {
      const initialMap: Record<string, { unreadByAdmin: boolean; lastMessage: string }> = {};
      chatSessions.forEach((s) => {
        initialMap[s.id] = { unreadByAdmin: s.unreadByAdmin, lastMessage: s.lastMessage || s.contactReason || '' };
      });
      prevSessionsMapRef.current = initialMap;
      isFirstRenderRef.current = false;
      return;
    }

    const prevMap = prevSessionsMapRef.current;
    const nextMap: Record<string, { unreadByAdmin: boolean; lastMessage: string }> = {};

    chatSessions.forEach((session) => {
      const prev = prevMap[session.id];
      const currentMsg = session.lastMessage || session.contactReason || '';

      if (session.unreadByAdmin) {
        if (!prev) {
          // Brand new chat session created!
          const toast: ToastMessage = {
            id: `toast-${Date.now()}-${session.id}`,
            title: "Yangi Mijoz Murojaati!",
            customerName: session.customerName,
            customerPhone: session.customerPhone,
            messageText: currentMsg,
            sessionId: session.id,
            timestamp: "Hozirgina",
            type: 'chat'
          };
          setToasts((existing) => [toast, ...existing].slice(0, 4));
        } else if (!prev.unreadByAdmin || prev.lastMessage !== currentMsg) {
          // Existing chat session received a new message!
          const toast: ToastMessage = {
            id: `toast-${Date.now()}-${session.id}`,
            title: "Yangi Chat Xabari!",
            customerName: session.customerName,
            customerPhone: session.customerPhone,
            messageText: currentMsg,
            sessionId: session.id,
            timestamp: "Hozirgina",
            type: 'chat'
          };
          setToasts((existing) => [toast, ...existing].slice(0, 4));
        }
      }

      nextMap[session.id] = {
        unreadByAdmin: session.unreadByAdmin,
        lastMessage: currentMsg
      };
    });

    prevSessionsMapRef.current = nextMap;
  }, [chatSessions]);

  const handleTabChange = (tab: 'products' | 'branches' | 'text' | 'news' | 'chats') => {
    soundFx.playClick('click');
    setActiveAdminTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-center animate-in fade-in duration-200">
      {/* Toast Notification Container Overlay */}
      <AdminToast
        toasts={toasts}
        onDismiss={handleDismissToast}
        onOpenChatSession={handleOpenChatFromToast}
      />

      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[95vh] relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-4 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-amber-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  "Doim ochiqmiz" Boshqaruv Markazi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/20">
                  Jasurbek (Admin)
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Filiallar, mahsulotlar qoldig'i, narxlar va mijozlar so'rovlarini boshqarish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Test Toast Button */}
            <button
              onClick={() => {
                soundFx.playClick('chime');
                triggerTestToast();
              }}
              className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-slate-950 rounded-xl text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 transition-all shadow-xs"
              title="Yangi xabar bildirishnomasini simulyatsiya qilish"
            >
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Test Toast</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick('pop');
                onLogout();
              }}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white rounded-xl text-xs font-bold border border-rose-400/30 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick('pop');
                onCloseAdminPanel();
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => handleTabChange('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeAdminTab === 'products'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mahsulotlar ({products.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('branches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeAdminTab === 'branches'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Filiallar ({branches.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeAdminTab === 'text'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Dinamik Matnlar</span>
          </button>

          <button
            onClick={() => handleTabChange('news')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeAdminTab === 'news'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Yangiliklar ({newsList.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('chats')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeAdminTab === 'chats'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Markazi ({chatSessions.length})</span>
            {unreadChatCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {unreadChatCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeAdminTab === 'products' && (
            <ProductsManager products={products} branches={branches} />
          )}

          {activeAdminTab === 'branches' && (
            <BranchesManager branches={branches} />
          )}

          {activeAdminTab === 'text' && (
            <DynamicTextManager settings={settings} />
          )}

          {activeAdminTab === 'news' && (
            <NewsManager newsList={newsList} />
          )}

          {activeAdminTab === 'chats' && (
            <ChatCenter 
              chatSessions={chatSessions} 
              activeSessionId={selectedChatSessionId}
              onSelectSession={(id) => setSelectedChatSessionId(id)}
              onTriggerTestToast={triggerTestToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};
