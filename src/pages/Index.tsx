
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
    <div className="pb-20 bg-background min-h-screen">
      {/* Hero Search Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-black text-white p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="dior-heading-xl text-white mb-6">
              HAIB
            </h1>
            <p className="dior-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Discover exceptional beauty experiences and book your next appointment with the finest salons
            </p>

            {/* Location Status */}
            <div className="flex items-center justify-center mb-8 dior-body text-white/70">
              <MapPin className="h-4 w-4 mr-2" />
              {userLocation ? (
                <span>Location enabled - Finding nearby salons</span>
              ) : (
                <button 
                  onClick={requestLocation} 
                  className="underline hover:text-white/90 transition-colors tracking-wide"
                >
                  Enable location for better recommendations
                </button>
              )}
            </div>

            {/* Elegant Search Bar */}
            <div className="relative max-w-3xl mx-auto">
              <Input
                type="text"
                placeholder="Search salons, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-32 py-5 border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:bg-white/15 text-base focus:ring-1 focus:ring-white/40 font-inter tracking-wide"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-white/90 px-8 py-3 font-inter font-medium tracking-wide uppercase text-sm"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Salons */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="dior-heading-lg text-foreground mb-2">Featured Salons</h2>
              <p className="dior-body text-muted-foreground">Discover our curated selection of premium beauty destinations</p>
            </div>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="dior-label text-beauty-primary hover:bg-beauty-primary/5 tracking-widest">View All</Button>
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

      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="dior-heading-lg text-foreground mb-2">Latest News</h2>
              <p className="dior-body text-muted-foreground">Stay informed with the latest beauty trends and updates</p>
            </div>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="dior-label text-beauty-primary hover:bg-beauty-primary/5 tracking-widest">View All</Button>
            </Link>
          </div>
          {newsLoading ? (
            <LoadingSpinner />
          ) : (
            <NewsList newsItems={latestNews} showViewAll={false} />
          )}
        </div>
      </section>

      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="dior-heading-lg text-foreground mb-2">Top Rated Salons</h2>
              <p className="dior-body text-muted-foreground">Excellence recognized by our community</p>
            </div>
            <Badge variant="secondary" className="dior-label bg-black text-white px-3 py-1 tracking-widest">
              <Star className="h-3 w-3 mr-2" />
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
