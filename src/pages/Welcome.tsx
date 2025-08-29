
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight as ArrowRightIcon, 
  Star as StarIcon, 
  Calendar as CalendarIcon, 
  Brain as BrainIcon, 
  MapPin as MapPinIcon,
  Bot as BotIcon,
  Sparkles as SparklesIcon,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import WelcomeSalonPartnership from '@/components/WelcomeSalonPartnership';
import HAIBLogo from '@/components/HAIBLogo';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const Welcome: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={cn("min-h-screen bg-background theme-transition", isRTL && "rtl")}>
      {/* Split-Screen Hero Section */}
      <section className="luxury-hero pt-24 pb-32 px-6 relative overflow-hidden min-h-screen flex">
        <div className="absolute inset-0 bg-gradient-noir opacity-90"></div>
        
        {/* Left Side - Content */}
        <div className={cn("w-full lg:w-1/2 flex flex-col justify-center relative z-10", isRTL && "lg:order-2")}>
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="animate-fade-in mb-12">
              <HAIBLogo size="xl" className="mb-8" />
              <p className={cn("dior-body-lg text-beauty-light/90 mb-12 leading-relaxed", isRTL && "text-right")}>
                {t.welcomeDescription}
              </p>
            </div>
            
            <div className={cn("flex flex-col sm:flex-row gap-6 justify-center", isRTL && "sm:flex-row-reverse")}>
              <Link to="/register" className="animate-slide-up">
                <Button className="beauty-button shadow-champagne">
                  {t.startJourney}
                  <ArrowRightIcon className={cn("w-5 h-5 ml-3", isRTL && "mr-3 ml-0 rotate-180")} />
                </Button>
              </Link>
              <Link to="/auth" className="animate-slide-up">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-beauty-accent text-beauty-light hover:bg-beauty-accent hover:text-beauty-dark bg-transparent backdrop-blur-sm transition-all duration-500 py-4 px-10 font-playfair tracking-luxury"
                >
                  {t.signIn}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Cards Preview */}
        <div className={cn("hidden lg:flex w-1/2 items-center justify-center p-16 bg-gradient-to-br from-beauty-light/20 to-beauty-cream/30", isRTL && "order-1")}>
          <div className="relative w-full max-w-md">
            {/* Floating Cards */}
            <div className="absolute inset-0 animate-pulse">
              <div className="bg-card border border-beauty-accent/20 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-beauty-accent rounded-full flex items-center justify-center">
                    <BrainIcon className="w-6 h-6 text-beauty-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">AI Discovery</div>
                    <div className="text-sm text-muted-foreground">Smart recommendations</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-16 left-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-card border border-beauty-accent/20 rounded-2xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-beauty-secondary rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-beauty-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Quick Booking</div>
                    <div className="text-sm text-muted-foreground">Seamless experience</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-32 right-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="bg-card border border-beauty-accent/20 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-beauty-primary rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-beauty-light" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Luxury Service</div>
                    <div className="text-sm text-muted-foreground">Premium quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card-Based Features Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair text-foreground mb-4">{t.howItWorks}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.howItWorksDescription}</p>
          </div>
          
          {/* Masonry-style Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {/* Discover Card */}
            <div className="group">
              <div className="bg-card border border-border hover:border-beauty-accent/50 rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-beauty-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BrainIcon className="w-8 h-8 text-beauty-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{t.discover}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.discoverDescription}</p>
              </div>
            </div>
            
            {/* Book Card */}
            <div className="group lg:row-span-1">
              <div className="bg-gradient-to-br from-beauty-accent/5 to-beauty-secondary/5 border border-border hover:border-beauty-accent/50 rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-beauty-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CalendarIcon className="w-8 h-8 text-beauty-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{t.book}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.bookDescription}</p>
              </div>
            </div>
            
            {/* Experience Card */}
            <div className="group">
              <div className="bg-card border border-border hover:border-beauty-accent/50 rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-beauty-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="w-8 h-8 text-beauty-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{t.experience}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.experienceDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-24 px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair text-foreground mb-4">{t.exploreHaib}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.exploreDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Premium Salons Card */}
            <div className="group">
              <div className="bg-card border border-border hover:border-beauty-accent/50 rounded-2xl p-10 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-beauty-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BotIcon className="w-8 h-8 text-beauty-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">{t.premiumSalons}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">{t.premiumSalonsDescription}</p>
                  </div>
                </div>
                <Link to="/search">
                  <Button variant="outline" className="w-full group-hover:bg-beauty-accent group-hover:text-beauty-light group-hover:border-beauty-accent transition-all duration-300">
                    {t.exploreSalons} <ArrowRightIcon className={cn("w-4 h-4", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Exclusive Offers Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-beauty-primary/5 to-beauty-accent/5 border border-border hover:border-beauty-primary/50 rounded-2xl p-10 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-beauty-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <SparklesIcon className="w-8 h-8 text-beauty-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">{t.exclusiveOffers}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">{t.exclusiveOffersDescription}</p>
                  </div>
                </div>
                <Link to="/promotions">
                  <Button variant="outline" className="w-full group-hover:bg-beauty-primary group-hover:text-beauty-light group-hover:border-beauty-primary transition-all duration-300">
                    {t.viewOffers} <ArrowRightIcon className={cn("w-4 h-4", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Salon Partnership Section */}
      <WelcomeSalonPartnership />
      
      {/* CTA Section - Final Luxury Touch */}
      <section className="luxury-hero py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-noir opacity-95"></div>
        <div className={cn("relative z-10 max-w-6xl mx-auto text-center", isRTL && "rtl")}>
          <h2 className="dior-heading-lg text-beauty-light mb-8 tracking-luxury">{t.startBeautyJourney}</h2>
          <div className="h-1 w-32 mx-auto mb-12 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
          <p className={cn("dior-body-lg text-beauty-light/90 mb-16 max-w-3xl mx-auto leading-relaxed", isRTL && "text-right")}>
            {t.startBeautyDescription}
          </p>
          
          <Link to="/register">
            <Button className="beauty-button shadow-champagne animate-pulse hover:animate-none">
              {t.startNow} <ArrowRightIcon className={cn("w-5 h-5", isRTL ? "mr-3 rotate-180" : "ml-3")} />
            </Button>
          </Link>
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
