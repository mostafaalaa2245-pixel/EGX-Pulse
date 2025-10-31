'use client';

import { Stock } from '@/types';
import { useMemo } from 'react';

interface MarketOverviewProps {
  stocks: Stock[];
}

export default function MarketOverview({ stocks }: MarketOverviewProps) {
  const stats = useMemo(() => {
    if (stocks.length === 0) {
      return {
        totalVolume: 0,
        gainers: 0,
        losers: 0,
        unchanged: 0,
        avgChange: 0,
      };
    }

    const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
    const gainers = stocks.filter(s => s.change > 0).length;
    const losers = stocks.filter(s => s.change < 0).length;
    const unchanged = stocks.filter(s => s.change === 0).length;
    const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;

    return { totalVolume, gainers, losers, unchanged, avgChange };
  }, [stocks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90 mb-2">إجمالي الحجم</div>
        <div className="text-2xl font-bold">
          {(stats.totalVolume / 1000000).toFixed(2)}M
        </div>
        <div className="text-xs opacity-75 mt-1">مليون سهم</div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90 mb-2">متوسط التغير</div>
        <div className="text-2xl font-bold">
          {stats.avgChange > 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
        </div>
        <div className="text-xs opacity-75 mt-1">للسوق</div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90 mb-2">الأسهم الرابحة</div>
        <div className="text-2xl font-bold flex items-center">
          <span className="mr-2">↑</span> {stats.gainers}
        </div>
        <div className="text-xs opacity-75 mt-1">سهم</div>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90 mb-2">الأسهم الخاسرة</div>
        <div className="text-2xl font-bold flex items-center">
          <span className="mr-2">↓</span> {stats.losers}
        </div>
        <div className="text-xs opacity-75 mt-1">سهم</div>
      </div>

      <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90 mb-2">بدون تغيير</div>
        <div className="text-2xl font-bold flex items-center">
          <span className="mr-2">→</span> {stats.unchanged}
        </div>
        <div className="text-xs opacity-75 mt-1">سهم</div>
      </div>
    </div>
  );
}
