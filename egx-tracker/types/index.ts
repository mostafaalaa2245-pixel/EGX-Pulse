export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  history?: number[];
}

export interface News {
  id: string;
  title: string;
  summary: string;
  company: string;
  date: string;
  category: 'earnings' | 'announcement' | 'market' | 'analysis';
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Portfolio {
  cash: number;
  holdings: {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    totalValue: number;
    profit: number;
    profitPercent: number;
  }[];
  totalValue: number;
  totalProfit: number;
  totalProfitPercent: number;
}
