import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [balance, setBalance] = useState(100000);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('stocks', (data) => {
      setStocks(data);
    });

    fetchPortfolio();
    fetchBalance();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [portfolio, stocks]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/portfolio');
      const data = await response.json();
      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const calculateTotals = () => {
    let total = 0;
    let profit = 0;

    portfolio.forEach(item => {
      const currentStock = stocks.find(s => s.symbol === item.symbol);
      if (currentStock) {
        const currentValue = currentStock.price * item.quantity;
        const purchaseValue = item.avgPrice * item.quantity;
        total += currentValue;
        profit += (currentValue - purchaseValue);
      }
    });

    setTotalValue(total);
    setTotalProfit(profit);
  };

  const getCurrentPrice = (symbol) => {
    const stock = stocks.find(s => s.symbol === symbol);
    return stock ? stock.price : 0;
  };

  const calculateProfit = (item) => {
    const currentPrice = getCurrentPrice(item.symbol);
    const profit = (currentPrice - item.avgPrice) * item.quantity;
    const profitPercent = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
    return { profit, profitPercent };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          محفظتي الاستثمارية
        </h2>
        <p className="text-gray-600">تتبع أداء استثماراتك في البورصة المصرية</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-gray-600 mb-2">الرصيد النقدي</p>
          <p className="text-2xl font-bold text-blue-700">
            {balance.toLocaleString('ar-EG')}
          </p>
          <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-sm text-gray-600 mb-2">قيمة الأسهم</p>
          <p className="text-2xl font-bold text-purple-700">
            {totalValue.toLocaleString('ar-EG')}
          </p>
          <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-gray-600 mb-2">إجمالي المحفظة</p>
          <p className="text-2xl font-bold text-green-700">
            {(balance + totalValue).toLocaleString('ar-EG')}
          </p>
          <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
        </div>

        <div className={`card bg-gradient-to-br ${
          totalProfit >= 0 
            ? 'from-emerald-50 to-emerald-100' 
            : 'from-red-50 to-red-100'
        }`}>
          <p className="text-sm text-gray-600 mb-2">الربح/الخسارة</p>
          <p className={`text-2xl font-bold ${
            totalProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('ar-EG')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalValue > 0 ? ((totalProfit / totalValue) * 100).toFixed(2) : 0}%
          </p>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">أسهمي</h3>

        {portfolio.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📊</span>
            <p className="text-xl text-gray-600 mb-2">محفظتك فارغة</p>
            <p className="text-gray-500">ابدأ بشراء أسهم من صفحة التداول</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">السهم</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">الكمية</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">متوسط الشراء</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">السعر الحالي</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">القيمة الحالية</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">الربح/الخسارة</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => {
                  const currentPrice = getCurrentPrice(item.symbol);
                  const { profit, profitPercent } = calculateProfit(item);
                  const currentValue = currentPrice * item.quantity;

                  return (
                    <tr key={item.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-gray-800">{item.symbol}</p>
                          <p className="text-sm text-gray-500">{item.name}</p>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 font-semibold">
                        {item.quantity}
                      </td>
                      <td className="text-center py-4 px-4">
                        {item.avgPrice.toFixed(2)} جنيه
                      </td>
                      <td className="text-center py-4 px-4 font-semibold">
                        {currentPrice.toFixed(2)} جنيه
                      </td>
                      <td className="text-center py-4 px-4 font-bold text-gray-800">
                        {currentValue.toLocaleString('ar-EG')} جنيه
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className={`font-bold ${
                          profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {profit >= 0 ? '+' : ''}{profit.toFixed(2)} جنيه
                        </div>
                        <div className={`text-sm ${
                          profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      {portfolio.length > 0 && (
        <div className="mt-8 card">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">توزيع المحفظة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map((item) => {
              const currentPrice = getCurrentPrice(item.symbol);
              const value = currentPrice * item.quantity;
              const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

              return (
                <div key={item.symbol} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-1">{item.symbol}</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {value.toLocaleString('ar-EG')} جنيه
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
