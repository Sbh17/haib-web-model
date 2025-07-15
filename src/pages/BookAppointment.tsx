
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Service, SalonWorker } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeftIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { format, addDays, startOfToday, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import WorkerSelection from '@/components/WorkerSelection';


interface BookingState {
  salonId: string;
  salonName: string;
  service: Service;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM'
];

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const bookingState = location.state as BookingState;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [workers, setWorkers] = useState<SalonWorker[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState<boolean>(true);
  
  // Guard against direct navigation to this page
  if (!bookingState || !bookingState.service) {
    navigate('/');
    return null;
  }
  
  const { salonId, salonName, service } = bookingState;

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const salonWorkers = await api.salons.getWorkers(salonId);
        setWorkers(salonWorkers);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setIsLoadingWorkers(false);
      }
    };

    fetchWorkers();
  }, [salonId]);
  
  const handleProceedToCheckout = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    // Format the date for checkout
    const formattedDate = format(selectedDate, 'MMMM d, yyyy');
    
    // Navigate to payment checkout with appointment details
    navigate('/payment-checkout', {
      state: {
        salonName,
        serviceName: service.name,
        servicePrice: service.price,
        date: formattedDate,
        time: selectedTime,
        // Store additional data that will be needed for creating the appointment later
        appointmentData: {
          salonId,
          serviceId: service.id,
          workerId: selectedWorkerId,
          notes: notes.trim() || undefined,
        }
      }
    });
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !user) {
      toast({
        title: "Error",
        description: "Please select both date and time for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    // Parse time and combine with date
    const [hour, minute] = selectedTime.split(':');
    const [hourNum, period] = hour.split(' ');
    let hourInt = parseInt(hourNum);
    if (period === 'PM' && hourInt !== 12) hourInt += 12;
    if (period === 'AM' && hourInt === 12) hourInt = 0;
    
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hourInt);
    appointmentDate.setMinutes(parseInt(minute));
    
    setIsSubmitting(true);
    
    try {
      await api.appointments.bookAppointment({
        userId: user.id,
        salonId,
        serviceId: service.id,
        workerId: selectedWorkerId,
        date: appointmentDate.toISOString(),
        status: 'confirmed',
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Your appointment has been booked!",
      });
      
      navigate('/appointments');
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pb-6">
      
      <div className="p-6">
        {/* Service Info */}
        <div className="p-4 rounded-lg bg-muted mb-6">
          <h2 className="font-medium text-lg">{service.name}</h2>
          <p className="text-muted-foreground text-sm">{salonName}</p>
          <div className="flex items-center mt-2 text-sm">
            <ClockIcon className="w-4 h-4 mr-1 text-gray-500" />
            <span>{service.duration} minutes</span>
            <span className="mx-2">•</span>
            <span className="font-medium">${service.price}</span>
          </div>
        </div>

        {/* Worker Selection */}
        {!isLoadingWorkers && (
          <div className="mb-6">
            <WorkerSelection
              workers={workers}
              selectedWorkerId={selectedWorkerId}
              onWorkerSelect={setSelectedWorkerId}
            />
          </div>
        )}
        
        {/* Date Selection */}
        <div className="mb-6">
          <Label className="block mb-3 text-base">Select Date</Label>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < startOfToday() || date > addDays(new Date(), 60)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time Selection */}
        <div className="mb-6">
          <Label className="block mb-3 text-base">Select Time</Label>
          
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={selectedTime === time ? "bg-beauty-primary" : ""}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Please select a date first
            </p>
          )}
        </div>
        
        {/* Notes */}
        <div className="mb-8">
          <Label htmlFor="notes" className="block mb-2">
            Additional Notes (optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or information for the salon..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        
        {/* Book Button */}
        <Button
          className="w-full bg-beauty-primary hover:bg-beauty-primary/90 py-6 text-lg"
          disabled={!selectedDate || !selectedTime || isSubmitting}
          onClick={handleProceedToCheckout}
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;
