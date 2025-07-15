
import React from 'react';
import { Link } from 'react-router-dom';
import { Salon } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon, MapPinIcon } from 'lucide-react';

interface SalonCardProps {
  salon: Salon;
  className?: string;
  showDistance?: boolean;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, className = '', showDistance = false }) => {
  return (
    <Link to={`/salon/${salon.id}`}>
      <Card className={`luxury-card overflow-hidden transition-all duration-300 hover:shadow-xl group ${className}`}>
        <div className="relative h-64 md:h-72">
          <img 
            src={salon.coverImage} 
            alt={salon.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="dior-heading-sm text-white mb-2 truncate">{salon.name}</h3>
            <div className="flex items-center text-white/90 dior-body-sm">
              <MapPinIcon className="w-4 h-4 mr-2" />
              <span className="truncate">{salon.city}</span>
              {showDistance && salon.distance && (
                <span className="ml-3 text-xs opacity-80">• {salon.distance}km</span>
              )}
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-amber-400 mr-2" />
              <span className="dior-body font-medium">{salon.rating.toFixed(1)}</span>
              <span className="dior-body-sm text-muted-foreground ml-2">({salon.reviewCount})</span>
            </div>
            <span className="dior-label text-beauty-primary">
              {salon.services.length} Services
            </span>
          </div>
          <p className="dior-body text-muted-foreground line-clamp-2 leading-relaxed">{salon.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SalonCard;
