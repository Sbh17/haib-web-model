
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon, Service, Review, Promotion } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  StarIcon, MapPinIcon, PhoneIcon, ClockIcon, ChevronLeftIcon, 
  CalendarIcon, MessageSquareIcon
} from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import ReviewCard from '@/components/ReviewCard';
import PromotionCard from '@/components/PromotionCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

const SalonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSalonData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [salonData, servicesData, reviewsData, promotionsData] = await Promise.all([
          api.salons.getById(id),
          api.services.getForSalon(id),
          api.reviews.getForSalon(id),
          api.promotions.getForSalon(id)
        ]);
        
        setSalon(salonData);
        setServices(servicesData);
        setReviews(reviewsData);
        setPromotions(promotionsData);
      } catch (error) {
        console.error('Error fetching salon data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalonData();
  }, [id]);
  
  const handleBookService = (service: Service) => {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/salons/${id}` } });
      return;
    }
    
    setSelectedService(service);
    setIsDialogOpen(true);
  };
  
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const categoryId = service.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  // Mock function for booking
  const handleBookNow = () => {
    if (!selectedService || !salon) return;
    
    navigate('/appointments/book', { 
      state: { 
        salonId: salon.id,
        salonName: salon.name,
        service: selectedService
      } 
    });
    setIsDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!salon) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Salon not found</p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-4"
          variant="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      {/* Salon Header */}
      <div className="relative h-64">
        <img 
          src={salon.coverImage} 
          alt={salon.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 top-0 p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/70 hover:bg-white/90 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{salon.name}</h1>
          <div className="flex items-center text-white text-sm mt-1">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{salon.address}, {salon.city}</span>
          </div>
          <div className="flex items-center text-white text-sm mt-1">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-medium">{salon.rating.toFixed(1)}</span>
            <span className="ml-1">({salon.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      {/* Salon Details */}
      <div className="p-6">
        <p className="text-gray-700">{salon.description}</p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <Button 
            className="flex-1 bg-beauty-primary hover:bg-beauty-primary/90"
            onClick={() => document.getElementById('services-tab')?.click()}
          >
            <CalendarIcon className="h-4 w-4 mr-2" /> Book Now
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => document.getElementById('reviews-tab')?.click()}
          >
            <MessageSquareIcon className="h-4 w-4 mr-2" /> Reviews
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-3 bg-muted mx-6">
          <TabsTrigger value="services" id="services-tab">Services</TabsTrigger>
          {promotions.length > 0 && (
            <TabsTrigger value="promotions">Offers</TabsTrigger>
          )}
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Services Tab */}
        <TabsContent value="services" className="p-6 pt-4">
          {Object.entries(servicesByCategory).map(([categoryId, categoryServices]) => {
            const categoryName = salon.services.find(s => s.categoryId === categoryId)?.categoryId || 'Other';
            return (
              <div key={categoryId} className="mb-8">
                <h3 className="font-semibold text-lg mb-3">{categoryName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service}
                      onBook={() => handleBookService(service)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {services.length === 0 && (
            <p className="text-gray-500 text-center py-8">No services available</p>
          )}
        </TabsContent>
        
        {/* Promotions Tab */}
        {promotions.length > 0 && (
          <TabsContent value="promotions" className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map(promotion => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </TabsContent>
        )}
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="p-6 pt-4">
          <div className="grid grid-cols-1 gap-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          {reviews.length === 0 && (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-medium text-lg">{selectedService.name}</h3>
                <p className="text-muted-foreground">{salon.name}</p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>{selectedService.duration} minutes</span>
                  <span className="mx-2">•</span>
                  <span>${selectedService.price}</span>
                </div>
              </div>
              
              <Button
                className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
                onClick={handleBookNow}
              >
                Continue to Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default SalonDetail;
