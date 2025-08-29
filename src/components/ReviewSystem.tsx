
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
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              interactive && 'cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-sm',
              star <= rating 
                ? 'fill-primary text-primary drop-shadow-sm' 
                : 'text-muted-foreground/40 hover:text-muted-foreground transition-colors'
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
    <div className={cn('space-y-8', className)}>
      {/* Rating Overview */}
      <Card className="glass-card p-8 border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <span className="dior-elegance text-5xl font-light bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {ratingStats.average.toFixed(1)}
              </span>
              {renderStars(Math.round(ratingStats.average), false, 'lg')}
            </div>
            <p className="text-muted-foreground font-medium">
              Based on <span className="text-foreground font-semibold">{ratingStats.total}</span> reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingStats.distribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3 group">
                <span className="text-sm font-medium w-4 text-muted-foreground">{rating}</span>
                <Star className="h-4 w-4 fill-primary/80 text-primary/80" />
                <div className="flex-1 bg-muted/30 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="beauty-gradient h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground w-8 group-hover:text-foreground transition-colors">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Write Review Section */}
      {canWriteReview && (
        <Card className="glass-card p-8 border-0 bg-gradient-to-br from-background/60 to-secondary/20 backdrop-blur-xl">
          {!showWriteReview ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h3 className="dior-elegance text-xl font-light text-foreground">Share Your Experience</h3>
                <p className="text-muted-foreground">Help others discover excellence</p>
              </div>
              <Button 
                onClick={() => setShowWriteReview(true)}
                className="luxury-gradient hover:shadow-luxury transition-all duration-300 px-8 py-3"
              >
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="dior-elegance text-xl font-light text-foreground">Your Review</h3>
              
              {/* Rating Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">Rating</label>
                <div className="flex justify-center md:justify-start">
                  {renderStars(newReview.rating, true, 'lg')}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">Your Experience</label>
                <Textarea
                  placeholder="Share the details of your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="glass-card border-muted/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center md:justify-start">
                <Button 
                  onClick={handleSubmitReview}
                  className="luxury-gradient hover:shadow-luxury transition-all duration-300 px-6"
                >
                  Submit Review
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowWriteReview(false)}
                  className="glass-card border-muted/50 hover:bg-muted/20 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Filters and Sorting */}
      <Card className="glass-card p-6 border-0 bg-gradient-to-r from-background/60 to-secondary/10 backdrop-blur-sm">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Filter by rating:</span>
            <div className="flex gap-2">
              <Button
                variant={filters.rating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
                className={cn(
                  filters.rating === null 
                    ? "luxury-gradient text-white shadow-luxury" 
                    : "glass-card border-muted/50 hover:bg-muted/20"
                )}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, rating }))}
                  className={cn(
                    "flex items-center gap-1",
                    filters.rating === rating
                      ? "luxury-gradient text-white shadow-luxury"
                      : "glass-card border-muted/50 hover:bg-muted/20"
                  )}
                >
                  {rating}
                  <Star className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-6 bg-border/50" />

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="glass-card text-sm border border-muted/50 rounded-lg px-3 py-2 bg-background/50 backdrop-blur-sm focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <Card className="glass-card p-12 text-center border-0 bg-gradient-to-br from-background/40 to-secondary/10 backdrop-blur-sm">
            <div className="space-y-4">
              <User className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="dior-elegance text-lg font-light text-foreground">No reviews yet</h3>
                <p className="text-muted-foreground">Be the first to share your experience!</p>
              </div>
            </div>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="glass-card p-6 border-0 bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm hover:shadow-luxury transition-all duration-300 group">
              <div className="flex items-start gap-6">
                <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${review.userId}`} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground font-medium">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-foreground leading-relaxed">{review.comment}</p>
                  
                  {/* Helpful buttons */}
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-sm text-muted-foreground">Was this helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review.id, true)}
                        className={cn(
                          'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all',
                          helpfulVotes[review.id] === true && 'bg-emerald-50 shadow-sm'
                        )}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review.id, false)}
                        className={cn(
                          'text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all',
                          helpfulVotes[review.id] === false && 'bg-red-50 shadow-sm'
                        )}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        No
                      </Button>
                    </div>
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
