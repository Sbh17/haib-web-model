
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Salon } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface FavoritesContextType {
  favorites: string[];
  favoriteCount: number;
  toggleFavorite: (salonId: string) => void;
  isFavorite: (salonId: string) => boolean;
  getFavoriteSalons: (salons: Salon[]) => Salon[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = (salonId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    const newFavorites = favorites.includes(salonId)
      ? favorites.filter(id => id !== salonId)
      : [...favorites, salonId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(salonId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(salonId) 
        ? "Salon removed from your favorites" 
        : "Salon added to your favorites",
    });
  };

  const isFavorite = (salonId: string) => {
    return favorites.includes(salonId);
  };

  const getFavoriteSalons = (salons: Salon[]) => {
    return salons.filter(salon => favorites.includes(salon.id));
  };

  const value = {
    favorites,
    favoriteCount: favorites.length,
    toggleFavorite,
    isFavorite,
    getFavoriteSalons,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
