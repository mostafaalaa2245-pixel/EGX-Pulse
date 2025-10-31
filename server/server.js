import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Egyptian Stock Market Data
let stocks = [
  { 
    symbol: "EGX30", 
    name: "مؤشر EGX30",
    price: 27000, 
    high: 27500, 
    low: 26800,
    icon: "📊"
  },
  { 
    symbol: "COMI", 
    name: "كوميرشال انترناشيونال",
    price: 57.2, 
    high: 58.5, 
    low: 56.0,
    icon: "🏦"
  },
  { 
    symbol: "ETEL", 
    name: "المصرية للاتصالات",
    price: 27.5, 
    high: 28.2, 
    low: 27.0,
    icon: "📱"
  },
  { 
    symbol: "HELI", 
    name: "هليوبوليس",
    price: 95.3, 
    high: 97.0, 
    low: 94.5,
    icon: "🏢"
  },
  { 
    symbol: "EKHO", 
    name: "القابضة المصرية الكويتية",
    price: 12.8, 
    high: 13.2, 
    low: 12.5,
    icon: "💼"
  },
  { 
    symbol: "SWDY", 
    name: "السويدي إليكتريك",
    price: 45.6, 
    high: 46.8, 
    low: 45.0,
    icon: "⚡"
  },
  { 
    symbol: "HRHO", 
    name: "حديد عز",
    price: 34.2, 
    high: 35.0, 
    low: 33.8,
    icon: "🏗️"
  },
  { 
    symbol: "OCDI", 
    name: "أوراسكوم للتنمية",
    price: 89.5, 
    high: 91.0, 
    low: 88.5,
    icon: "🏘️"
  },
];

// News Data
const newsData = [
  {
    id: 1,
    title: "كوميرشال انترناشيونال تعلن عن أرباح قياسية للربع الثالث",
    description: "حققت البنك التجاري الدولي أرباحاً قياسية بلغت 5.2 مليار جنيه في الربع الثالث من العام الحالي",
    company: "COMI",
    category: "أرباح",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: "💰"
  },
  {
    id: 2,
    title: "المصرية للاتصالات توقع اتفاقية شراكة استراتيجية",
    description: "وقعت المصرية للاتصالات اتفاقية شراكة مع شركة عالمية لتطوير خدمات الجيل الخامس",
    company: "ETEL",
    category: "توسع",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: "🤝"
  },
  {
    id: 3,
    title: "هليوبوليس تعلن عن توزيعات أرباح سخية للمساهمين",
    description: "قررت الجمعية العامة لشركة هليوبوليس توزيع أرباح بقيمة 3 جنيهات للسهم الواحد",
    company: "HELI",
    category: "توزيعات",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    icon: "💵"
  },
  {
    id: 4,
    title: "السويدي إليكتريك تفوز بعقد حكومي ضخم",
    description: "حصلت السويدي إليكتريك على عقد بقيمة 2 مليار جنيه لتوريد معدات كهربائية",
    company: "SWDY",
    category: "أرباح",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    icon: "📝"
  },
  {
    id: 5,
    title: "تعيين رئيس تنفيذي جديد لحديد عز",
    description: "أعلنت شركة حديد عز عن تعيين رئيس تنفيذي جديد بخبرة 25 عاماً في صناعة الحديد",
    company: "HRHO",
    category: "إدارة",
    date: new Date(Date.now() - 18 * 60 * 60 * 1000),
    icon: "👔"
  },
  {
    id: 6,
    title: "أوراسكوم للتنمية تطلق مشروع سياحي جديد",
    description: "كشفت أوراسكوم للتنمية عن خطط لإطلاق مشروع سياحي متكامل باستثمارات 10 مليار جنيه",
    company: "OCDI",
    category: "توسع",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: "🏖️"
  },
];

// Portfolio and Balance Storage
const dataFile = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return { balance: 100000, portfolio: [] };
}

function saveData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

let userData = loadData();

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("Client connected ✅");

  // Send initial stock data
  socket.emit("stocks", stocks);

  // Update stock prices every 3 seconds
  const interval = setInterval(() => {
    stocks = stocks.map(s => {
      const change = (Math.random() - 0.5) * (s.price * 0.02); // 2% max change
      const newPrice = Math.max(s.price + change, s.price * 0.5); // Don't go below 50% of original
      
      return {
        ...s,
        price: +newPrice.toFixed(2),
        high: Math.max(s.high, newPrice),
        low: Math.min(s.low, newPrice)
      };
    });
    socket.emit("stocks", stocks);
  }, 3000);

  socket.on("disconnect", () => {
    console.log("Client disconnected ❌");
    clearInterval(interval);
  });
});

// REST API Endpoints

app.get("/", (req, res) => {
  res.send("EGX Smart Tracker Backend is running 🚀");
});

app.get("/api/stocks", (req, res) => {
  res.json(stocks);
});

app.get("/api/news", (req, res) => {
  res.json(newsData);
});

app.get("/api/balance", (req, res) => {
  res.json({ balance: userData.balance });
});

app.get("/api/portfolio", (req, res) => {
  res.json({ portfolio: userData.portfolio });
});

app.post("/api/trade", (req, res) => {
  const { symbol, type, quantity, price } = req.body;

  if (!symbol || !type || !quantity || !price) {
    return res.json({ success: false, message: "بيانات غير مكتملة" });
  }

  const totalCost = price * quantity;

  if (type === "buy") {
    if (totalCost > userData.balance) {
      return res.json({ success: false, message: "رصيد غير كافٍ" });
    }

    userData.balance -= totalCost;

    const existingStock = userData.portfolio.find(s => s.symbol === symbol);
    if (existingStock) {
      const totalQuantity = existingStock.quantity + quantity;
      const totalValue = (existingStock.avgPrice * existingStock.quantity) + totalCost;
      existingStock.avgPrice = totalValue / totalQuantity;
      existingStock.quantity = totalQuantity;
    } else {
      const stock = stocks.find(s => s.symbol === symbol);
      userData.portfolio.push({
        symbol,
        name: stock?.name || symbol,
        quantity,
        avgPrice: price
      });
    }

    saveData(userData);
    return res.json({ success: true, message: "تم الشراء بنجاح" });

  } else if (type === "sell") {
    const existingStock = userData.portfolio.find(s => s.symbol === symbol);
    
    if (!existingStock) {
      return res.json({ success: false, message: "لا تملك هذا السهم" });
    }

    if (existingStock.quantity < quantity) {
      return res.json({ success: false, message: "الكمية المطلوبة غير متوفرة" });
    }

    userData.balance += totalCost;
    existingStock.quantity -= quantity;

    if (existingStock.quantity === 0) {
      userData.portfolio = userData.portfolio.filter(s => s.symbol !== symbol);
    }

    saveData(userData);
    return res.json({ success: true, message: "تم البيع بنجاح" });
  }

  res.json({ success: false, message: "نوع عملية غير صحيح" });
});

// Reset endpoint for testing
app.post("/api/reset", (req, res) => {
  userData = { balance: 100000, portfolio: [] };
  saveData(userData);
  res.json({ success: true, message: "تم إعادة تعيين البيانات" });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
