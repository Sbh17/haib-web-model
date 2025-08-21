
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
      {/* Luxury Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="luxury-hero p-12 md:p-20 mb-16 rounded-lg relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-playfair font-light text-beauty-light mb-8 tracking-luxury">
              H<span className="gold-accent">A</span>IB
            </h1>
            <div className="w-24 h-0.5 bg-beauty-accent mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-inter font-light text-beauty-light/90 mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Where luxury meets beauty. Experience exceptional treatments in the finest salons, curated for the discerning clientele.
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

            {/* Luxury Search Bar */}
            <div className="relative max-w-4xl mx-auto">
              <div className="elegant-border bg-beauty-light/10 backdrop-blur-md rounded-none p-2">
                <Input
                  type="text"
                  placeholder="Discover your perfect beauty experience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-16 pr-40 py-6 border-none bg-transparent text-beauty-light placeholder-beauty-light/60 focus:ring-2 focus:ring-beauty-accent text-lg font-inter tracking-wide"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-beauty-accent" />
                <Button
                  onClick={handleSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 beauty-button px-10 py-4 text-sm"
                >
                  Discover
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Salons */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-light text-foreground mb-4 tracking-luxury">
              Featured <span className="gold-accent">Experiences</span>
            </h2>
            <div className="w-16 h-0.5 bg-beauty-accent mx-auto mb-6"></div>
            <p className="text-lg font-inter font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Handpicked sanctuaries of beauty where excellence meets luxury
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salonsLoading ? (
              <div className="col-span-full flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              featuredSalons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-light text-foreground mb-4 tracking-luxury">
              Beauty <span className="gold-accent">Chronicles</span>
            </h2>
            <div className="w-16 h-0.5 bg-beauty-accent mx-auto mb-6"></div>
            <p className="text-lg font-inter font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in the latest trends and timeless beauty wisdom
            </p>
          </div>
          {newsLoading ? (
            <LoadingSpinner />
          ) : (
            <NewsList newsItems={latestNews} showViewAll={false} />
          )}
        </div>
      </section>

      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-light text-foreground mb-4 tracking-luxury">
              Award <span className="gold-accent">Winners</span>
            </h2>
            <div className="w-16 h-0.5 bg-beauty-accent mx-auto mb-6"></div>
            <p className="text-lg font-inter font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Celebrated establishments that define excellence in beauty
            </p>
            <Badge className="mt-6 bg-gradient-to-r from-beauty-accent to-beauty-accent/80 text-beauty-dark px-6 py-2 tracking-widest font-playfair">
              <Star className="h-4 w-4 mr-2" />
              4.5+ Rated Excellence
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salonsLoading ? (
              <div className="col-span-full flex justify-center">
                <LoadingSpinner />
              </div>
            ) : topRatedSalons.length > 0 ? (
              topRatedSalons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))
            ) : (
              <Card className="col-span-full p-6 text-center">
                <p className="text-muted-foreground">No top-rated salons available at the moment</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* AI Chat Section - Above Footer */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-playfair font-light text-gray-900 mb-4 tracking-luxury">
                Your Personal <span className="text-yellow-600 font-medium">AI Assistant</span>
              </h2>
              <div className="w-16 h-0.5 bg-yellow-600 mx-auto mb-6"></div>
              <p className="text-lg font-inter font-light text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
                Get instant help with bookings, recommendations, and beauty advice from our intelligent assistant
              </p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Button 
                  variant="outline" 
                  className="border-yellow-600/50 text-gray-900 hover:bg-yellow-600/10 py-6 text-sm tracking-wide"
                  onClick={() => {
                    const chatInput = document.querySelector('input[placeholder*="Ask about beauty"]') as HTMLInputElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.value = "Book a haircut appointment";
                      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                >
                  Book Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="border-yellow-600/50 text-gray-900 hover:bg-yellow-600/10 py-6 text-sm tracking-wide"
                  onClick={() => {
                    const chatInput = document.querySelector('input[placeholder*="Ask about beauty"]') as HTMLInputElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.value = "Find nail salons near me";
                      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                >
                  Find Salons
                </Button>
                <Button 
                  variant="outline" 
                  className="border-yellow-600/50 text-gray-900 hover:bg-yellow-600/10 py-6 text-sm tracking-wide"
                  onClick={() => {
                    const chatInput = document.querySelector('input[placeholder*="Ask about beauty"]') as HTMLInputElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.value = "Show my appointments";
                      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                >
                  My Bookings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default Index;
