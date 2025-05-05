
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItemType } from './NewsItem';
import NewsItem from './NewsItem';
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';

interface NewsListProps {
  newsItems: NewsItemType[];
  showViewAll?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ 
  newsItems, 
  showViewAll = true 
}) => {
  if (newsItems.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No news available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newsItems.map((news) => (
          <Link key={news.id} to={`/news/${news.id}`}>
            <NewsItem news={news} />
          </Link>
        ))}
      </div>
      
      {showViewAll && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            className="group"
            asChild
          >
            <Link to="/news">
              View all news
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsList;
