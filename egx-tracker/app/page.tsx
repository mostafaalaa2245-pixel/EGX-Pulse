'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StockCard from '@/components/StockCard';
import MarketOverview from '@/components/MarketOverview';
import { Stock } from '@/types';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks');
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📈</div>
              <div>
                <h1 className="text-xl font-bold text-white">بورصة مصر</h1>
                <p className="text-xs text-slate-400">EGX Live Tracker</p>
              </div>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link 
                href="/news" 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              >
                📰 الأخبار
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
        <MarketOverview stocks={stocks} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">الأسهم المتداولة</h2>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">تحديث لحظي</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">📊 نبذة عن البورصة المصرية</h3>
          <p className="text-slate-300 leading-relaxed">
            البورصة المصرية (EGX) هي واحدة من أقدم البورصات في الشرق الأوسط وأفريقيا. 
            تتيح لك هذه المنصة متابعة أسعار الأسهم بشكل لحظي، قراءة آخر الأخبار، والتداول بسهولة وأمان.
          </p>
        </div>
      </main>

      <footer className="bg-slate-800/50 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-400 text-sm">
            © 2025 بورصة مصر - EGX Live Tracker. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
