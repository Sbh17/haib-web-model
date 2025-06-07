
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  salonId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  salonId, 
  className = '',
  size = 'md' 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(salonId);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        favorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500',
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(salonId);
      }}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          favorite && 'fill-current'
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;
