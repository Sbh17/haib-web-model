
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLocation } from '@/context/LocationContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import SalonCard from '@/components/SalonCard';
import NewsList from '@/components/NewsList';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import DevTools from '@/components/DevTools';
import { Search, MapPin, Calendar, Star, TrendingUp, Heart } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteCount } = useFavorites();
  const { userLocation, requestLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const { data: salons = [], isLoading: salonsLoading } = useQuery({
    queryKey: ['salons'],
    queryFn: api.salons.getAll,
  });

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.news.getAll(),
  });

  if (!user) {
    return null; // Will redirect to login
  }

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
    <div className="pb-20 bg-gradient-to-b from-beauty-primary/5 to-background">
      {/* Header */}
      <header className="bg-beauty-primary text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3 border-2 border-white/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-beauty-primary text-white">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                Welcome back, {user ? user.name.split(' ')[0] : 'Guest'}!
              </h1>
              <p className="text-sm opacity-90">
                Discover amazing salons and book your next appointment
              </p>
            </div>
          </div>
          <Link to="/appointments">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>
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

      {/* Quick Stats */}
      <div className="px-6 -mt-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-4">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{topRatedSalons.length}</p>
              <p className="text-xs text-gray-600">Top Rated</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-4">
              <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{favoriteCount}</p>
              <p className="text-xs text-gray-600">Favorites</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-4">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{salons.length}</p>
              <p className="text-xs text-gray-600">Total Salons</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Salons */}
      <section className="px-6 mb-8">
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

      {/* Latest News */}
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

      {/* Top Rated Salons */}
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
      <DevTools />
    </div>
  );
};

export default Index;
