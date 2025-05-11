
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  
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
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                <svg className="h-5 w-5 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .634-.544h6.401c2.063 0 3.58.444 4.502 1.319.866.822 1.227 1.94 1.073 3.331 0 .031-.005.063-.01.094 0 .014-.003.029-.004.043l-.005.065-.001.014-.828 5.14v.003c-.057.38-.154.751-.285 1.108a5.5 5.5 0 0 1-.54 1.069c-.349.52-.78.96-1.286 1.307a6.699 6.699 0 0 1-1.764.827 9.161 9.161 0 0 1-2.195.337H7.076v-.005zm1.863-1.89c.63-.749 1.641-1.916 2.406-1.916 1.845 0 2.918-.592 3.419-2.134.55-1.693.297-2.795-.753-3.316-.552-.273-1.3-.406-2.443-.406h-.204c-.366 0-.398.276-.531 1.227-.133.952-.757 4.924-.879 5.806-.025.177-.051.35-.074.52l-.43.312c.201-.044.403-.083.602-.093z" />
                  <path d="M20.82 8.534c0 .003 0 .006-.002.009 0 .003 0 .005-.001.008l-.001.01v.004c-.993 5.222-4.395 7.014-8.727 7.014h-.217c-.52 0-.962.38-1.042.9l-.819 5.19a.641.641 0 0 0 .634.737h3.152c.53 0 .981-.384 1.065-.908l.043-.236.831-5.404.054-.286a1.064 1.064 0 0 1 1.065-.909h.67c4.346 0 7.752-1.81 8.744-7.042.412-2.164.198-3.978-1.482-5.246-.498-.38-1.1-.663-1.8-.856a10.88 10.88 0 0 0-1.697-.3c-.087-.01-.176-.018-.266-.026h-4.899c-.52 0-.963.38-1.043.9l-.818 5.189a.642.642 0 0 0 .634.736h3.154c.527 0 .98-.384 1.063-.908l.043-.236.831-5.402.053-.287c.084-.524.539-.907 1.064-.907h.671c4.347 0 7.751 1.81 8.745 7.042.412 2.163.198 3.975-1.483 5.247-.498.38-1.101.663-1.8.855-.56.155-1.123.258-1.697.301-.087.009-.175.018-.266.026" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">Pay at Salon</Label>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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
          ) : paymentMethod === 'cash' ? (
            'Confirm Appointment'
          ) : (
            'Pay Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentCheckout;
