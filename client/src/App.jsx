import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import News from './pages/News';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">📈</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">
                  البورصة المصرية
                </h1>
              </div>
              
              <div className="flex space-x-1 space-x-reverse">
                <Link
                  to="/"
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'home'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  الرئيسية
                </Link>
                <Link
                  to="/news"
                  onClick={() => setActiveTab('news')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'news'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  الأخبار
                </Link>
                <Link
                  to="/trading"
                  onClick={() => setActiveTab('trading')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'trading'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  التداول
                </Link>
                <Link
                  to="/portfolio"
                  onClick={() => setActiveTab('portfolio')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'portfolio'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  محفظتي
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
