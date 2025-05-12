
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract appointment details from location state if available
  const appointmentDetails = location.state?.appointmentDetails;
  
  useEffect(() => {
    // Show success toast when component mounts
    toast({
      title: "Payment Successful",
      description: "Your appointment has been confirmed and paid for.",
    });
  }, [toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Payment Confirmation</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-green-50 rounded-full p-6 mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your appointment has been confirmed.
        </p>
        
        {appointmentDetails && (
          <div className="bg-white rounded-lg border p-4 mb-8 w-full max-w-md">
            <h3 className="font-medium mb-2">Appointment Details</h3>
            <p className="text-sm text-gray-600">Service: {appointmentDetails.serviceName}</p>
            <p className="text-sm text-gray-600">Salon: {appointmentDetails.salonName}</p>
            <p className="text-sm text-gray-600">Date: {appointmentDetails.date}</p>
            <p className="text-sm text-gray-600">Amount Paid: ${appointmentDetails.amount}</p>
          </div>
        )}
        
        <div className="space-y-4 w-full max-w-md">
          <Button 
            onClick={() => navigate('/appointments')}
            className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
            style={{ backgroundColor: "#A68A73" }}
          >
            View My Appointments
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/home')}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
