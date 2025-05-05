
import React from 'react';
import { Link } from 'react-router-dom';
import { Salon } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon, MapPinIcon } from 'lucide-react';

interface SalonCardProps {
  salon: Salon;
  className?: string;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon, className = '' }) => {
  return (
    <Link to={`/salons/${salon.id}`}>
      <Card className={`overflow-hidden transition-all hover:shadow-lg ${className}`}>
        <div className="relative h-48">
          <img 
            src={salon.coverImage} 
            alt={salon.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="font-semibold text-white text-lg truncate">{salon.name}</h3>
            <div className="flex items-center text-white text-sm">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span className="truncate">{salon.city}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{salon.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({salon.reviewCount})</span>
            </div>
            <span className="text-sm text-beauty-primary font-medium">
              {salon.services.length} services
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{salon.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SalonCard;
