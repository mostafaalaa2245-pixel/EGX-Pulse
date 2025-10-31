import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Trading() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState(100000);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('stocks', (data) => {
      setStocks(data);
      if (!selectedStock && data.length > 0) {
        setSelectedStock(data[0]);
      }
    });

    // Fetch balance
    fetchBalance();

    return () => socket.disconnect();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleTrade = async () => {
    if (!selectedStock || quantity <= 0) {
      showMessage('الرجاء اختيار سهم وإدخال كمية صحيحة', 'error');
      return;
    }

    const totalCost = selectedStock.price * quantity;

    if (tradeType === 'buy' && totalCost > balance) {
      showMessage('رصيدك غير كافٍ لإتمام هذه العملية', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          type: tradeType,
          quantity: quantity,
          price: selectedStock.price,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage(
          tradeType === 'buy' 
            ? `تم شراء ${quantity} سهم من ${selectedStock.symbol} بنجاح!`
            : `تم بيع ${quantity} سهم من ${selectedStock.symbol} بنجاح!`,
          'success'
        );
        setQuantity(1);
        fetchBalance();
      } else {
        showMessage(data.message || 'حدث خطأ في العملية', 'error');
      }
    } catch (error) {
      showMessage('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const totalCost = selectedStock ? selectedStock.price * quantity : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          منصة التداول
        </h2>
        <p className="text-gray-600">قم بشراء وبيع الأسهم بسهولة وأمان</p>
      </div>

      {/* Balance Card */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100 mb-8 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">رصيدك الحالي</p>
          <p className="text-4xl font-bold text-green-700">
            {balance.toLocaleString('ar-EG')} <span className="text-2xl">جنيه</span>
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          <p className="text-center font-semibold">{message.text}</p>
        </div>
      )}

      {/* Trading Form */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            نموذج التداول
          </h3>

          {/* Trade Type Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                tradeType === 'buy'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              شراء 📈
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                tradeType === 'sell'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              بيع 📉
            </button>
          </div>

          {/* Stock Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              اختر السهم
            </label>
            <select
              value={selectedStock?.symbol || ''}
              onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
              className="input-field"
            >
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name} ({stock.price.toFixed(2)} جنيه)
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الكمية
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>

          {/* Summary */}
          {selectedStock && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">السهم:</span>
                <span className="font-semibold">{selectedStock.symbol}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">السعر الحالي:</span>
                <span className="font-semibold">{selectedStock.price.toFixed(2)} جنيه</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">الكمية:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-bold">الإجمالي:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {totalCost.toLocaleString('ar-EG')} جنيه
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleTrade}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
              tradeType === 'buy'
                ? 'btn-success'
                : 'btn-danger'
            }`}
          >
            {tradeType === 'buy' ? 'تأكيد الشراء' : 'تأكيد البيع'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="card text-center">
          <span className="text-3xl mb-2 block">💰</span>
          <p className="text-sm text-gray-600">رسوم التداول</p>
          <p className="text-xl font-bold text-gray-800">0%</p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2 block">⚡</span>
          <p className="text-sm text-gray-600">تنفيذ فوري</p>
          <p className="text-xl font-bold text-gray-800">لحظي</p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2 block">🔒</span>
          <p className="text-sm text-gray-600">أمان</p>
          <p className="text-xl font-bold text-gray-800">100%</p>
        </div>
      </div>
    </div>
  );
}

export default Trading;
