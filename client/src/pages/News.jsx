import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';

function News() {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/news');
      const data = await response.json();
      setNews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const categories = ['all', 'أرباح', 'توزيعات', 'إدارة', 'توسع', 'تحليل'];

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.category === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          أخبار البورصة المصرية
        </h2>
        <p className="text-gray-600">آخر الأخبار والتحديثات من الشركات المدرجة</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === cat
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat === 'all' ? 'الكل' : cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الأخبار...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNews.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📰</span>
          <p className="text-xl text-gray-600">لا توجد أخبار في هذا القسم</p>
        </div>
      )}
    </div>
  );
}

export default News;
