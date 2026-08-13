import React, { useState } from 'react';
import { NewsItem } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, doc } from '../../lib/firebase';
import { soundFx } from '../../lib/sound';
import { Plus, Edit2, Trash2, Newspaper, Calendar, Image, X } from 'lucide-react';

interface NewsManagerProps {
  newsList: NewsItem[];
}

export const NewsManager: React.FC<NewsManagerProps> = ({ newsList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAdding(false);
    setEditingNews(null);
  };

  const handleStartEdit = (n: NewsItem) => {
    soundFx.playClick('click');
    setEditingNews(n);
    setTitle(n.title);
    setContent(n.content);
    setImageUrl(n.imageUrl || '');
    setDate(n.date || new Date().toISOString().split('T')[0]);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    soundFx.playClick('success');

    const newsData = {
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
      date: date || new Date().toISOString().split('T')[0],
      createdAt: editingNews?.createdAt || new Date().toISOString()
    };

    try {
      if (editingNews) {
        await updateDoc(doc(db, 'news', editingNews.id), newsData);
      } else {
        await addDoc(collection(db, 'news'), newsData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving news:", err);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm("Haqiqatan ham ushbu yangilikni o'chirmoqchimisiz?")) return;
    soundFx.playClick('pop');

    try {
      await deleteDoc(doc(db, 'news', newsId));
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg">
            Yangiliklar va Aksiyalar Boshqaruvi
          </h3>
          <p className="text-xs text-slate-500">
            Mijozlarga filiallardagi e'lonlar va yangi chegirmalar haqida xabar qoldiring.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              soundFx.playClick('click');
              resetForm();
              setIsAdding(true);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi E'lon Post Yozish</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-600" />
              {editingNews ? "Yangilikni Tahrirlash" : "Yangi Yangilik/E'lon Qoshish"}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E'lon Sarlavhasi:
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Yunusobod filialida yangi mevalar aksiyasi!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sana:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rasm URL (Ixtiyoriy):
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Yangilik/E'lon Matni:
            </label>
            <textarea
              required
              rows={4}
              placeholder="E'lon tafsilotlarini yozing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
            >
              {editingNews ? "Saqlash" : "Chop Etish"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsList.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-slate-400 rounded-3xl border border-dashed border-slate-300">
            Hozircha yangiliklar kiritilmagan.
          </div>
        ) : (
          newsList.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
                  <span>📅 {n.date}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-base">{n.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-3">{n.content}</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(n)}
                  className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg"
                  title="O'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
