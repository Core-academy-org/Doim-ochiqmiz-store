import React, { useState, useEffect, useRef } from 'react';
import { db, collection, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, addDoc, serverTimestamp } from '../../lib/firebase';
import { ChatSession, ChatMessage } from '../../types';
import { soundFx } from '../../lib/sound';
import { MessageSquare, Phone, User, Send, Trash2, CheckCircle2, Sparkles, Clock, Search, Shield } from 'lucide-react';

interface ChatCenterProps {
  chatSessions: ChatSession[];
  activeSessionId?: string | null;
  onSelectSession?: (sessionId: string | null) => void;
  onTriggerTestToast?: () => void;
}

export const ChatCenter: React.FC<ChatCenterProps> = ({ 
  chatSessions, 
  activeSessionId, 
  onSelectSession,
  onTriggerTestToast 
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(activeSessionId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSessionId !== undefined) {
      setSelectedSessionId(activeSessionId);
    }
  }, [activeSessionId]);

  const handleSelect = (id: string | null) => {
    setSelectedSessionId(id);
    if (onSelectSession) {
      onSelectSession(id);
    }
  };

  const selectedSession = chatSessions.find((s) => s.id === selectedSessionId) || null;

  // Subscribe to selected chat session messages
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    // Mark as read by admin when opened
    updateDoc(doc(db, 'chats', selectedSessionId), {
      unreadByAdmin: false
    }).catch(() => {});

    const messagesQuery = query(
      collection(db, 'chats', selectedSessionId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [selectedSessionId]);

  // Send Admin Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSessionId) return;

    const textToSend = replyText.trim();
    setReplyText('');
    soundFx.playClick('click');

    try {
      await addDoc(collection(db, 'chats', selectedSessionId, 'messages'), {
        sender: 'admin',
        text: textToSend,
        senderName: 'Jasurbek (Admin)',
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'chats', selectedSessionId), {
        lastMessage: textToSend,
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending admin reply:", err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Ushbu suhbatni o'chirib tashlamoqchimisiz?")) return;
    soundFx.playClick('pop');

    try {
      await deleteDoc(doc(db, 'chats', sessionId));
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
    } catch (err) {
      console.error("Error deleting chat session:", err);
    }
  };

  const filteredSessions = chatSessions.filter((s) =>
    s.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.customerPhone.includes(searchFilter) ||
    s.contactReason.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[620px] flex flex-col md:flex-row">
      {/* LEFT SIDE: Telegram-style Chat List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Murojaatlar Markazi
            </h3>
            <div className="flex items-center gap-1.5">
              {onTriggerTestToast && (
                <button
                  onClick={() => {
                    soundFx.playClick('pop');
                    onTriggerTestToast();
                  }}
                  className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded-full transition-colors flex items-center gap-1 shadow-xs"
                  title="Test Bildirishnoma (Toast Alert)"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Test Toast</span>
                </button>
              )}
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {chatSessions.length} ta
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Ism yoki telefon bo'yicha izlash..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Sessions Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Hozircha murojaat yo'q.
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isSelected = s.id === selectedSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    soundFx.playClick('click');
                    handleSelect(s.id);
                  }}
                  className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 relative hover:bg-emerald-50/50 ${
                    isSelected ? 'bg-emerald-100/60 border-l-4 border-emerald-600' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {s.customerName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-slate-800 truncate">
                        {s.customerName}
                      </h4>
                      {s.unreadByAdmin && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                      )}
                    </div>

                    <p className="text-[11px] font-semibold text-emerald-700 truncate">
                      📞 {s.customerPhone}
                    </p>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {s.lastMessage || s.contactReason}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Telegram-style Message Thread */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedSession ? (
          <>
            {/* Thread Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                  {selectedSession.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {selectedSession.customerName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>📞 {selectedSession.customerPhone}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      Murojaat: {selectedSession.contactReason}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteSession(selectedSession.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Suhbatni o'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  Xabarlar yuklanmoqda...
                </div>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.sender === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] font-semibold text-slate-400 mb-0.5 px-1">
                        {isAdmin ? 'Jasurbek (Siz)' : selectedSession.customerName}
                      </span>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isAdmin
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

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Mijozga javob xabari yozing..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Yuborish</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300" />
            <h4 className="font-extrabold text-slate-600 text-base">Suhbatni tanlang</h4>
            <p className="text-xs max-w-xs">
              Chap tomondagi ro'yxatdan mijozni tanlang va real-vaqt rejimida javob yozing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
