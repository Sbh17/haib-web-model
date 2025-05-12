
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeftIcon, CreditCard, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CheckoutState {
  salonName: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
}

const PaymentCheckout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  
  // Get checkout data from location state
  const checkoutData = location.state as CheckoutState;
  
  // Guard against direct navigation to this page
  if (!checkoutData) {
    navigate('/');
    return null;
  }
  
  const { salonName, serviceName, servicePrice, date, time } = checkoutData;
  
  // Calculate totals
  const subtotal = servicePrice;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  const handlePayment = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your payment",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectTo: location.pathname, checkoutData } });
      return;
    }
    
    setIsProcessing(true);
    
    // In a real app, this would process the payment via Stripe, PayPal, etc.
    // For now, we'll simulate a payment process
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to success page with appointment details
      navigate('/payment-success', { 
        state: { 
          appointmentDetails: {
            serviceName,
            salonName,
            date: `${date} at ${time}`,
            amount: total.toFixed(2)
          }
        }
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Payment</h1>
      </div>
      
      <div className="flex-1 p-6">
        {/* Appointment summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg mb-4">Appointment Summary</h2>
            
            <div className="space-y-3">
              <div className="flex">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span className="flex-1">Salon</span>
                <span className="font-medium">{salonName}</span>
              </div>
              
              <div className="flex">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="flex-1">Service</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              
              <div className="flex">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="flex-1">Date & Time</span>
                <span className="font-medium">{date}, {time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment methods */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
          
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="apple" id="apple" />
                <Label htmlFor="apple" className="flex-1 cursor-pointer">Apple Pay</Label>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 12.9c-.1-1.2.5-2.4 1.4-3.1-.5-.7-1.4-1.2-2.3-1.4-1-.1-1.9.5-2.4.5-.5 0-1.2-.5-2-.5-1 .1-2 .6-2.5 1.4-1.1 1.9-.3 4.7.8 6.2.5.7 1.1 1.5 2 1.5.8 0 1.1-.5 2-.5.9 0 1.2.5 2 .5s1.4-.8 1.9-1.5c.3-.5.6-1 .7-1.6-1.1-.4-1.7-1.5-1.6-2.7v-.3zm-1.7-5.5c.7-.8.6-2 .6-2-.7 0-1.4.5-1.8 1.1-.4.6-.7 1.4-.6 2.1.8.1 1.4-.4 1.8-1.2z" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="google" id="google" />
                <Label htmlFor="google" className="flex-1 cursor-pointer">Google Pay</Label>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.5-13.5h-3v3h3v-3zm0 4.5h-3v3h3v-3zm4.5-4.5h-3v3h3v-3zm0 4.5h-3v3h3v-3z" />
                </svg>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Payment summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg mb-4">Payment Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Submit button */}
        <Button
          className="w-full bg-beauty-primary hover:bg-beauty-primary/90 py-6 text-lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Pay Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentCheckout;
