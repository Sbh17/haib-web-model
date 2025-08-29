import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Shield, 
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Quote,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VIPPartnershipLanding: React.FC = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const exclusiveBenefits = [
    {
      icon: Crown,
      title: "VIP Status",
      description: "Premium placement in search results and featured salon spotlight",
      highlight: "Up to 300% more visibility"
    },
    {
      icon: TrendingUp,
      title: "Revenue Boost",
      description: "Average partners see 40% increase in bookings within first 3 months",
      highlight: "Guaranteed ROI"
    },
    {
      icon: Users,
      title: "Elite Clientele",
      description: "Access to our premium customer base seeking luxury experiences",
      highlight: "Higher spending customers"
    },
    {
      icon: Shield,
      title: "White-Glove Support",
      description: "Dedicated success manager and priority technical support",
      highlight: "24/7 premium support"
    }
  ];

  const testimonials = [
    {
      name: "Isabella Martinez",
      salon: "Luxe Beauty Lounge",
      image: "/lovable-uploads/60d9893d-80ac-4542-a763-2085e426d7a5.png",
      quote: "Joining HAIB transformed my business. We went from struggling to find clients to having a 3-week waiting list. The quality of customers is exceptional.",
      metrics: "+250% bookings in 6 months",
      rating: 5
    },
    {
      name: "Marcus Thompson",
      salon: "Elite Hair Studio",
      image: "/lovable-uploads/739bb5af-9ea5-4ded-95b2-f6d17624d5fd.png",
      quote: "The partnership with HAIB isn't just about bookings - it's about joining a network of excellence. My salon's reputation has elevated tremendously.",
      metrics: "€15K+ monthly revenue increase",
      rating: 5
    },
    {
      name: "Sophia Chen",
      salon: "Radiant Beauty Spa",
      image: "/lovable-uploads/0d3558d9-bc4c-4700-92c4-a2959fffbaad.png",
      quote: "HAIB doesn't just want our salon - they genuinely want us to succeed. The support and tools they provide are unmatched in the industry.",
      metrics: "98% client retention rate",
      rating: 5
    }
  ];

  const exclusivePerks = [
    "Priority listing in premium searches",
    "Complimentary professional photography session",
    "Featured placement in marketing campaigns",
    "Access to exclusive industry events and networking",
    "Revenue optimization consultations",
    "Advanced analytics and business insights"
  ];

  const stats = [
    { number: "500+", label: "Partner Salons" },
    { number: "50K+", label: "Monthly Bookings" },
    { number: "4.9★", label: "Average Rating" },
    { number: "€2M+", label: "Revenue Generated" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beauty-cream via-background to-beauty-rose">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beauty-dark/5 via-transparent to-beauty-primary/10" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-8 px-6 py-3 text-lg font-medium border-beauty-primary/20 bg-beauty-light/80 backdrop-blur-sm">
              <Crown className="w-5 h-5 mr-2" />
              Exclusive Partnership Invitation
            </Badge>
            
            <h1 className="dior-heading-xl text-beauty-primary mb-8 max-w-4xl mx-auto">
              Join the Elite Network of 
              <span className="block bg-gradient-to-r from-beauty-primary to-beauty-secondary bg-clip-text text-transparent">
                Premium Beauty Establishments
              </span>
            </h1>
            
            <p className="dior-body-lg text-beauty-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
              We don't just list salons – we create partnerships with exceptional beauty establishments 
              that share our commitment to excellence. Join a carefully curated network where your 
              salon deserves to be.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={() => navigate('/partnership-application')}
                className="bg-gradient-dior text-beauty-light hover:shadow-luxury px-12 py-6 text-lg font-medium tracking-wide"
              >
                Apply for Partnership <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-4 text-beauty-secondary">
                <Phone className="w-5 h-5" />
                <span className="dior-body">Priority Line: +1 (555) VIP-SALON</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="dior-heading-md text-beauty-primary mb-2">{stat.number}</div>
                  <div className="dior-body-sm text-beauty-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Benefits */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="dior-heading-lg text-beauty-primary mb-6">
              Exclusive Partnership Benefits
            </h2>
            <p className="dior-body-lg text-beauty-secondary max-w-3xl mx-auto">
              We invest in our partners' success with premium benefits designed to elevate your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {exclusiveBenefits.map((benefit, index) => (
              <Card key={index} className="luxury-card group hover:scale-105 transition-all duration-500 p-8">
                <CardContent className="p-0 text-center">
                  <div className="bg-gradient-dior w-16 h-16 flex items-center justify-center mb-6 mx-auto rounded-lg">
                    <benefit.icon className="w-8 h-8 text-beauty-light" />
                  </div>
                  
                  <Badge variant="secondary" className="mb-4 bg-beauty-success/10 text-beauty-success border-beauty-success/20">
                    {benefit.highlight}
                  </Badge>
                  
                  <h3 className="dior-heading-sm text-beauty-primary mb-4">{benefit.title}</h3>
                  <p className="dior-body-sm text-beauty-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="px-6 py-24 bg-gradient-to-r from-beauty-cream to-beauty-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="dior-heading-lg text-beauty-primary mb-6">
              Success Stories from Our Partners
            </h2>
            <p className="dior-body-lg text-beauty-secondary">
              Real results from salon owners who chose to partner with HAIB
            </p>
          </div>

          <div className="relative">
            <Card className="luxury-card p-12 text-center max-w-4xl mx-auto">
              <CardContent className="p-0">
                <Quote className="w-12 h-12 text-beauty-primary/20 mx-auto mb-6" />
                
                <blockquote className="dior-body-lg text-beauty-primary mb-8 italic leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-6 mb-6">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-beauty-primary/10"
                  />
                  <div className="text-left">
                    <div className="dior-heading-sm text-beauty-primary">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="dior-body-sm text-beauty-secondary">
                      {testimonials[activeTestimonial].salon}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-beauty-warning text-beauty-warning" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Badge variant="outline" className="bg-beauty-success/10 text-beauty-success border-beauty-success/20 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {testimonials[activeTestimonial].metrics}
                </Badge>
              </CardContent>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`w-3 h-3 rounded-full p-0 ${
                    index === activeTestimonial 
                      ? 'bg-beauty-primary' 
                      : 'bg-beauty-primary/20 hover:bg-beauty-primary/40'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Perks */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6 px-4 py-2 border-beauty-primary/20 bg-beauty-light/50">
                <Award className="w-4 h-4 mr-2" />
                VIP Partnership Perks
              </Badge>
              
              <h2 className="dior-heading-lg text-beauty-primary mb-8">
                We Don't Just Want Your Salon – 
                <span className="block text-beauty-secondary">We Want You to Thrive</span>
              </h2>
              
              <div className="space-y-6">
                {exclusivePerks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <CheckCircle2 className="w-6 h-6 text-beauty-success flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <span className="dior-body text-beauty-secondary group-hover:text-beauty-primary transition-colors">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-8 bg-gradient-dior text-beauty-light rounded-xl">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="dior-heading-sm text-beauty-light mb-3">
                      Limited Partnership Spots Available
                    </h4>
                    <p className="dior-body-sm text-beauty-light/80 mb-4">
                      We maintain exclusivity by limiting partnerships in each area. 
                      Apply now to secure your spot in our elite network.
                    </p>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">Only 3 spots remaining in your area</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="luxury-card p-8">
              <CardContent className="p-0 text-center">
                <Crown className="w-20 h-20 mx-auto mb-6 text-beauty-primary" />
                
                <h3 className="dior-heading-md text-beauty-primary mb-6">
                  Ready to Become a VIP Partner?
                </h3>
                
                <p className="dior-body text-beauty-secondary mb-8">
                  Join an exclusive network where your salon's excellence is recognized, 
                  celebrated, and rewarded. Start your VIP partnership journey today.
                </p>
                
                <Button 
                  size="lg"
                  onClick={() => navigate('/partnership-application')}
                  className="bg-gradient-dior text-beauty-light hover:shadow-luxury w-full mb-6 py-6 text-lg"
                >
                  Begin VIP Application <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-beauty-secondary text-sm">
                  <Mail className="w-4 h-4" />
                  <span>partnerships@haib.beauty</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VIPPartnershipLanding;