import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MapPin, Star } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, favoriteCount } = useFavorites();
  const [favoriteSalons, setFavoriteSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchFavoriteSalons = async () => {
      if (!user || favorites.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get all salons and filter by favorites
        const allSalons = await api.salons.getAll();
        const favoritesList = allSalons.filter(salon => favorites.includes(salon.id));
        setFavoriteSalons(favoritesList);
      } catch (error) {
        console.error('Error fetching favorite salons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteSalons();
  }, [user, favorites]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground mb-4 hover:bg-white/10 -ml-2"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-light tracking-tight">My Favorites</h1>
              <p className="opacity-90 font-light">
                {favoriteCount} saved {favoriteCount === 1 ? 'salon' : 'salons'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : favoriteSalons.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              No Favorites Yet
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring our beautiful salons and save your favorites for quick access. 
              Tap the heart icon on any salon to add it to your favorites.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/search')}
                className="bg-primary hover:bg-primary/90"
              >
                Discover Salons
              </Button>
              <div className="text-sm text-muted-foreground">
                or{' '}
                <button
                  onClick={() => navigate('/home')}
                  className="text-primary hover:underline"
                >
                  browse featured salons
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Your Favorite Salons</h3>
                      <p className="text-muted-foreground">
                        {favoriteCount} carefully curated {favoriteCount === 1 ? 'choice' : 'choices'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/search')}
                  >
                    Find More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteSalons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => navigate('/search')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Discover More</div>
                      <div className="text-sm text-muted-foreground">
                        Find new salons to love
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => {
                      // Navigate to search with favorites filter
                      navigate('/search', { state: { showFavoritesOnly: true } });
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">Book a Service</div>
                      <div className="text-sm text-muted-foreground">
                        Quick booking from favorites
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => navigate('/appointments')}
                  >
                    <div className="text-left">
                      <div className="font-medium">My Appointments</div>
                      <div className="text-sm text-muted-foreground">
                        View your bookings
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Favorites;