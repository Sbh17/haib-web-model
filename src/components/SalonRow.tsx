
import React from 'react';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';

interface SalonRowProps {
  salon: Salon;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SalonRow: React.FC<SalonRowProps> = ({ salon, onEdit, onDelete }) => {
  const createdDate = new Date(salon.createdAt);
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-4">
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <img 
            src={salon.coverImage} 
            alt={salon.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{salon.name}</h3>
            <Badge 
              className={`ml-2 ${statusColors[salon.status]}`}
            >
              {salon.status.charAt(0).toUpperCase() + salon.status.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{salon.address}, {salon.city}</span>
          </div>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center mr-4">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{salon.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">({salon.reviewCount})</span>
            </div>
            <span className="text-xs text-gray-400">
              Added on {format(createdDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEdit}
          className="text-blue-500 border-blue-500 hover:bg-blue-50"
        >
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default SalonRow;
