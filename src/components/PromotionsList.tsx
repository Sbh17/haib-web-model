
import React from 'react';
import { Link } from 'react-router-dom';
import { Promotion } from '@/types';
import PromotionCard from './PromotionCard';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from './ui/button';

interface PromotionsListProps {
  promotions: Promotion[];
  showViewAll?: boolean;
}

const PromotionsList: React.FC<PromotionsListProps> = ({ 
  promotions, 
  showViewAll = true 
}) => {
  if (promotions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No current promotions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promotion) => (
          <Link key={promotion.id} to={`/salons/${promotion.salonId}`}>
            <PromotionCard promotion={promotion} />
          </Link>
        ))}
      </div>
      
      {showViewAll && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            className="group"
            asChild
          >
            <Link to="/promotions">
              View all promotions
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromotionsList;
