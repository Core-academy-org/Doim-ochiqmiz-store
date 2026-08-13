import React, { useState, useEffect, useRef } from 'react';
import { db, collection, doc, setDoc, addDoc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from '../lib/firebase';
import { ChatMessage, ChatSession } from '../types';
import { soundFx } from '../lib/sound';
import { Translations } from '../lib/i18n';
import { MessageSquare, Send, User, Phone, FileText, Sparkles, Minimize2, MessageCircleQuestion, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

interface CustomerChatWidgetProps {
  presetInquiryProduct?: string | null;
  onClearPresetInquiry?: () => void;
  t?: Translations;
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  presetInquiryProduct,
  onClearPresetInquiry,
  t
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(() => {
    return localStorage.getItem('doim_ochiqmiz_chat_id');
  });

  // Pre-chat form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [contactReason, setContactReason] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default translation fallbacks
  const titleText = t?.chatBallTitle || "So'rov / Jonli Chat";
  const startBtnText = t?.startChatBtn || "Chatni Boshlash";
  const nameLabel = t?.yourName || "Ismingiz";
  const phoneLabel = t?.yourPhone || "Telefon Raqamingiz";
  const reasonLabel = t?.inquiryReason || "Murojaat Sababi / So'rovingiz";

  // Auto handle preset product inquiry from product card
  useEffect(() => {
    if (presetInquiryProduct) {
      setIsOpen(true);
      setContactReason(`"${presetInquiryProduct}" bo'yicha narx va mavjudlik so'rovi`);

      // If already in an active chat, auto-send inquiry message
      if (chatSessionId) {
        const autoMsgText = `Salom! "${presetInquiryProduct}" mahsuloti bor-yo'qligini va narxini bilmoqchi edim.`;
        sendDirectMessage(autoMsgText);
        if (onClearPresetInquiry) {
          onClearPresetInquiry();
        }
      }
    }
  }, [presetInquiryProduct, chatSessionId]);

  // Subscribe to chat session updates
  useEffect(() => {
    if (!chatSessionId) return;

    const sessionRef = doc(db, 'chats', chatSessionId);
    const unsubscribeSession = onSnapshot(
      sessionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setActiveSession({ id: snapshot.id, ...snapshot.data() } as ChatSession);
        } else {
          // If session doc doesn't exist in Firestore, reset local invalid session
          localStorage.removeItem('doim_ochiqmiz_chat_id');
          setChatSessionId(null);
          setActiveSession(null);
        }
      },
      (error) => {
        console.error("Session snapshot error:", error);
      }
    );

    const messagesQuery = query(
      collection(db, 'chats', chatSessionId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        if (msgs.length > 0) {
          setMessages(msgs);
        }
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      },
      (error) => {
        console.error("Messages snapshot error:", error);
      }
    );

    return () => {
      unsubscribeSession();
      unsubscribeMessages();
    };
  }, [chatSessionId]);

  // Reset/Start new chat session
  const handleResetChat = () => {
    soundFx.playClick('pop');
    localStorage.removeItem('doim_ochiqmiz_chat_id');
    setChatSessionId(null);
    setActiveSession(null);
    setMessages([]);
    setErrorMessage(null);
    if (onClearPresetInquiry) {
      onClearPresetInquiry();
    }
  };

  // Helper for sending direct message
  const sendDirectMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !chatSessionId) return;

    soundFx.playClick('click');

    // Optimistically update UI
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'customer',
      text: textToSend,
      senderName: activeSession?.customerName || customerName || 'Mijoz',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await addDoc(collection(db, 'chats', chatSessionId, 'messages'), {
        sender: 'customer',
        text: textToSend,
        senderName: activeSession?.customerName || customerName || 'Mijoz',
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'chats', chatSessionId), {
        lastMessage: textToSend,
        lastUpdated: serverTimestamp(),
        unreadByAdmin: true
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Handle pre-chat form submission
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedReason = contactReason.trim();

    if (!trimmedName || !trimmedPhone || !trimmedReason) {
      setErrorMessage("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    soundFx.playClick('chime');
    setIsSubmittingForm(true);

    try {
      // Generate doc ref synchronously for instant transition
      const newSessionRef = doc(collection(db, 'chats'));
      const newId = newSessionRef.id;

      // 1. Instantly transition local state so UI opens immediately!
      localStorage.setItem('doim_ochiqmiz_chat_id', newId);

      const initialCustomerMsg: ChatMessage = {
        id: `msg-1-${Date.now()}`,
        sender: 'customer',
        text: `Murojaat sababi: ${trimmedReason}`,
        senderName: trimmedName,
        timestamp: new Date()
      };

      const initialAdminWelcomeMsg: ChatMessage = {
        id: `msg-2-${Date.now()}`,
        sender: 'admin',
        text: `Assalomu alaykum, ${trimmedName}! Doim Ochiqmiz sotuv markaziga xush kelibsiz. Operatorimiz tezzada javob beradi.`,
        senderName: "Doim Ochiqmiz Admin",
        timestamp: new Date()
      };

      setMessages([initialCustomerMsg, initialAdminWelcomeMsg]);
      setActiveSession({
        id: newId,
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        contactReason: trimmedReason,
        status: 'active',
        unreadByAdmin: true,
        lastMessage: trimmedReason,
        lastUpdated: new Date()
      });
      setChatSessionId(newId);

      // 2. Persist to Firestore concurrently
      await setDoc(newSessionRef, {
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        contactReason: trimmedReason,
        status: 'active',
        unreadByAdmin: true,
        lastMessage: trimmedReason,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'chats', newId, 'messages'), {
        sender: 'customer',
        text: `Murojaat sababi: ${trimmedReason}`,
        senderName: trimmedName,
        timestamp: serverTimestamp()
      });

      await addDoc(collection(db, 'chats', newId, 'messages'), {
        sender: 'admin',
        text: `Assalomu alaykum, ${trimmedName}! Doim Ochiqmiz sotuv markaziga xush kelibsiz. Operatorimiz tezzada javob beradi.`,
        senderName: "Doim Ochiqmiz Admin",
        timestamp: serverTimestamp()
      });

      if (presetInquiryProduct && onClearPresetInquiry) {
        onClearPresetInquiry();
      }
    } catch (err: any) {
      console.error("Error creating chat session:", err);
      // Even if Firestore network lags, local state already transitioned smoothly!
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Send message from bottom chat bar
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !chatSessionId) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    await sendDirectMessage(textToSend);
  };

  return (
    <div className="fixed bottom-16 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end">
      {/* Ball Shape Floating Trigger Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip Label Pill on Hover/Idle */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-none">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-400" />
            <span>{titleText}</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick('chime');
              setIsOpen(true);
            }}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white ring-4 ring-emerald-500/20 cursor-pointer"
            title={titleText}
          >
            {/* Pulsing Outer Aura */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping pointer-events-none"></span>

            {/* Ball Icon Container */}
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white drop-shadow-md" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full"></span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] max-w-[380px] sm:w-[400px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-emerald-200/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-amber-300 border border-white/20 shrink-0">
                💬
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm flex items-center gap-1.5 truncate">
                  {t?.liveChatHeader || "Doim Ochiqmiz Live Chat"}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                </h3>
                <p className="text-[11px] text-emerald-100 truncate">
                  {activeSession ? `Mijoz: ${activeSession.customerName}` : titleText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {chatSessionId && (
                <button
                  onClick={handleResetChat}
                  className="p-1.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
                  title="Yangi chat boshlash"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  soundFx.playClick('pop');
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
                title="Yopish"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!chatSessionId ? (
            /* PRE-CHAT REGISTRATION FORM */
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-emerald-50/40 to-white space-y-4">
              <div className="bg-emerald-100/60 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> {titleText}:
                </p>
                <p className="opacity-90">
                  Sotuvchimizga xabar yuborishdan oldin ma'lumotlaringizni kiriting. Chat darhol ochiladi!
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleStartChat} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> {nameLabel}:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Jasurbek"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-sky-600" /> {phoneLabel}:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" /> {reasonLabel}:
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Masalan: Yunusobod filialida olmalar va sport tovarlari bormi?"
                    value={contactReason}
                    onChange={(e) => setContactReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ochilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>{startBtnText}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ACTIVE REAL-TIME CHAT MESSAGES */
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span>Xabarlar yuklanmoqda...</span>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender === 'customer';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] font-semibold text-slate-400 mb-0.5 px-1">
                          {m.senderName || (isMe ? 'Siz' : 'Operator')}
                        </span>
                        <div
                          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Xabar yozing..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


