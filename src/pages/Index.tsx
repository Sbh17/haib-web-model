
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '@/context/FavoritesContext';
import { useLocation } from '@/context/LocationContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SalonCard from '@/components/SalonCard';
import NewsList from '@/components/NewsList';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { Search, MapPin, Star } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteCount } = useFavorites();
  const { userLocation, requestLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: salons = [], isLoading: salonsLoading } = useQuery({
    queryKey: ['salons'],
    queryFn: api.salons.getAll,
  });

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.news.getAll(),
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get different categories of salons
  const featuredSalons = salons.slice(0, 3);
  const topRatedSalons = salons
    .filter(salon => salon.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  // Get latest news (limit to 3)
  const latestNews = news.slice(0, 3);

  return (
    <div className="pb-20 bg-gradient-to-b from-beauty-primary/5 to-background min-h-screen">
      {/* Header */}
      <header className="bg-beauty-primary dark:bg-beauty-dark text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Logo className="mr-4" width={100} height={32} />
            <div>
              <h1 className="text-xl font-bold">
                Welcome to HAIB!
              </h1>
              <p className="text-sm opacity-90">
                Discover amazing salons and book your next appointment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-white hover:bg-white/20" />
          </div>
        </div>

        {/* Location Status */}
        <div className="flex items-center mb-4 text-sm opacity-90">
          <MapPin className="h-4 w-4 mr-2" />
          {userLocation ? (
            <span>Location enabled - Finding nearby salons</span>
          ) : (
            <button onClick={requestLocation} className="underline">
              Enable location for better recommendations
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search salons or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-white/10 text-white placeholder-white/70 focus:bg-white/20 text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-beauty-primary hover:bg-white/90 px-6 py-2"
          >
            Search
          </Button>
        </div>
      </header>

      {/* Featured Salons */}
      <section className="px-6 mb-8 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Salons</h2>
          <Link to="/search">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {salonsLoading ? (
            <LoadingSpinner />
          ) : (
            featuredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          )}
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest News</h2>
          <Link to="/news">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        {newsLoading ? (
          <LoadingSpinner />
        ) : (
          <NewsList newsItems={latestNews} showViewAll={false} />
        )}
      </section>

      <section className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Top Rated Salons</h2>
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            4.5+ Rating
          </Badge>
        </div>
        <div className="space-y-4">
          {salonsLoading ? (
            <LoadingSpinner />
          ) : topRatedSalons.length > 0 ? (
            topRatedSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No top-rated salons available at the moment</p>
            </Card>
          )}
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default Index;
