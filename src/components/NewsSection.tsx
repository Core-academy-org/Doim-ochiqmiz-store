import React from 'react';
import { NewsItem } from '../types';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

interface NewsSectionProps {
  newsList: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsList }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Newspaper className="w-3.5 h-3.5 text-amber-600" />
          <span>E'lonlar & Yangiliklar</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          Doim Ochiqmiz Yangiliklari va Aksiyalar
        </h2>
        <p className="text-sm text-slate-600">
          Filiallarimizdagi yangi kelgan tovarlar, aksiyalar va ish vaqti o'zgarishlari bilan tanishing.
        </p>
      </div>

      {newsList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-amber-200 max-w-md mx-auto space-y-3">
          <Newspaper className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Hozircha Yangiliklar Yo'q</h3>
          <p className="text-xs text-slate-500">
            Tez orada bu yerda yangi e'lonlar va aksiyalar paydo bo'ladi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl border border-amber-100/80 shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden"
            >
              {item.imageUrl && (
                <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date || "Bugun"}</span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
