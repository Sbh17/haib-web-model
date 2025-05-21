
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
import { ChevronLeftIcon, ImageIcon, PlusIcon, X, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ServiceInputCard, { ServiceInput } from '@/components/ServiceInputCard';
import { SalonRequestService, SocialMedia } from '@/types';
import { Separator } from '@/components/ui/separator';

const serviceSchema = z.object({
  name: z.string().min(1, { message: 'Service name is required' }),
  description: z.string(),
  price: z.string().min(1, { message: 'Price is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
});

const socialMediaSchema = z.object({
  facebook: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  instagram: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  twitter: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  youtube: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

const salonRequestSchema = z.object({
  name: z.string().min(2, { message: 'Salon name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  city: z.string().min(2, { message: 'City is required' }),
  businessId: z.string().min(5, { message: 'Business ID is required' }).optional(),
  ownerName: z.string().min(2, { message: 'Owner name must be at least 2 characters' }),
  ownerEmail: z.string().email({ message: 'Please enter a valid email address' }),
  ownerPhone: z.string().min(5, { message: 'Phone number is required' }),
  services: z.array(serviceSchema).optional(),
  images: z.array(z.string()).optional(),
  socialMedia: socialMediaSchema.optional(),
});

type SalonRequestFormValues = z.infer<typeof salonRequestSchema>;

const SalonRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const form = useForm<SalonRequestFormValues>({
    resolver: zodResolver(salonRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      businessId: '',
      ownerName: user?.name || '',
      ownerEmail: user?.email || '',
      ownerPhone: user?.phone || '',
      services: [{ name: '', description: '', price: '', duration: '' }],
      images: [],
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images
      if (imageFiles.length + filesArray.length > 5) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        });
        return;
      }
      
      // Create preview URLs for display
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...filesArray]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Update form values
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviewUrls(newPreviewUrls);
    
    // Update form values
    form.setValue('images', newPreviewUrls);
  };
  
  const addService = () => {
    const currentServices = form.getValues('services') || [];
    const newService: SalonRequestService = { 
      name: '', 
      description: '', 
      price: '', 
      duration: '' 
    };
    form.setValue('services', [...currentServices, newService]);
  };
  
  const removeService = (index: number) => {
    const currentServices = form.getValues('services') || [];
    if (currentServices.length > 1) {
      const newServices = [...currentServices];
      newServices.splice(index, 1);
      form.setValue('services', newServices);
    }
  };
  
  const onSubmit = async (data: SalonRequestFormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out empty social media fields
      const socialMedia: SocialMedia = {};
      if (data.socialMedia) {
        Object.entries(data.socialMedia).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            socialMedia[key as keyof SocialMedia] = value;
          }
        });
      }
      
      // Make sure all services have required fields, and filter out any incomplete ones
      const validServices = data.services?.filter(service => 
        service.name && service.price && service.duration
      ) as SalonRequestService[];
      
      // Create properly typed request data
      const requestData = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        businessId: data.businessId,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        services: validServices,
        images: data.images,
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
      };
      
      await api.salons.requestNewSalon(requestData);
      
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
              
              {/* New Business ID Field */}
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. BUS123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Social Media Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="socialMedia.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                          <FormControl>
                            <Input placeholder="Facebook URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                          <FormControl>
                            <Input placeholder="Instagram URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                          <FormControl>
                            <Input placeholder="Twitter URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Linkedin className="mr-2 h-4 w-4 text-blue-800" />
                          <FormControl>
                            <Input placeholder="LinkedIn URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMedia.youtube"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Youtube className="mr-2 h-4 w-4 text-red-600" />
                          <FormControl>
                            <Input placeholder="YouTube URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className="pt-4 border-t">
                <FormLabel className="block mb-2">Salon Images</FormLabel>
                <div className="mb-2">
                  <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Upload images (max 5)</p>
                    </div>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                </div>
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index}`} 
                          className="h-24 w-full object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Services Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Services Offered</h2>
                <Button 
                  type="button" 
                  onClick={addService}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Service
                </Button>
              </div>
              
              <div className="space-y-4">
                {form.watch('services')?.map((service, index) => (
                  <ServiceInputCard
                    key={index}
                    service={service as ServiceInput}
                    index={index}
                    control={form.control}
                    onRemove={() => removeService(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
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
