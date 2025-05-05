
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon, Promotion } from '@/types';
import { Button } from '@/components/ui/button';
import { SearchIcon, MapPinIcon, ArrowRightIcon } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import PromotionCard from '@/components/PromotionCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

const Index: React.FC = () => {
  const { user } = useAuth();
  const { userLocation, requestLocation } = useLocationContext();
  const [nearbySalons, setNearbySalons] = useState<Salon[]>([]);
  const [topRatedSalons, setTopRatedSalons] = useState<Salon[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get all salons
        const allSalons = await api.salons.getAll();
        
        // Sort by rating for top rated
        const sortedSalons = [...allSalons].sort((a, b) => b.rating - a.rating);
        setTopRatedSalons(sortedSalons.slice(0, 3));
        
        // Get nearby salons if location is available
        if (userLocation) {
          const nearby = await api.salons.getNearby(
            userLocation.latitude,
            userLocation.longitude,
            10 // 10km radius
          );
          setNearbySalons(nearby.slice(0, 3));
        }
        
        // Get active promotions
        const promotions = await api.promotions.getActive();
        setActivePromotions(promotions);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userLocation]);
  
  const handleLocationRequest = () => {
    requestLocation();
  };
  
  return (
    <div className="pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <header className="bg-beauty-primary text-white p-6 pt-12 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">BeautySpot</h1>
            <p className="text-sm opacity-90">Find & book your perfect treatment</p>
          </div>
          {user ? (
            <Link to="/profile">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-medium">
                {user.name.charAt(0)}
              </div>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="secondary" className="bg-white text-beauty-primary hover:bg-white/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        {/* Search Bar */}
        <Link to="/search">
          <div className="flex items-center bg-white rounded-full p-3 text-gray-600">
            <SearchIcon className="h-5 w-5 ml-2 mr-1 text-gray-400" />
            <div className="text-gray-400">Search for salons, services...</div>
          </div>
        </Link>
        
        {/* Location Button */}
        <div className="mt-6 flex items-center">
          <Button 
            variant="ghost" 
            className="text-white flex items-center hover:bg-white/10 p-0"
            onClick={handleLocationRequest}
          >
            <MapPinIcon className="h-5 w-5 mr-1" />
            {userLocation ? 'Update my location' : 'Use my location'}
          </Button>
        </div>
      </header>
      
      <main className="p-6">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
          </div>
        ) : (
          <>
            {/* Nearby Salons Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nearby Salons</h2>
                <Link to="/search" className="text-beauty-primary text-sm flex items-center">
                  View all <ArrowRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
              
              {nearbySalons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nearbySalons.map(salon => (
                    <SalonCard key={salon.id} salon={salon} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <p className="text-gray-600 mb-3">
                    {userLocation ? "No salons found nearby" : "Share your location to find nearby salons"}
                  </p>
                  <Button 
                    onClick={handleLocationRequest}
                    className="bg-beauty-primary hover:bg-beauty-primary/90"
                  >
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {userLocation ? "Update location" : "Share location"}
                  </Button>
                </div>
              )}
            </section>
            
            {/* Top Rated Salons Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Top Rated Salons</h2>
                <Link to="/search" className="text-beauty-primary text-sm flex items-center">
                  View all <ArrowRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topRatedSalons.map(salon => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            </section>
            
            {/* Promotions Section */}
            {activePromotions.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Special Offers</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activePromotions.map(promotion => (
                    <Link key={promotion.id} to={`/salons/${promotion.salonId}`}>
                      <PromotionCard promotion={promotion} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
