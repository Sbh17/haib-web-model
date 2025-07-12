
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
import { Search, MapPin, Star, User } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      <header className="bg-gradient-to-r from-beauty-primary to-beauty-secondary text-white p-6 pb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Logo className="mr-4" width={120} height={40} />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome to HAIB!
                </h1>
                <p className="text-sm text-white/90">
                  Discover amazing salons and book your next appointment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/20">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/20">
                    Sign In
                  </Button>
                </Link>
              )}
              <ThemeToggle 
                className="text-white hover:bg-white/20 border-white/20" 
                variant="outline"
              />
            </div>
          </div>

          {/* Location Status */}
          <div className="flex items-center mb-6 text-sm text-white/90">
            <MapPin className="h-4 w-4 mr-2" />
            {userLocation ? (
              <span>📍 Location enabled - Finding nearby salons</span>
            ) : (
              <button 
                onClick={requestLocation} 
                className="underline hover:text-white transition-colors"
              >
                📍 Enable location for better recommendations
              </button>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl">
            <Input
              type="text"
              placeholder="Search salons, services, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-24 py-4 rounded-xl border-0 bg-white/15 backdrop-blur-sm text-white placeholder-white/70 focus:bg-white/25 text-lg focus:ring-2 focus:ring-white/30"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-beauty-primary hover:bg-white/90 px-6 py-2 rounded-lg font-medium"
            >
              Search
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Salons */}
      <section className="px-6 mb-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Featured Salons</h2>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="text-beauty-primary hover:bg-beauty-primary/10">View All</Button>
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
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Latest News</h2>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="text-beauty-primary hover:bg-beauty-primary/10">View All</Button>
            </Link>
          </div>
          {newsLoading ? (
            <LoadingSpinner />
          ) : (
            <NewsList newsItems={latestNews} showViewAll={false} />
          )}
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Top Rated Salons</h2>
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
                <p className="text-muted-foreground">No top-rated salons available at the moment</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default Index;
