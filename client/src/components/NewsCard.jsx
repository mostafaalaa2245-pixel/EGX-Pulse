function NewsCard({ news }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'منذ لحظات';
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    return `منذ ${Math.floor(seconds / 86400)} يوم`;
  };

  return (
    <div className="card hover:scale-102 transform transition-all cursor-pointer">
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl">
            {news.icon || '📰'}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
              {news.category}
            </span>
            <span className="text-xs text-gray-500">{timeAgo(news.date)}</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
            {news.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {news.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary-600">
              {news.company}
            </span>
            <button className="text-sm text-primary-500 hover:text-primary-700 font-semibold">
              اقرأ المزيد ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
