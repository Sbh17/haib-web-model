import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Review, Appointment, Salon, Service } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Star, MessageSquare, Calendar, Plus } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from '@/components/ui/use-toast';

interface CompletedAppointment {
  appointment: Appointment;
  salon: Salon;
  service: Service;
  hasReview: boolean;
}

const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<CompletedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<CompletedAppointment | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Get user's reviews - filter from all reviews
        const allReviews = await api.reviews.getAll();
        const userReviews = allReviews.filter(review => review.userId === user.id);
        setMyReviews(userReviews);

        // Get completed appointments that can be reviewed
        const appointments = await api.appointments.getMyAppointments(user.id);
        const completedAppts = appointments.filter(apt => apt.status === 'completed');
        
        // Get salon and service details for each completed appointment
        const appointmentsWithDetails = await Promise.all(
          completedAppts.map(async (appointment) => {
            const [salon, services] = await Promise.all([
              api.salons.getById(appointment.salonId),
              api.services.getForSalon(appointment.salonId)
            ]);
            
            const service = services.find(s => s.id === appointment.serviceId);
            const hasReview = userReviews.some(review => 
              review.appointmentId === appointment.id
            );
            
            return {
              appointment,
              salon,
              service: service!,
              hasReview
            };
          })
        );
        
        setCompletedAppointments(appointmentsWithDetails);
      } catch (error) {
        console.error('Error fetching reviews data:', error);
        toast({
          title: "Error",
          description: "Failed to load reviews data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewsData();
  }, [user, toast]);

  const handleSubmitReview = async () => {
    if (!selectedAppointment || !user) return;

    setIsSubmitting(true);
    try {
      const newReview = await api.reviews.create({
        userId: user.id,
        salonId: selectedAppointment.salon.id,
        appointmentId: selectedAppointment.appointment.id,
        rating,
        comment: reviewText.trim(),
        createdAt: new Date().toISOString()
      });

      // Update local state
      setMyReviews(prev => [newReview, ...prev]);
      setCompletedAppointments(prev => 
        prev.map(item => 
          item.appointment.id === selectedAppointment.appointment.id
            ? { ...item, hasReview: true }
            : item
        )
      );

      toast({
        title: "Success",
        description: "Your review has been submitted successfully",
      });

      setIsDialogOpen(false);
      setSelectedAppointment(null);
      setReviewText('');
      setRating(5);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewDialog = (appointment: CompletedAppointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingReviews = completedAppointments.filter(item => !item.hasReview);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground mb-4 hover:bg-white/10 -ml-2"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-light tracking-tight">My Reviews</h1>
              <p className="opacity-90 font-light">Share your beauty experiences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {pendingReviews.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="submitted">My Reviews ({myReviews.length})</TabsTrigger>
          </TabsList>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>
                  Help others by reviewing your completed appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReviews.length > 0 ? (
                  <div className="space-y-4">
                    {pendingReviews.map((item) => (
                      <div
                        key={item.appointment.id}
                        className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.service.name}</h3>
                            <p className="text-muted-foreground">{item.salon.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{item.appointment.date}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => openReviewDialog(item)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Write Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Reviews</h3>
                    <p className="text-muted-foreground">
                      Complete some appointments to share your experiences
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate('/search')}
                    >
                      Book a Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submitted Reviews Tab */}
          <TabsContent value="submitted" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
                <CardDescription>
                  Reviews you've shared with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myReviews.length > 0 ? (
                  <div className="space-y-4">
                    {myReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                    <p className="text-muted-foreground">
                      Your submitted reviews will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Service Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold">{selectedAppointment.service.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedAppointment.salon.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.appointment.date}
                </p>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label htmlFor="review-text">Your Review</Label>
                <Textarea
                  id="review-text"
                  placeholder="Share your experience with this service..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !reviewText.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Reviews;