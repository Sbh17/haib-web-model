
import React, { useState } from 'react';
import { Calendar, Clock, User, CreditCard, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Salon, Service, SalonWorker } from '@/types';
import { cn } from '@/lib/utils';

interface EnhancedBookingFlowProps {
  salon: Salon;
  selectedService?: Service;
  onComplete: (bookingData: BookingData) => void;
  onCancel: () => void;
}

export interface BookingData {
  serviceId: string;
  workerId?: string;
  date: string;
  time: string;
  notes?: string;
  totalPrice: number;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const mockWorkers: SalonWorker[] = [
  {
    id: 'worker-1',
    salonId: 'salon-1',
    name: 'Sarah Johnson',
    specialty: 'Hair Stylist',
    bio: 'Expert in modern cuts and color',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '555-0101',
    email: 'sarah@salon.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'worker-2',
    salonId: 'salon-1',
    name: 'Maria Garcia',
    specialty: 'Nail Technician',
    bio: 'Specializing in nail art and manicures',
    avatar: 'https://i.pravatar.cc/150?img=2',
    phone: '555-0102',
    email: 'maria@salon.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const EnhancedBookingFlow: React.FC<EnhancedBookingFlowProps> = ({
  salon,
  selectedService,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    serviceId: selectedService?.id,
    totalPrice: selectedService?.price || 0
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>(timeSlots);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Service & Worker', icon: User },
    { number: 2, title: 'Date & Time', icon: Calendar },
    { number: 3, title: 'Details', icon: Clock },
    { number: 4, title: 'Confirmation', icon: Check }
  ];

  // Generate next 14 days
  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return dates;
  };

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({
      ...prev,
      serviceId: service.id,
      totalPrice: service.price
    }));
  };

  const handleWorkerSelect = (workerId: string) => {
    setBookingData(prev => ({ ...prev, workerId }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Simulate loading available slots for the selected date
    setTimeout(() => {
      const randomSlots = timeSlots.filter(() => Math.random() > 0.3);
      setAvailableSlots(randomSlots);
    }, 500);
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, date: selectedDate, time }));
  };

  const handleNotesChange = (notes: string) => {
    setBookingData(prev => ({ ...prev, notes }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.serviceId;
      case 2:
        return bookingData.date && bookingData.time;
      case 3:
        return true; // Notes are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (bookingData.serviceId && bookingData.date && bookingData.time) {
      onComplete(bookingData as BookingData);
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked.",
      });
    }
  };

  const selectedServiceData = salon.services.find(s => s.id === bookingData.serviceId) || selectedService;
  const selectedWorker = mockWorkers.find(w => w.id === bookingData.workerId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                isActive && 'bg-beauty-primary border-beauty-primary text-white',
                isCompleted && 'bg-green-500 border-green-500 text-white',
                !isActive && !isCompleted && 'border-gray-300 text-gray-500'
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={cn(
                  'text-sm font-medium',
                  isActive && 'text-beauty-primary',
                  isCompleted && 'text-green-600',
                  !isActive && !isCompleted && 'text-gray-500'
                )}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-12 h-0.5 mx-4',
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6 mb-6">
        {/* Step 1: Service & Worker Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Service & Worker</h2>
            
            {/* Service Selection */}
            <div>
              <h3 className="font-medium mb-3">Choose a Service</h3>
              <div className="grid gap-3">
                {salon.services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-colors hover:border-beauty-primary',
                      bookingData.serviceId === service.id && 'border-beauty-primary bg-beauty-primary/5'
                    )}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <p className="text-sm text-gray-500 mt-2">{service.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Selection */}
            <div>
              <h3 className="font-medium mb-3">Choose a Worker (Optional)</h3>
              <div className="grid gap-3">
                <div
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-colors hover:border-beauty-primary',
                    !bookingData.workerId && 'border-beauty-primary bg-beauty-primary/5'
                  )}
                  onClick={() => handleWorkerSelect('')}
                >
                  <p className="font-medium">No preference</p>
                  <p className="text-sm text-gray-600">Let the salon assign the best available worker</p>
                </div>
                {mockWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-colors hover:border-beauty-primary',
                      bookingData.workerId === worker.id && 'border-beauty-primary bg-beauty-primary/5'
                    )}
                    onClick={() => handleWorkerSelect(worker.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar || 'https://i.pravatar.cc/150?img=1'}
                        alt={worker.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{worker.name}</h4>
                        <p className="text-sm text-gray-600">{worker.specialty}</p>
                        <p className="text-sm text-gray-500">{worker.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Date & Time</h2>
            
            {/* Date Selection */}
            <div>
              <h3 className="font-medium mb-3">Choose a Date</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {generateDateOptions().map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    className="p-3 h-auto flex flex-col"
                    onClick={() => handleDateSelect(date.value)}
                  >
                    <span className="text-sm">{date.label}</span>
                    {date.isToday && <Badge variant="secondary" className="mt-1 text-xs">Today</Badge>}
                    {date.isTomorrow && <Badge variant="secondary" className="mt-1 text-xs">Tomorrow</Badge>}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="font-medium mb-3">Available Times</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={bookingData.time === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                {availableSlots.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No available slots for this date</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Additional Details</h2>
            
            <div>
              <h3 className="font-medium mb-3">Special Requests or Notes (Optional)</h3>
              <Textarea
                placeholder="Any special requests, preferences, or notes for your appointment..."
                value={bookingData.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
            
            {/* Booking Summary */}
            <Card className="p-4 bg-gray-50">
              <h3 className="font-medium mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Salon:</span>
                  <span className="font-medium">{salon.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedServiceData?.name}</span>
                </div>
                {selectedWorker && (
                  <div className="flex justify-between">
                    <span>Worker:</span>
                    <span className="font-medium">{selectedWorker.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {bookingData.date && new Date(bookingData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedServiceData?.duration} minutes</span>
                </div>
                {bookingData.notes && (
                  <div className="flex justify-between">
                    <span>Notes:</span>
                    <span className="font-medium">{bookingData.notes}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${bookingData.totalPrice}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep < 4 ? (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()}
              className="bg-beauty-primary hover:bg-beauty-primary/90"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="bg-beauty-primary hover:bg-beauty-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingFlow;
