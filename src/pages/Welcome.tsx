
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight as ArrowRightIcon, 
  Brain as BrainIcon, 
  Bot as BotIcon,
  Sparkles as SparklesIcon,
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
        <div className={cn("relative z-10 max-w-4xl mx-auto text-center", isRTL && "rtl")}>
          <div className="mb-12 animate-fade-in">
            <HAIBLogo size="xl" className="mb-8" />
          </div>
          
          <h1 className={cn("dior-heading-xl text-beauty-light mb-8 tracking-luxury leading-tight", isRTL && "text-right")}>
            AI-Powered Beauty
          </h1>
          
          <p className={cn("text-2xl text-beauty-light/90 mb-16 font-light tracking-wide", isRTL && "text-right")}>
            Seamless. Luxurious. Intelligent.
          </p>
          
          <div className={cn("flex flex-col sm:flex-row gap-6 justify-center", isRTL && "sm:flex-row-reverse")}>
            <Link to="/register" className="animate-fade-in">
              <Button size="xl" className="beauty-button shadow-champagne">
                {t.startJourney}
                <ArrowRightIcon className={cn("w-5 h-5 ml-3", isRTL && "mr-3 ml-0 rotate-180")} />
              </Button>
            </Link>
            <Link to="/auth" className="animate-fade-in">
              <Button 
                variant="outline" 
                size="xl" 
                className="border-beauty-accent text-beauty-light hover:bg-beauty-accent hover:text-beauty-dark bg-transparent backdrop-blur-sm transition-all duration-500 font-playfair tracking-luxury"
              >
                {t.signIn}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* AI Features - Minimalist */}
      <section className="py-20 px-6 bg-gradient-to-b from-beauty-light to-beauty-cream/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={cn("group animate-fade-in", isRTL && "text-right")}>
              <div className="mb-6">
                <BrainIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">AI Discovery</h3>
              <p className="text-beauty-dark/70">Smart recommendations</p>
            </div>
            
            <div className={cn("group animate-fade-in", isRTL && "text-right")}>
              <div className="mb-6">
                <BotIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">Seamless Booking</h3>
              <p className="text-beauty-dark/70">Effortless experience</p>
            </div>
            
            <div className={cn("group animate-fade-in", isRTL && "text-right")}>
              <div className="mb-6">
                <SparklesIcon className="w-16 h-16 text-beauty-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">Luxury Service</h3>
              <p className="text-beauty-dark/70">Premium quality</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Luxury Elegance */}
      <footer className="bg-gradient-to-b from-beauty-cream/30 to-beauty-light py-16 px-6 mt-auto border-t border-beauty-accent/20">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-12", isRTL && "rtl")}>
            <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">{t.welcomeTitle}</h3>
            <div className="h-1 w-16 mx-auto mb-4 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className="dior-body-sm text-beauty-dark/70 tracking-wider">{t.beautyExcellence}</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mb-12">
            <a 
              href="https://instagram.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label={`${t.followUs} Instagram`}
            >
              <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://facebook.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label={`${t.followUs} Facebook`}
            >
              <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://twitter.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label={`${t.followUs} Twitter`}
            >
              <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://linkedin.com/company/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label={`${t.followUs} LinkedIn`}
            >
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://youtube.com/@haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label={`${t.followUs} YouTube`}
            >
              <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
          
          <div className={cn("flex flex-wrap justify-center gap-10 mb-12", isRTL && "rtl")}>
            <Link to="/" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              {t.home}
            </Link>
            <Link to="/search" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              {t.search}
            </Link>
            <Link to="/promotions" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              {t.promotions}
            </Link>
            <Link to="/auth" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              {t.signIn}
            </Link>
          </div>
          
          <div className={cn("text-center pt-8 border-t border-beauty-accent/20", isRTL && "rtl")}>
            <p className="dior-body-sm text-beauty-dark/60 tracking-wide">
              © 2024 {t.welcomeTitle}. {t.allRightsReserved}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
