import { useState, useEffect } from 'react';

function StockCard({ stock }) {
  const [priceChange, setPriceChange] = useState(0);
  const [prevPrice, setPrevPrice] = useState(stock.price);

  useEffect(() => {
    const change = stock.price - prevPrice;
    setPriceChange(change);
    setPrevPrice(stock.price);
  }, [stock.price]);

  const isPositive = priceChange >= 0;
  const changePercent = prevPrice !== 0 ? ((priceChange / prevPrice) * 100).toFixed(2) : 0;

  return (
    <div className="card hover:scale-105 transform transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
          <p className="text-sm text-gray-500">{stock.name}</p>
        </div>
        <span className="text-3xl">{stock.icon || '📊'}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-gray-900">
            {stock.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">جنيه</span>
        </div>
        
        <div className={`flex items-center space-x-1 space-x-reverse text-sm font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(priceChange).toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{changePercent}%)</span>
        </div>
        
        <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">الأعلى</p>
            <p className="font-semibold text-gray-700">{stock.high?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">الأدنى</p>
            <p className="font-semibold text-gray-700">{stock.low?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
