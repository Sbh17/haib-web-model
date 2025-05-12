
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon, SocialMedia } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ChevronLeftIcon, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const salonSchema = z.object({
  name: z.string().min(2, { message: "Salon name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  coverImage: z.string().url({ message: "Please enter a valid image URL" }),
  status: z.enum(["pending", "approved", "rejected"]),
  socialMedia: z.object({
    facebook: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
    instagram: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
    twitter: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
    youtube: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  }).optional(),
});

type FormValues = z.infer<typeof salonSchema>;

const SalonEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salon, setSalon] = useState<Salon | null>(null);

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      coverImage: '',
      status: 'pending' as const,
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      }
    },
  });

  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchSalon = async () => {
      if (!id) return;
      
      if (!user) {
        navigate('/login', { state: { redirectTo: `/admin/salons/${id}` } });
        return;
      }
      
      setIsLoading(true);
      try {
        const salonData = await api.admin.getSalonById(id);
        if (salonData) {
          setSalon(salonData);
          // Update form with salon data
          form.reset({
            name: salonData.name,
            description: salonData.description,
            address: salonData.address,
            city: salonData.city,
            coverImage: salonData.coverImage,
            status: salonData.status,
            socialMedia: salonData.socialMedia || {
              facebook: '',
              instagram: '',
              twitter: '',
              linkedin: '',
              youtube: '',
            }
          });
        } else {
          toast({
            title: "Salon not found",
            description: "The requested salon could not be found",
            variant: "destructive",
          });
          navigate('/admin/salons');
        }
      } catch (error) {
        console.error('Error fetching salon:', error);
        toast({
          title: "Error",
          description: "Failed to load salon data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalon();
  }, [user, isRole, navigate, toast, id, form]);
  
  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      await api.admin.updateSalon(id, data);
      toast({
        title: "Success",
        description: `Salon ${data.name} has been updated`,
      });
      navigate('/admin/salons');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update salon",
        variant: "destructive",
      });
      console.error('Error updating salon:', error);
    }
  };
  
  if (!user || !isRole('admin')) {
    return null;
  }
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate('/admin/salons')}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Edit Salon</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/salons')}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-beauty-primary hover:bg-beauty-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update the salon's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salon Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter salon name" />
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
                            {...field} 
                            placeholder="Enter salon description"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter salon address" />
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
                            <Input {...field} placeholder="Enter city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter image URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Update the salon's social media links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="socialMedia.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://facebook.com/yoursalon" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://instagram.com/yoursalon" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://twitter.com/yoursalon" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://linkedin.com/company/yoursalon" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://youtube.com/channel/yoursalon" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default SalonEdit;
