
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeftIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const salonRequestSchema = z.object({
  name: z.string().min(2, { message: 'Salon name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  city: z.string().min(2, { message: 'City is required' }),
  ownerName: z.string().min(2, { message: 'Owner name must be at least 2 characters' }),
  ownerEmail: z.string().email({ message: 'Please enter a valid email address' }),
  ownerPhone: z.string().min(5, { message: 'Phone number is required' }),
});

type SalonRequestFormValues = z.infer<typeof salonRequestSchema>;

const SalonRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SalonRequestFormValues>({
    resolver: zodResolver(salonRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      ownerName: user?.name || '',
      ownerEmail: user?.email || '',
      ownerPhone: user?.phone || '',
    },
  });
  
  const onSubmit = async (data: SalonRequestFormValues) => {
    setIsSubmitting(true);
    try {
      await api.salons.requestNewSalon(data);
      
      toast({
        title: "Request Submitted",
        description: "Your salon request has been submitted and is pending review.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pb-6">
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
        <h1 className="text-xl font-semibold">Request a Salon</h1>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Complete the form below to request listing your salon on our platform. 
            Our team will review your request and get back to you shortly.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Salon Information</h2>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Elegant Beauty Salon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your salon and the services you offer..." 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-medium">Owner Information</h2>
              
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ownerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="owner@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit Request"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SalonRequest;
