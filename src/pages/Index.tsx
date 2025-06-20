
import React, { useEffect, useState } from 'react';
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
import PromotionCard from '@/components/PromotionCard';
import NewsItem from '@/components/NewsItem';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import DevTools from '@/components/DevTools';
import { Search, MapPin, Bell, Star, TrendingUp, Calendar, Users } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { favoriteCount } = useFavorites();
  const { userLocation, requestLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const { data: salons = [], isLoading: salonsLoading } = useQuery({
    queryKey: ['salons'],
    queryFn: api.salons.getAll,
    enabled: !!user,
  });

  const { data: promotions = [], isLoading: promotionsLoading } = useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: api.promotions.getActive,
    enabled: !!user,
  });

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['news', 'latest'],
    queryFn: () => api.news.getLatest(3),
    enabled: !!user,
  });

  const { data: nearbySelons = [], isLoading: nearbyLoading } = useQuery({
    queryKey: ['salons', 'nearby', userLocation?.latitude, userLocation?.longitude],
    queryFn: () => 
      userLocation 
        ? api.salons.getNearby(userLocation.latitude, userLocation.longitude)
        : Promise.resolve([]),
    enabled: !!user && !!userLocation,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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

  const topSalons = salons.slice(0, 5);
  const topPromotions = promotions.slice(0, 3);

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-beauty-primary text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-beauty-primary text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">Welcome back, {user.name.split(' ')[0]}!</h1>
              <div className="flex items-center text-sm opacity-90">
                <MapPin className="h-3 w-3 mr-1" />
                {userLocation ? (
                  <span>Current location detected</span>
                ) : (
                  <button onClick={requestLocation} className="underline">
                    Enable location
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/appointments">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search salons, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-beauty-primary hover:bg-white/90 px-4 py-1.5 text-sm"
          >
            Search
          </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-6 -mt-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{favoriteCount}</p>
              <p className="text-xs text-gray-600">Favorites</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Calendar className="h-6 w-6 text-beauty-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-gray-600">Appointments</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">15%</p>
              <p className="text-xs text-gray-600">Savings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Promotions */}
      {topPromotions.length > 0 && (
        <section className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Special Offers</h2>
            <Link to="/promotions">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {promotionsLoading ? (
              <LoadingSpinner />
            ) : (
              topPromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Top Rated Salons */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Top Rated Salons</h2>
          <Link to="/search">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {salonsLoading ? (
            <LoadingSpinner />
          ) : (
            topSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          )}
        </div>
      </section>

      {/* Nearby Salons */}
      {userLocation && nearbySelons.length > 0 && (
        <section className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Near You</h2>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Within 10km
            </Badge>
          </div>
          <div className="space-y-4">
            {nearbyLoading ? (
              <LoadingSpinner />
            ) : (
              nearbySelons.slice(0, 3).map((salon) => (
                <SalonCard key={salon.id} salon={salon} showDistance />
              ))
            )}
          </div>
        </section>
      )}

      {/* Latest News */}
      {news.length > 0 && (
        <section className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Beauty News</h2>
            <Link to="/news">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {newsLoading ? (
              <LoadingSpinner />
            ) : (
              news.map((item) => (
                <NewsItem key={item.id} news={item} />
              ))
            )}
          </div>
        </section>
      )}

      <BottomNavigation />
      <DevTools />
    </div>
  );
};

export default Index;
