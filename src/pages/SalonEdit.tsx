import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon, SocialMedia, Service, ServiceCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ChevronLeftIcon, Save, X, PlusCircle, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ServiceInputCard from '@/components/ServiceInputCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Service name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
  duration: z.coerce.number().int().positive({ message: "Duration must be a positive integer" }),
  categoryId: z.string().optional(),
});

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
  services: z.array(serviceSchema).optional(),
});

type FormValues = z.infer<typeof salonSchema>;

const SalonEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // Check if the current user is a system admin
  const isAdmin = isRole('admin');

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
      },
      services: [],
    },
  });

  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchSalonData = async () => {
      if (!id) return;
      
      if (!user) {
        navigate('/login', { state: { redirectTo: `/admin/salons/${id}` } });
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch salon data
        const salonData = await api.admin.getSalonById(id);
        if (salonData) {
          setSalon(salonData);
          
          // Fetch services for this salon
          const servicesData = await api.services.getForSalon(id);
          setServices(servicesData);
          
          // Fetch service categories
          const categoriesData = await api.services.getServiceCategories();
          setCategories(categoriesData);
          
          // Update form with salon data and services
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
            },
            services: servicesData.map(service => ({
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.price,
              duration: service.duration,
              categoryId: service.categoryId,
            })),
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
    
    fetchSalonData();
  }, [user, isRole, navigate, toast, id, form]);
  
  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      // Process the data to ensure services have salonId
      const formattedData: Partial<Salon> = {
        ...data,
        services: data.services?.map(service => ({
          ...service,
          salonId: id, // Explicitly add the salonId to each service
        })) as Service[],
      };

      await api.admin.updateSalon(id, formattedData);
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
  
  const addNewService = () => {
    const currentServices = form.getValues('services') || [];
    form.setValue('services', [
      ...currentServices,
      {
        name: '',
        description: '',
        price: 0,
        duration: 30,
        categoryId: categories.length > 0 ? categories[0].id : '',
      }
    ]);
  };
  
  const removeService = (index: number) => {
    const currentServices = form.getValues('services') || [];
    form.setValue('services', currentServices.filter((_, i) => i !== index));
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
              
              {/* Services Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Salon Services</CardTitle>
                  <CardDescription>Manage the salon's services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form.watch('services')?.map((service, index) => (
                      <Card key={index} className="relative mt-4">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeService(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`services.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Haircut" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`services.${index}.price`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      Price ($)
                                      {!isAdmin && <Lock className="h-3 w-3 ml-1 text-gray-400" />}
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="25.00" 
                                        type="number" 
                                        step="0.01" 
                                        {...field} 
                                        readOnly={!isAdmin}
                                        className={!isAdmin ? "bg-gray-100 cursor-not-allowed" : ""}
                                      />
                                    </FormControl>
                                    {!isAdmin && (
                                      <p className="text-xs text-muted-foreground">
                                        Only administrators can change prices
                                      </p>
                                    )}
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`services.${index}.duration`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration (min)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="30" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`services.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="mt-3">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Describe this service..." rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {categories.length > 0 && (
                            <FormField
                              control={form.control}
                              name={`services.${index}.categoryId`}
                              render={({ field }) => (
                                <FormItem className="mt-3">
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      {...field}
                                    >
                                      {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                          {category.name}
                                        </option>
                                      ))}
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addNewService}
                      className="w-full mt-4"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Service
                    </Button>
                  </div>
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
