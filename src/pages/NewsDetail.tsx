
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeftIcon, Calendar, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import { format } from 'date-fns';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: () => id ? api.news.getById(id) : Promise.reject('No ID provided'),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">Error loading news item</p>
        <Button asChild>
          <Link to="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-beauty-primary text-white p-6">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white mb-4 hover:bg-white/10 -ml-2"
            asChild
          >
            <Link to="/news">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge className="bg-beauty-accent text-beauty-dark">
              {news.category}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {format(new Date(news.date), 'MMMM d, yyyy')}
            </div>
          </div>

          <h1 className="text-3xl font-bold">{news.title}</h1>

          {news.image && (
            <div className="overflow-hidden rounded-lg">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none mt-8">
            <p className="text-muted-foreground whitespace-pre-line">
              {news.content}
            </p>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default NewsDetail;
