import React, { useEffect, useState } from 'react';
import { MessageSquare, X, ArrowRight, Sparkles, Bell, Phone, User, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../lib/sound';

export interface ToastMessage {
  id: string;
  title: string;
  customerName: string;
  customerPhone?: string;
  messageText: string;
  sessionId?: string;
  timestamp?: string;
  type?: 'chat' | 'info' | 'success';
}

interface AdminToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onOpenChatSession?: (sessionId: string) => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({
  toasts,
  onDismiss,
  onOpenChatSession
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onOpenChatSession={onOpenChatSession}
        />
      ))}
    </div>
  );
};

interface ToastCardProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onOpenChatSession?: (sessionId: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, onOpenChatSession }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Play subtle chime sound when toast appears
    soundFx.playClick('chime');

    const duration = 8000; // 8 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast.id, onDismiss]);

  const handleAction = () => {
    soundFx.playClick('click');
    if (toast.sessionId && onOpenChatSession) {
      onOpenChatSession(toast.sessionId);
    }
    onDismiss(toast.id);
  };

  return (
    <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 relative overflow-hidden animate-in slide-in-from-top-5 duration-300 hover:border-emerald-400 transition-all group">
      {/* Top accent badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <MessageSquare className="w-3 h-3 text-emerald-400" />
          <span>{toast.title || "Yangi Xabar!"}</span>
        </div>

        <button
          onClick={() => {
            soundFx.playClick('pop');
            onDismiss(toast.id);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Toast Content */}
      <div className="flex items-start gap-3 my-1">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
          {toast.customerName ? toast.customerName.charAt(0).toUpperCase() : '?'}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
            <span>{toast.customerName || "Mijoz"}</span>
            {toast.customerPhone && (
              <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                {toast.customerPhone}
              </span>
            )}
          </h4>

          <p className="text-xs text-slate-200 line-clamp-2 mt-1 font-medium bg-slate-800/80 p-2 rounded-xl border border-white/5">
            "{toast.messageText || "Yangi murojaat yuborildi."}"
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-mono">
          {toast.timestamp || "Hozirgina"}
        </span>

        {toast.sessionId && onOpenChatSession && (
          <button
            onClick={handleAction}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95"
          >
            <span>Suhbatni Ochish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Shrinking Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
