
import React from 'react';
import { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClockIcon } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook?: () => void;
  showBookButton?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBook,
  showBookButton = true 
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      {service.image && (
        <div className="h-40">
          <img 
            src={service.image} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{service.name}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{service.duration} min</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold text-lg">${service.price}</span>
          {showBookButton && (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBook?.();
              }}
              size="sm"
              className="bg-beauty-primary hover:bg-beauty-primary/90"
            >
              Book Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
