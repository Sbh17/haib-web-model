
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SalonCard from '@/components/SalonCard';

const SalonOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Redirect if not salon owner
    if (user && !isRole('salon_owner')) {
      navigate('/');
      return;
    }
    
    const fetchSalons = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/owner/salons' } });
        return;
      }
      
      setIsLoading(true);
      try {
        const ownedSalons = await api.salonOwner.getMySalons();
        setSalons(ownedSalons);
      } catch (error) {
        console.error('Error fetching owned salons:', error);
        toast({
          title: "Error",
          description: "Failed to load your salons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalons();
  }, [user, isRole, navigate, toast]);
  
  if (!user || !isRole('salon_owner')) {
    // This will be handled by the useEffect redirect
    return null;
  }
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/profile')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">My Salons</h1>
      </div>
      
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : salons.length > 0 ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {salons.map(salon => (
              <div key={salon.id} className="relative">
                <SalonCard salon={salon} />
                <Button 
                  className="absolute top-2 right-2 bg-beauty-primary hover:bg-beauty-primary/90"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/owner/salons/${salon.id}`);
                  }}
                >
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any salons yet</p>
          <p className="text-sm text-muted-foreground">
            If you've recently submitted a salon request, it may be pending approval.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalonOwnerDashboard;
