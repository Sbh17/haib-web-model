import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ImageIcon, 
  PlusIcon, 
  X, 
  Upload,
  Crown,
  Star,
  CheckCircle2,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration_minutes: z.number().min(15, 'Duration must be at least 15 minutes'),
  category: z.string().default('general'),
});

const socialMediaSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
});

const partnershipSchema = z.object({
  salon_name: z.string().min(2, 'Salon name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required'),
  business_id: z.string().optional(),
  owner_name: z.string().min(2, 'Owner name is required'),
  owner_email: z.string().email('Valid owner email is required'),
  owner_phone: z.string().optional(),
  social_media: socialMediaSchema.optional(),
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

type PartnershipFormValues = z.infer<typeof partnershipSchema>;

interface Service {
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category: string;
}

const EnhancedPartnershipApplication: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      salon_name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: user?.email || '',
      business_id: '',
      owner_name: '',
      owner_email: user?.email || '',
      owner_phone: '',
      social_media: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      services: [
        {
          name: '',
          description: '',
          price: 0,
          duration_minutes: 60,
          category: 'general'
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'services',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (imageFiles.length + files.length > 10) {
        toast({
          title: 'Too many images',
          description: 'Maximum 10 images allowed',
          variant: 'destructive',
        });
        return;
      }

      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...files]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    if (coverImageUrl) {
      URL.revokeObjectURL(coverImageUrl);
    }
    setCoverImageFile(null);
    setCoverImageUrl('');
  };

  const uploadImages = async (partnershipId: string) => {
    const uploadedUrls: string[] = [];
    let coverImagePath = '';

    setUploadProgress(10);

    // Upload cover image
    if (coverImageFile) {
      const coverPath = `${user?.id}/${partnershipId}/cover-${Date.now()}-${coverImageFile.name}`;
      const { error: coverError } = await supabase.storage
        .from('partnership-media')
        .upload(coverPath, coverImageFile);
      
      if (!coverError) {
        coverImagePath = coverPath;
      }
    }

    setUploadProgress(30);

    // Upload gallery images
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = `${user?.id}/${partnershipId}/gallery-${Date.now()}-${i}-${file.name}`;
      
      const { error } = await supabase.storage
        .from('partnership-media')
        .upload(filePath, file);
      
      if (!error) {
        uploadedUrls.push(filePath);
      }
      
      setUploadProgress(30 + (i / imageFiles.length) * 50);
    }

    return { galleryImages: uploadedUrls, coverImage: coverImagePath };
  };

  const onSubmit = async (data: PartnershipFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit your application',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // First, create the partnership request
      const partnershipData = {
        user_id: user.id,
        salon_name: data.salon_name,
        description: data.description,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
        business_id: data.business_id,
        owner_name: data.owner_name,
        owner_email: data.owner_email,
        owner_phone: data.owner_phone,
        social_media: data.social_media || {},
      };

      const { data: partnership, error: partnershipError } = await supabase
        .from('salon_partnership_requests')
        .insert(partnershipData)
        .select()
        .single();

      if (partnershipError) {
        throw partnershipError;
      }

      setUploadProgress(80);

      // Upload images
      const { galleryImages, coverImage } = await uploadImages(partnership.id);

      // Update partnership with image URLs
      await supabase
        .from('salon_partnership_requests')
        .update({
          images: galleryImages,
          cover_image: coverImage,
        })
        .eq('id', partnership.id);

      setUploadProgress(90);

      // Insert services
      const serviceInserts = data.services.map(service => ({
        partnership_request_id: partnership.id,
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration_minutes: service.duration_minutes,
        category: service.category,
      }));

      const { error: servicesError } = await supabase
        .from('partnership_request_services')
        .insert(serviceInserts);

      if (servicesError) {
        throw servicesError;
      }

      setUploadProgress(100);

      toast({
        title: 'Application Submitted Successfully!',
        description: 'Your VIP partnership application has been submitted. We\'ll review it and get back to you within 24 hours.',
      });

      // Reset form
      form.reset();
      setImageFiles([]);
      setImagePreviewUrls([]);
      setCoverImageFile(null);
      setCoverImageUrl('');

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const addService = () => {
    append({
      name: '',
      description: '',
      price: 0,
      duration_minutes: 60,
      category: 'general'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <Badge variant="outline" className="mb-4 px-4 py-2 border-beauty-primary/20 bg-beauty-light/50">
          <Crown className="w-4 h-4 mr-2" />
          VIP Partnership Application
        </Badge>
        <h1 className="dior-heading-lg text-beauty-primary mb-4">
          Join Our Elite Network
        </h1>
        <p className="dior-body text-beauty-secondary max-w-2xl mx-auto">
          Complete your comprehensive application to become a VIP partner. 
          Include your salon's media and services to showcase your excellence.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary flex items-center gap-2">
                <Star className="w-5 h-5" />
                Salon Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salon_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salon Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Luxury Beauty Salon" {...field} />
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salon Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your salon's unique atmosphere, specialties, and what makes it exceptional..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Beauty Street, Downtown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Registration ID</FormLabel>
                      <FormControl>
                        <Input placeholder="BUS123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@salon.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-beauty-accent/30 rounded-lg p-8 text-center">
                  {coverImageUrl ? (
                    <div className="relative">
                      <img 
                        src={coverImageUrl} 
                        alt="Cover preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeCoverImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-beauty-secondary" />
                      <p className="dior-body text-beauty-secondary mb-4">
                        Upload your salon's main cover image
                      </p>
                      <label className="cursor-pointer">
                        <Button type="button" variant="outline">
                          Choose Cover Image
                        </Button>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Salon Gallery (Max 10 images)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-beauty-accent/30 rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-beauty-secondary" />
                  <p className="dior-body-sm text-beauty-secondary mb-4">
                    Showcase your salon's interior, services, and atmosphere
                  </p>
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Add Images
                    </Button>
                    <input 
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Services Offered
                </div>
                <Button type="button" onClick={addService} variant="outline" size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-beauty-accent/20 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="dior-body font-medium">Service {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Luxury Facial" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Skincare" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="150"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.duration_minutes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="90"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe this service in detail..."
                              rows={2}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary">
                Social Media Presence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="social_media.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
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
                  name="social_media.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
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
                  name="social_media.youtube"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <Youtube className="w-5 h-5 text-red-600" />
                        <FormControl>
                          <Input placeholder="YouTube URL" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="dior-heading-sm text-beauty-primary">
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="owner_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="owner@salon.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="luxury-card bg-gradient-to-r from-beauty-cream to-beauty-light">
            <CardContent className="p-8 text-center">
              {isSubmitting && (
                <div className="mb-6">
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="dior-body-sm text-beauty-secondary">
                    Submitting your application... {uploadProgress}%
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-beauty-success" />
                <h3 className="dior-heading-sm text-beauty-primary mb-2">
                  Ready to Join Our VIP Network?
                </h3>
                <p className="dior-body text-beauty-secondary">
                  Your comprehensive application will be reviewed by our partnership team within 24 hours.
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-dior text-beauty-light hover:shadow-luxury px-12 py-6 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Submit VIP Application
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedPartnershipApplication;