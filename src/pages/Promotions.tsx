
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import PromotionsList from '@/components/PromotionsList';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Promotions: React.FC = () => {
  const { data: promotions, isLoading, error } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => api.promotions.getAll(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">Error loading promotions</p>
        <Button asChild>
          <Link to="/home">Go to Homepage</Link>
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
            <Link to="/home">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Special Offers</h1>
          <p className="opacity-90">Discover the latest promotions from our partner salons</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {promotions && <PromotionsList promotions={promotions} showViewAll={false} />}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Promotions;
