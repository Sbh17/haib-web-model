
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Review } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewSystemProps {
  salonId: string;
  reviews: Review[];
  canWriteReview?: boolean;
  onReviewSubmit: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  className?: string;
}

interface ReviewFilters {
  rating: number | null;
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  salonId,
  reviews,
  canWriteReview = false,
  onReviewSubmit,
  className
}) => {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [filters, setFilters] = useState<ReviewFilters>({
    rating: null,
    sortBy: 'newest'
  });
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Calculate rating statistics
  const ratingStats = {
    average: reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0,
    total: reviews.length,
    distribution: [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
    }))
  };

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || newReview.comment.trim() === '') {
      toast({
        title: "Incomplete Review",
        description: "Please provide both a rating and a comment.",
        variant: "destructive"
      });
      return;
    }

    onReviewSubmit({
      userId: 'current-user', // This would be the actual user ID
      salonId,
      rating: newReview.rating,
      comment: newReview.comment.trim()
    });

    setNewReview({ rating: 0, comment: '' });
    setShowWriteReview(false);
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpfulVote = (reviewId: string, isHelpful: boolean) => {
    setHelpfulVotes(prev => ({ ...prev, [reviewId]: isHelpful }));
    toast({
      title: "Thank you!",
      description: "Your feedback helps others find the best reviews.",
    });
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => filters.rating === null || review.rating === filters.rating)
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          // This would use actual helpful vote data from the backend
          return 0;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number, interactive = false, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
            onClick={interactive ? () => handleStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Rating Overview */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-4xl font-bold">{ratingStats.average.toFixed(1)}</span>
              {renderStars(Math.round(ratingStats.average), false, 'lg')}
            </div>
            <p className="text-gray-600">Based on {ratingStats.total} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingStats.distribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-4">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Write Review Section */}
      {canWriteReview && (
        <Card className="p-6">
          {!showWriteReview ? (
            <div className="text-center">
              <h3 className="font-medium mb-2">Share Your Experience</h3>
              <p className="text-gray-600 mb-4">Help others by writing a review</p>
              <Button onClick={() => setShowWriteReview(true)}>
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Write Your Review</h3>
              
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(newReview.rating, true, 'lg')}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  placeholder="Share your experience with this salon..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>Submit Review</Button>
                <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Filters and Sorting */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by rating:</span>
            <div className="flex gap-1">
              <Button
                variant={filters.rating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, rating }))}
                  className="flex items-center gap-1"
                >
                  {rating}
                  <Star className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${review.userId}`} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  {/* Helpful buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Was this helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, true)}
                      className={cn(
                        'text-green-600 hover:text-green-700',
                        helpfulVotes[review.id] === true && 'bg-green-50'
                      )}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, false)}
                      className={cn(
                        'text-red-600 hover:text-red-700',
                        helpfulVotes[review.id] === false && 'bg-red-50'
                      )}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
