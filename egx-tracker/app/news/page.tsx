'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.category === filter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'earnings': return 'bg-emerald-500/20 text-emerald-400';
      case 'announcement': return 'bg-blue-500/20 text-blue-400';
      case 'market': return 'bg-purple-500/20 text-purple-400';
      case 'analysis': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'earnings': return 'أرباح';
      case 'announcement': return 'إعلان';
      case 'market': return 'سوق';
      case 'analysis': return 'تحليل';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="text-3xl">📈</div>
              <div>
                <h1 className="text-xl font-bold text-white">بورصة مصر</h1>
                <p className="text-xs text-slate-400">EGX Live Tracker</p>
              </div>
            </Link>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link 
                href="/" 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              >
                🏠 الرئيسية
              </Link>
              <Link 
                href="/trading" 
                className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-all"
              >
                💼 التداول
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📰 أخبار البورصة</h1>
          <p className="text-slate-400">آخر الأخبار والتحليلات للشركات المدرجة في البورصة المصرية</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('earnings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'earnings'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            أرباح
          </button>
          <button
            onClick={() => setFilter('announcement')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'announcement'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            إعلانات
          </button>
          <button
            onClick={() => setFilter('market')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'market'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            السوق
          </button>
          <button
            onClick={() => setFilter('analysis')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'analysis'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            تحليلات
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="text-sm font-semibold text-emerald-400">{item.company}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
