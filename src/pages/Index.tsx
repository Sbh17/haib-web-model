
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
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import DevTools from '@/components/DevTools';
import { Search, MapPin, Calendar, Clock, Star, TrendingUp, Users } from 'lucide-react';

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

  const { data: nearbySelons = [], isLoading: nearbyLoading } = useQuery({
    queryKey: ['salons', 'nearby', userLocation?.latitude, userLocation?.longitude],
    queryFn: () => 
      userLocation 
        ? api.salons.getNearby(userLocation.latitude, userLocation.longitude)
        : Promise.resolve([]),
    enabled: !!userLocation,
  });

  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', 'upcoming', user?.id],
    queryFn: () => user ? api.appointments.getMyAppointments(user.id) : Promise.resolve([]),
    enabled: !!user,
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

  const topSalons = salons.slice(0, 3);
  const upcomingCount = upcomingAppointments.filter(apt => 
    ['pending', 'confirmed'].includes(apt.status)
  ).length;

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
                Welcome to HAIB
              </h1>
              <p className="text-sm opacity-90">
                Book your next appointment, {user ? user.name.split(' ')[0] : 'Guest'}
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
              <Calendar className="h-6 w-6 text-beauty-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-beauty-primary">{upcomingCount}</p>
              <p className="text-xs text-gray-600">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-4">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{favoriteCount}</p>
              <p className="text-xs text-gray-600">Favorites</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{salons.length}</p>
              <p className="text-xs text-gray-600">Salons</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Book Button */}
      <div className="px-6 mb-8">
        <Button 
          onClick={() => navigate('/search')}
          className="w-full bg-beauty-primary hover:bg-beauty-primary/90 py-6 text-lg font-semibold shadow-lg"
        >
          <Clock className="h-5 w-5 mr-2" />
          Book Appointment Now
        </Button>
      </div>

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
          {nearbySelons.length > 3 && (
            <div className="text-center mt-4">
              <Link to="/search">
                <Button variant="outline" size="sm">
                  View All Nearby ({nearbySelons.length - 3} more)
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

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
            topSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          )}
        </div>
      </section>

      {/* Recent Bookings Preview */}
      {upcomingCount > 0 && (
        <section className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Appointments</h2>
            <Link to="/appointments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <Card className="bg-gradient-to-r from-beauty-primary/10 to-beauty-primary/5 border-beauty-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">You have {upcomingCount} upcoming appointment{upcomingCount !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-600">Tap to view details and manage</p>
                </div>
                <Calendar className="h-8 w-8 text-beauty-primary" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <BottomNavigation />
      <DevTools />
    </div>
  );
};

export default Index;
