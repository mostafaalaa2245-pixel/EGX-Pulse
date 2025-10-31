'use client';

import { Stock } from '@/types';
import { useState } from 'react';
import StockChart from './StockChart';

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  const [showChart, setShowChart] = useState(false);
  const isPositive = stock.change >= 0;

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10"
      onClick={() => setShowChart(!showChart)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
          <p className="text-sm text-slate-400">{stock.name}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isPositive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-white mb-1">
          {stock.price.toFixed(2)} <span className="text-lg text-slate-400">ج.م</span>
        </div>
        <div className={`text-sm font-medium ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {isPositive ? '+' : ''}{stock.change.toFixed(2)} ج.م
        </div>
      </div>

      {showChart && stock.history && stock.history.length > 0 && (
        <div className="mb-4 pt-4 border-t border-slate-700">
          <StockChart data={stock.history} isPositive={isPositive} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-xs text-slate-500 mb-1">الحجم</p>
          <p className="text-sm font-semibold text-slate-300">
            {(stock.volume / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">الأعلى</p>
          <p className="text-sm font-semibold text-slate-300">
            {stock.high.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">الأدنى</p>
          <p className="text-sm font-semibold text-slate-300">
            {stock.low.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">الافتتاح</p>
          <p className="text-sm font-semibold text-slate-300">
            {stock.open.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 text-center">
        اضغط لعرض/إخفاء الرسم البياني
      </div>
    </div>
  );
}
