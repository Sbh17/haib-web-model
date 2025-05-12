
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeftIcon, Save } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SalonEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [salon, setSalon] = useState<Salon | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    coverImage: '',
    gallery: [] as string[],
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  });
  
  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchSalon = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: `/admin/salons/${id}` } });
        return;
      }
      
      if (!id) {
        navigate('/admin/salons');
        return;
      }
      
      setIsLoading(true);
      try {
        const salonData = await api.salon.getSalonById(id);
        setSalon(salonData);
        setFormData({
          name: salonData.name,
          description: salonData.description,
          address: salonData.address,
          city: salonData.city,
          phone: salonData.phone,
          email: salonData.email,
          coverImage: salonData.coverImage,
          gallery: salonData.gallery,
          facebook: salonData.socialLinks?.facebook || '',
          instagram: salonData.socialLinks?.instagram || '',
          twitter: salonData.socialLinks?.twitter || '',
          linkedin: salonData.socialLinks?.linkedin || '',
          youtube: salonData.socialLinks?.youtube || ''
        });
      } catch (error) {
        console.error('Error fetching salon:', error);
        toast({
          title: "Error",
          description: "Failed to load salon data",
          variant: "destructive",
        });
        navigate('/admin/salons');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalon();
  }, [user, isRole, navigate, id, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!salon) return;
    
    setIsSaving(true);
    try {
      const updatedSalon = {
        ...salon,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        coverImage: formData.coverImage,
        gallery: formData.gallery,
        socialLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          youtube: formData.youtube
        }
      };
      
      await api.admin.updateSalon(salon.id, updatedSalon);
      
      toast({
        title: "Success",
        description: `Salon "${formData.name}" has been updated`,
      });
      
      navigate('/admin/salons');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update salon",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!user || !isRole('admin')) {
    // This will be handled by the useEffect redirect
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
      </div>
      
      {/* Main content */}
      <div className="p-6">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
          </div>
        ) : (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Edit {salon?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Salon Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-2">Social Media Links</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/c/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/salons')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center"
                >
                  {isSaving ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalonEdit;
