
import React from 'react';
import { Review } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  userName?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, userName }) => {
  const reviewDate = new Date(review.createdAt);
  
  // Generate stars based on rating
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <StarIcon
      key={i}
      className={`w-4 h-4 ${
        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
      }`}
    />
  ));
  
  return (
    <Card className="hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-1">
              {stars}
            </div>
            {userName && (
              <p className="text-sm font-medium mt-1">{userName}</p>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {format(reviewDate, 'MMM d, yyyy')}
          </p>
        </div>
        <p className="text-sm mt-3">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
