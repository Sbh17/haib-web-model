
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';
import { format } from 'date-fns';

export interface NewsItemType {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
  category: string;
}

interface NewsItemProps {
  news: NewsItemType;
}

const NewsItem: React.FC<NewsItemProps> = ({ news }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <Badge className="bg-beauty-accent text-beauty-dark">
            {news.category}
          </Badge>
          <div className="text-muted-foreground text-xs">
            {format(new Date(news.date), 'MMM d, yyyy')}
          </div>
        </div>
        <CardTitle className="mt-2 text-xl">{news.title}</CardTitle>
      </CardHeader>
      {news.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="pt-4">
        <p className="text-muted-foreground line-clamp-2">
          {news.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsItem;
