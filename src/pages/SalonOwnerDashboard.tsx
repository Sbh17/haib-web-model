
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SalonCard from '@/components/SalonCard';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const availabilityFormSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  available: z.boolean().default(true)
});

const SalonOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof availabilityFormSchema>>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      available: true
    },
  });
  
  useEffect(() => {
    // Redirect if not salon owner
    if (user && !isRole('salon_owner')) {
      navigate('/');
      return;
    }
    
    const fetchSalons = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/owner/salons' } });
        return;
      }
      
      setIsLoading(true);
      try {
        const ownedSalons = await api.salonOwner.getMySalons();
        setSalons(ownedSalons);
      } catch (error) {
        console.error('Error fetching owned salons:', error);
        toast({
          title: "Error",
          description: "Failed to load your salons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalons();
  }, [user, isRole, navigate, toast]);
  
  const handleAvailabilityClick = (salonId: string) => {
    setSelectedSalonId(salonId);
    setAvailabilityDialogOpen(true);
  };
  
  const handleSubmitAvailability = async (values: z.infer<typeof availabilityFormSchema>) => {
    if (!selectedSalonId) return;
    
    try {
      // Here you would call your API to update availability
      // Since we're using mock data, we'll just show a toast
      console.log('Submitting availability:', { salonId: selectedSalonId, ...values });
      
      toast({
        title: "Success",
        description: `Availability updated for ${values.day}`,
      });
      
      setAvailabilityDialogOpen(false);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };
  
  if (!user || !isRole('salon_owner')) {
    // This will be handled by the useEffect redirect
    return null;
  }
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/profile')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">My Salons</h1>
      </div>
      
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : salons.length > 0 ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {salons.map(salon => (
              <div key={salon.id} className="relative">
                <SalonCard salon={salon} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button 
                    className="bg-beauty-accent hover:bg-beauty-accent/90"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAvailabilityClick(salon.id);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Availability
                  </Button>
                  <Button 
                    className="bg-beauty-primary hover:bg-beauty-primary/90"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/owner/salons/${salon.id}`);
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any salons yet</p>
          <p className="text-sm text-muted-foreground">
            If you've recently submitted a salon request, it may be pending approval.
          </p>
        </div>
      )}
      
      {/* Availability Dialog */}
      <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Salon Availability</DialogTitle>
            <DialogDescription>
              Define when your salon is open for appointments.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitAvailability)} className="space-y-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Uncheck to mark this day/time as unavailable
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAvailabilityDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Availability</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalonOwnerDashboard;
