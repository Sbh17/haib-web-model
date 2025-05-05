
import React from 'react';
import { Promotion } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  const isActive = new Date() >= startDate && new Date() <= endDate;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      {promotion.image && (
        <div className="h-48 relative">
          <img 
            src={promotion.image} 
            alt={promotion.title} 
            className="w-full h-full object-cover"
          />
          <Badge 
            className={`absolute top-2 right-2 ${
              isActive ? 'bg-green-500' : 'bg-gray-500'
            }`}
          >
            {isActive ? 'Active' : 'Expired'}
          </Badge>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="font-semibold text-white text-lg">{promotion.title}</h3>
          </div>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-beauty-primary/10 text-beauty-primary border-beauty-primary">
            {promotion.discount}% OFF
          </Badge>
          <div className="flex items-center text-muted-foreground text-xs">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {promotion.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
