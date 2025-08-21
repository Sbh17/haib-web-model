
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight as ArrowRightIcon, 
  Star as StarIcon, 
  Calendar as CalendarIcon, 
  Search as SearchIcon, 
  MapPin as MapPinIcon,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import WelcomeSalonPartnership from '@/components/WelcomeSalonPartnership';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const Welcome: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={cn("min-h-screen flex flex-col bg-background theme-transition", isRTL && "rtl")}>
      {/* Hero Section - HAIB Luxury */}
      <section className="luxury-hero pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-noir opacity-90"></div>
        <div className={cn("relative z-10 max-w-6xl mx-auto text-center", isRTL && "rtl")}>
          <h1 className="dior-heading-xl text-beauty-light mb-8 animate-fade-in tracking-luxury">
            {t.welcomeTitle}
          </h1>
          <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
          <p className={cn("dior-body-lg text-beauty-light/90 mb-12 max-w-3xl mx-auto leading-relaxed", isRTL && "text-right")}>
            {t.welcomeDescription}
          </p>
          
          <div className={cn("flex flex-col sm:flex-row gap-6 justify-center mt-16", isRTL && "sm:flex-row-reverse")}>
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
      </section>
      
      {/* Features Section - Luxury Process */}
      <section className="py-32 px-6 bg-gradient-to-b from-beauty-light to-beauty-cream/50">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-24", isRTL && "rtl")}>
            <h2 className="dior-heading-lg text-beauty-dark mb-6 tracking-luxury">{t.howItWorks}</h2>
            <div className="h-1 w-24 mx-auto mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className={cn("dior-body text-beauty-dark/70 max-w-2xl mx-auto leading-relaxed", isRTL && "text-right")}>
              {t.howItWorksDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className={cn("flex flex-col items-center text-center group animate-fade-in", isRTL && "items-end text-right")}>
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <SearchIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">{t.discover}</h3>
              <p className={cn("dior-body text-beauty-dark/70 leading-relaxed", isRTL && "text-right")}>
                {t.discoverDescription}
              </p>
            </div>
            
            <div className={cn("flex flex-col items-center text-center group animate-fade-in", isRTL && "items-end text-right")}>
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <CalendarIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">{t.book}</h3>
              <p className={cn("dior-body text-beauty-dark/70 leading-relaxed", isRTL && "text-right")}>
                {t.bookDescription}
              </p>
            </div>
            
            <div className={cn("flex flex-col items-center text-center group animate-fade-in", isRTL && "items-end text-right")}>
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <StarIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">{t.experience}</h3>
              <p className={cn("dior-body text-beauty-dark/70 leading-relaxed", isRTL && "text-right")}>
                {t.experienceDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Section - Luxury Services */}
      <section className="py-32 px-6 bg-gradient-to-b from-beauty-cream/30 to-beauty-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-pearl opacity-50"></div>
        <div className={cn("relative z-10 max-w-6xl mx-auto", isRTL && "rtl")}>
          <div className={cn("mb-20", isRTL && "text-right")}>
            <h2 className="dior-heading-lg text-beauty-dark mb-6 tracking-luxury">{t.exploreHaib}</h2>
            <div className="h-1 w-24 mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className={cn("dior-body text-beauty-dark/70 max-w-2xl leading-relaxed", isRTL && "text-right")}>
              {t.exploreDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="luxury-card p-12 group hover:shadow-luxury transition-all duration-500 border border-beauty-accent/20 backdrop-blur-sm">
              <h3 className={cn("dior-heading-sm text-beauty-dark mb-8 flex items-center tracking-luxury", isRTL && "flex-row-reverse")}>
                <MapPinIcon className={cn("w-8 h-8 text-beauty-accent", isRTL ? "ml-4" : "mr-4")} />
                {t.premiumSalons}
              </h3>
              <p className={cn("dior-body text-beauty-dark/70 mb-10 leading-relaxed", isRTL && "text-right")}>
                {t.premiumSalonsDescription}
              </p>
              <Link to="/search">
                <Button 
                  variant="outline" 
                  className="border-beauty-accent text-beauty-dark hover:bg-beauty-accent hover:text-beauty-light transition-all duration-300 font-playfair tracking-luxury"
                >
                  {t.exploreSalons} <ArrowRightIcon className={cn("w-4 h-4", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                </Button>
              </Link>
            </div>
            
            <div className="luxury-card p-12 group hover:shadow-luxury transition-all duration-500 border border-beauty-accent/20 backdrop-blur-sm">
              <h3 className={cn("dior-heading-sm text-beauty-dark mb-8 flex items-center tracking-luxury", isRTL && "flex-row-reverse")}>
                <StarIcon className={cn("w-8 h-8 text-beauty-accent", isRTL ? "ml-4" : "mr-4")} />
                {t.exclusiveOffers}
              </h3>
              <p className={cn("dior-body text-beauty-dark/70 mb-10 leading-relaxed", isRTL && "text-right")}>
                {t.exclusiveOffersDescription}
              </p>
              <Link to="/promotions">
                <Button 
                  variant="outline" 
                  className="border-beauty-accent text-beauty-dark hover:bg-beauty-accent hover:text-beauty-light transition-all duration-300 font-playfair tracking-luxury"
                >
                  {t.viewOffers} <ArrowRightIcon className={cn("w-4 h-4", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                </Button>
              </Link>
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
