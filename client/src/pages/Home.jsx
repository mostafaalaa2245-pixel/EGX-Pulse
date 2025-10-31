import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import StockCard from '../components/StockCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Home() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [priceHistory, setPriceHistory] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('stocks', (data) => {
      setStocks(data);
      
      // Update price history for chart
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      
      setPriceHistory(prev => {
        const newHistory = { ...prev };
        data.forEach(stock => {
          if (!newHistory[stock.symbol]) {
            newHistory[stock.symbol] = { labels: [], prices: [] };
          }
          newHistory[stock.symbol].labels.push(now);
          newHistory[stock.symbol].prices.push(stock.price);
          
          // Keep only last 20 data points
          if (newHistory[stock.symbol].labels.length > 20) {
            newHistory[stock.symbol].labels.shift();
            newHistory[stock.symbol].prices.shift();
          }
        });
        return newHistory;
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedStock && priceHistory[selectedStock]) {
      const history = priceHistory[selectedStock];
      setChartData({
        labels: history.labels,
        datasets: [
          {
            label: selectedStock,
            data: history.prices,
            borderColor: 'rgb(24, 144, 255)',
            backgroundColor: 'rgba(24, 144, 255, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    }
  }, [selectedStock, priceHistory]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `حركة سعر ${selectedStock || ''}`,
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          متابعة الأسهم اللحظية
        </h2>
        <p className="text-gray-600">تحديث مباشر لأسعار الأسهم في البورصة المصرية</p>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2 space-x-reverse bg-red-100 text-red-700 px-4 py-2 rounded-full">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-semibold">بث مباشر</span>
        </div>
      </div>

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => setSelectedStock(stock.symbol)}
            className="cursor-pointer"
          >
            <StockCard stock={stock} />
          </div>
        ))}
      </div>

      {/* Chart Section */}
      {selectedStock && priceHistory[selectedStock] && (
        <div className="card">
          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Market Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الأسهم</p>
              <p className="text-3xl font-bold text-green-700">{stocks.length}</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">حالة السوق</p>
              <p className="text-2xl font-bold text-blue-700">مفتوح</p>
            </div>
            <span className="text-4xl">🔔</span>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">آخر تحديث</p>
              <p className="text-xl font-bold text-purple-700">
                {new Date().toLocaleTimeString('ar-EG')}
              </p>
            </div>
            <span className="text-4xl">⏰</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
