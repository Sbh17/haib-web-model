
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight as ArrowRightIcon, 
  Brain as BrainIcon, 
  Bot as BotIcon,
  Sparkles as SparklesIcon,
  Users,
  Clock,
  Star,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import HAIBLogo from '@/components/HAIBLogo';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const Welcome: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={cn("min-h-screen flex flex-col bg-background theme-transition", isRTL && "rtl")}>
      {/* Hero Section - AI-Powered Luxury */}
      <section className="luxury-hero min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-noir opacity-95"></div>
        
        {/* Floating stats */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-beauty-light">10K+</div>
            <div className="text-sm text-beauty-light/80">Happy Clients</div>
          </div>
        </div>
        
        <div className="absolute top-32 right-16 animate-float delay-1000">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-beauty-light">98%</div>
            <div className="text-sm text-beauty-light/80">AI Accuracy</div>
          </div>
        </div>
        
        <div className="absolute bottom-32 left-20 animate-float delay-2000">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-beauty-light">24/7</div>
            <div className="text-sm text-beauty-light/80">AI Assistant</div>
          </div>
        </div>

        <div className={cn("relative z-10 max-w-4xl mx-auto text-center", isRTL && "rtl")}>
          <div className="mb-12 animate-fade-in">
            <HAIBLogo size="xl" className="mb-8" />
          </div>
          
          <h1 className={cn("dior-heading-xl text-beauty-light mb-8 tracking-luxury leading-tight", isRTL && "text-right")}>
            AI-Powered Beauty
          </h1>
          
          <p className={cn("text-2xl text-beauty-light/90 mb-8 font-light tracking-wide", isRTL && "text-right")}>
            Seamless. Luxurious. Intelligent.
          </p>
          
          <p className={cn("text-lg text-beauty-light/70 mb-16 max-w-2xl mx-auto", isRTL && "text-right")}>
            Experience beauty booking reimagined with AI that understands your preferences, connects you with premium salons, and delivers flawless experiences every time.
          </p>
          
          <div className={cn("flex flex-col sm:flex-row gap-6 justify-center", isRTL && "sm:flex-row-reverse")}>
            <Link to="/register" className="animate-fade-in">
              <Button size="xl" className="beauty-button shadow-champagne">
                Start Your Journey
                <ArrowRightIcon className={cn("w-5 h-5 ml-3", isRTL && "mr-3 ml-0 rotate-180")} />
              </Button>
            </Link>
            <Link to="/auth" className="animate-fade-in">
              <Button 
                variant="outline" 
                size="xl" 
                className="border-beauty-accent text-beauty-light hover:bg-beauty-accent hover:text-beauty-dark bg-transparent backdrop-blur-sm transition-all duration-500 font-playfair tracking-luxury"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Seamless Experience Stats */}
      <section className="py-20 px-6 bg-gradient-to-b from-beauty-light via-beauty-cream/50 to-beauty-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-beauty-primary/5 via-transparent to-beauty-accent/5"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={cn("text-center mb-16", isRTL && "rtl")}>
            <h2 className="dior-heading-lg text-beauty-dark mb-6 tracking-luxury">The Power of Seamless AI</h2>
            <div className="h-1 w-20 mx-auto mb-6 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className={cn("text-center group", isRTL && "text-right")}>
              <div className="mb-4">
                <Users className="w-12 h-12 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-beauty-dark mb-2">15,000+</div>
              <p className="text-beauty-dark/70 font-light">Active Users</p>
            </div>
            
            <div className={cn("text-center group", isRTL && "text-right")}>
              <div className="mb-4">
                <Clock className="w-12 h-12 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-beauty-dark mb-2">2 min</div>
              <p className="text-beauty-dark/70 font-light">Average Booking</p>
            </div>
            
            <div className={cn("text-center group", isRTL && "text-right")}>
              <div className="mb-4">
                <Star className="w-12 h-12 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-beauty-dark mb-2">4.9/5</div>
              <p className="text-beauty-dark/70 font-light">User Rating</p>
            </div>
            
            <div className={cn("text-center group", isRTL && "text-right")}>
              <div className="mb-4">
                <SparklesIcon className="w-12 h-12 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-beauty-dark mb-2">500+</div>
              <p className="text-beauty-dark/70 font-light">Luxury Salons</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={cn("text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:shadow-champagne transition-all duration-500 group", isRTL && "text-right")}>
              <div className="mb-6">
                <BrainIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">AI Beauty Advisor</h3>
              <p className="text-beauty-dark/70 leading-relaxed">Personalized recommendations based on your skin type, preferences, and beauty goals using advanced AI algorithms.</p>
            </div>
            
            <div className={cn("text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:shadow-champagne transition-all duration-500 group", isRTL && "text-right")}>
              <div className="mb-6">
                <BotIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">Instant Booking</h3>
              <p className="text-beauty-dark/70 leading-relaxed">Book appointments in seconds with our intelligent system that matches you with the perfect salon and timing.</p>
            </div>
            
            <div className={cn("text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:shadow-champagne transition-all duration-500 group", isRTL && "text-right")}>
              <div className="mb-6">
                <SparklesIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">Premium Experience</h3>
              <p className="text-beauty-dark/70 leading-relaxed">Access exclusive luxury salons and premium treatments with our curated network of elite beauty professionals.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Luxury Elegance */}
      <footer className="bg-gradient-to-b from-beauty-light to-beauty-cream/50 py-16 px-6 border-t border-beauty-accent/20">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-12", isRTL && "rtl")}>
            <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">HAIB Beauty AI</h3>
            <div className="h-1 w-16 mx-auto mb-4 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className="dior-body-sm text-beauty-dark/70 tracking-wider">Where AI meets luxury beauty</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mb-12">
            <a 
              href="https://instagram.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://facebook.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://twitter.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://linkedin.com/company/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://youtube.com/@haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Follow us on YouTube"
            >
              <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
          
          <div className={cn("flex flex-wrap justify-center gap-10 mb-12", isRTL && "rtl")}>
            <Link to="/" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Home
            </Link>
            <Link to="/search" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Search
            </Link>
            <Link to="/promotions" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Promotions
            </Link>
            <Link to="/auth" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Sign In
            </Link>
          </div>
          
          <div className={cn("text-center pt-8 border-t border-beauty-accent/20", isRTL && "rtl")}>
            <p className="dior-body-sm text-beauty-dark/60 tracking-wide">
              © 2024 HAIB Beauty AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
