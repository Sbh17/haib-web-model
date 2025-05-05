
import React from 'react';
import { Review } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  // Get first letter for avatar
  const getInitial = (name?: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <Card className="hover:shadow-md transition-all border border-border/50 bg-gradient-to-br from-white to-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarFallback className="bg-beauty-primary/10 text-beauty-primary">
              {getInitial(userName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
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
            <p className="text-sm mt-2 text-gray-700">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
