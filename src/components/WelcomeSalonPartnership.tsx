import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';

interface SalonRequestForm {
  salonName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

const WelcomeSalonPartnership: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<SalonRequestForm>({
    salonName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof SalonRequestForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Partnership Request Submitted",
        description: "Thank you for your interest! We'll contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        salonName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        message: ''
      });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Expand Your Clientele",
      description: "Access thousands of potential customers actively seeking premium beauty services"
    },
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Boost your bookings with our intelligent matching system and promotional tools"
    },
    {
      icon: Shield,
      title: "Professional Support",
      description: "Dedicated account management and 24/7 technical support for your business"
    },
    {
      icon: Sparkles,
      title: "Premium Positioning",
      description: "Showcase your salon among the finest establishments in the beauty industry"
    }
  ];

  const features = [
    "Integrated booking management system",
    "Real-time calendar synchronization",
    "Customer review and rating system",
    "Promotional campaign tools",
    "Analytics and insights dashboard",
    "Mobile-optimized salon profile"
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
            Partner with HAIB
          </Badge>
          <h2 className="dior-heading-lg text-foreground mb-6">
            Join Our Exclusive Network
          </h2>
          <p className="dior-body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Elevate your salon to new heights. Partner with HAIB and join an elite network 
            of premium beauty establishments serving discerning clients.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="luxury-card p-6 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="bg-black w-12 h-12 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="dior-heading-sm text-foreground mb-3">{benefit.title}</h3>
                <p className="dior-body-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Features List */}
          <div>
            <h3 className="dior-heading-md text-foreground mb-8">What's Included</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="dior-body text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-black text-white rounded-lg">
              <h4 className="dior-heading-sm text-white mb-4">Ready to Get Started?</h4>
              <p className="dior-body-sm text-white/80 mb-6">
                Join over 500+ premium salons already thriving on our platform.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4" />
                <span>Trusted by industry leaders</span>
              </div>
            </div>
          </div>

          {/* Partnership Form */}
          <Card className="luxury-card">
            <CardContent className="p-8">
              {!isFormOpen ? (
                <div className="text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="dior-heading-md text-foreground mb-4">
                    Request Partnership
                  </h3>
                  <p className="dior-body text-muted-foreground mb-8">
                    Take the first step towards joining our exclusive network of premium beauty establishments.
                  </p>
                  <Button 
                    variant="luxury" 
                    size="lg"
                    onClick={() => setIsFormOpen(true)}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Start Application <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="dior-heading-md text-foreground mb-2">Partnership Application</h3>
                    <p className="dior-body-sm text-muted-foreground">
                      Tell us about your salon and we'll get back to you soon.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salonName">Salon Name</Label>
                      <Input
                        id="salonName"
                        value={formData.salonName}
                        onChange={(e) => handleInputChange('salonName', e.target.value)}
                        placeholder="Your salon name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@yoursalon.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Salon Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Beauty St, City, State 12345"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Tell us about your salon</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Describe your salon, services, and why you'd like to partner with HAIB..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="luxury"
                      disabled={isSubmitting}
                      className="flex-1 bg-black text-white hover:bg-black/90"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSalonPartnership;