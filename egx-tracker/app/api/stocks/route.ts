import { NextResponse } from 'next/server';
import { Stock } from '@/types';

const egyptianStocks: Omit<Stock, 'price' | 'change' | 'changePercent' | 'high' | 'low' | 'history'>[] = [
  { symbol: 'EGX30', name: 'مؤشر EGX30', volume: 15000000, open: 27000, previousClose: 27000 },
  { symbol: 'COMI', name: 'كوميرشيال انترناشيونال بنك', volume: 8500000, open: 57.2, previousClose: 57.2 },
  { symbol: 'ETEL', name: 'المصرية للاتصالات', volume: 6200000, open: 27.5, previousClose: 27.5 },
  { symbol: 'HELI', name: 'هليوبوليس للإسكان', volume: 4100000, open: 85.3, previousClose: 85.3 },
  { symbol: 'PHDC', name: 'بالم هيلز للتعمير', volume: 5800000, open: 3.45, previousClose: 3.45 },
  { symbol: 'TMGH', name: 'طلعت مصطفى القابضة', volume: 7300000, open: 28.9, previousClose: 28.9 },
  { symbol: 'SWDY', name: 'السويدي إليكتريك', volume: 3900000, open: 12.75, previousClose: 12.75 },
  { symbol: 'HRHO', name: 'حديد عز', volume: 4600000, open: 45.2, previousClose: 45.2 },
  { symbol: 'OCDI', name: 'أوراسكوم للتنمية', volume: 2800000, open: 18.65, previousClose: 18.65 },
  { symbol: 'EKHO', name: 'القابضة المصرية الكويتية', volume: 3200000, open: 1.89, previousClose: 1.89 },
  { symbol: 'ESRS', name: 'مصر للمقاصة', volume: 1900000, open: 95.4, previousClose: 95.4 },
  { symbol: 'FWRY', name: 'فوري لتكنولوجيا البنوك', volume: 5100000, open: 42.3, previousClose: 42.3 },
];

let stocksData: Stock[] = [];
let priceHistory: { [key: string]: number[] } = {};

function initializeStocks() {
  if (stocksData.length === 0) {
    stocksData = egyptianStocks.map(stock => {
      const randomChange = (Math.random() - 0.5) * 2;
      const price = stock.open * (1 + randomChange / 100);
      const change = price - stock.previousClose;
      const changePercent = (change / stock.previousClose) * 100;
      
      priceHistory[stock.symbol] = [price];
      
      return {
        ...stock,
        price,
        change,
        changePercent,
        high: price * 1.02,
        low: price * 0.98,
        history: [price],
      };
    });
  }
}

function updateStockPrices() {
  stocksData = stocksData.map(stock => {
    const volatility = 0.5;
    const randomChange = (Math.random() - 0.5) * volatility;
    const newPrice = Math.max(stock.price * (1 + randomChange / 100), 0.01);
    
    const change = newPrice - stock.previousClose;
    const changePercent = (change / stock.previousClose) * 100;
    
    if (!priceHistory[stock.symbol]) {
      priceHistory[stock.symbol] = [];
    }
    priceHistory[stock.symbol].push(newPrice);
    
    if (priceHistory[stock.symbol].length > 20) {
      priceHistory[stock.symbol].shift();
    }
    
    return {
      ...stock,
      price: newPrice,
      change,
      changePercent,
      high: Math.max(stock.high, newPrice),
      low: Math.min(stock.low, newPrice),
      history: [...priceHistory[stock.symbol]],
    };
  });
}

initializeStocks();

setInterval(updateStockPrices, 3000);

export async function GET() {
  updateStockPrices();
  return NextResponse.json(stocksData);
}
