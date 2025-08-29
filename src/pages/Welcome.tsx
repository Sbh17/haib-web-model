
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
    <div className={cn("min-h-screen bg-background", isRTL && "rtl")}>
      {/* Luxury Header Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="mb-12">
              <div className="mb-8">
                <HAIBLogo size="xl" className="mx-auto" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t.welcomeTitle}
              </h1>
              
              <p className={cn("text-lg text-white/80 max-w-2xl mx-auto leading-relaxed", isRTL && "text-right")}>
                {t.welcomeDescription}
              </p>
            </div>
            
            <div className={cn("flex flex-col sm:flex-row gap-4 justify-center", isRTL && "sm:flex-row-reverse")}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  {t.startJourney}
                  <ArrowRightIcon className={cn("w-4 h-4 ml-2", isRTL && "mr-2 ml-0 rotate-180")} />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                  {t.signIn}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Discovery</h3>
              <p className="text-muted-foreground">Intelligent matching for perfect salon recommendations</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">Seamless appointment scheduling at your fingertips</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
              <p className="text-muted-foreground">Experience luxury beauty services like never before</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.howItWorks}</h2>
            <p className="text-muted-foreground">{t.howItWorksDescription}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.discover}</h3>
              <p className="text-sm text-muted-foreground">{t.discoverDescription}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.book}</h3>
              <p className="text-sm text-muted-foreground">{t.bookDescription}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.experience}</h3>
              <p className="text-sm text-muted-foreground">{t.experienceDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Services Section */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beauty-dark/5 via-beauty-cream/20 to-beauty-light/10"></div>
        <div className="absolute inset-0 bg-gradient-pearl opacity-30"></div>
        
        {/* Floating Luxury Particles */}
        <div className="absolute top-16 left-1/4 w-2 h-2 bg-beauty-accent rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-beauty-primary rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-beauty-secondary rounded-full animate-ping opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <div className="absolute -inset-3 bg-gradient-luxury opacity-20 blur-2xl rounded-lg animate-pulse"></div>
              <h2 className="relative dior-heading-lg text-beauty-dark mb-6 tracking-luxury drop-shadow-lg">{t.exploreHaib}</h2>
            </div>
            <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-beauty-accent via-beauty-primary to-beauty-secondary shadow-luxury"></div>
            <p className="dior-body-lg text-beauty-dark/80 max-w-3xl mx-auto leading-relaxed font-light">{t.exploreDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Premium Salons - Ultra Luxury Card */}
            <div className="group">
              <div className="luxury-card-elite hover:shadow-champagne-glow transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-beauty-accent/10 via-beauty-primary/5 to-transparent opacity-80"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-beauty-accent/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="relative p-12">
                  <div className="flex items-start gap-8 mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-beauty-accent to-beauty-primary rounded-3xl flex items-center justify-center shadow-luxury group-hover:shadow-champagne-glow group-hover:scale-110 transition-all duration-500 border-2 border-beauty-accent/20 flex-shrink-0">
                      <BotIcon className="w-10 h-10 text-beauty-light drop-shadow-xl" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">{t.premiumSalons}</h3>
                      <div className="h-px bg-gradient-to-r from-beauty-accent/50 to-transparent mb-6"></div>
                      <p className="dior-body text-beauty-dark/70 leading-relaxed font-light">{t.premiumSalonsDescription}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-playfair text-beauty-accent/80 tracking-widest">AI-POWERED</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-beauty-accent rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-beauty-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-1 h-1 bg-beauty-secondary rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/search">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-beauty-accent/30 text-beauty-dark hover:bg-beauty-accent hover:text-beauty-light hover:border-beauty-accent transition-all duration-500 font-playfair tracking-luxury py-6 text-lg shadow-luxury hover:shadow-champagne-glow backdrop-blur-sm group-hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {t.exploreSalons} 
                        <ArrowRightIcon className={cn("w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300", isRTL && "mr-3 ml-0 rotate-180 group-hover:-translate-x-1")} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-luxury opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Exclusive Offers - Elite Luxury Card */}
            <div className="group">
              <div className="luxury-card-elite hover:shadow-champagne-glow transition-all duration-700 transform hover:-translate-y-3 hover:-rotate-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tl from-beauty-primary/10 via-beauty-secondary/5 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-beauty-primary/5 rounded-full translate-y-14 -translate-x-14 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="relative p-12">
                  <div className="flex items-start gap-8 mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-beauty-primary to-beauty-secondary rounded-3xl flex items-center justify-center shadow-luxury group-hover:shadow-champagne-glow group-hover:scale-110 transition-all duration-500 border-2 border-beauty-primary/20 flex-shrink-0">
                      <SparklesIcon className="w-10 h-10 text-beauty-light drop-shadow-xl" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">{t.exclusiveOffers}</h3>
                      <div className="h-px bg-gradient-to-r from-beauty-primary/50 to-transparent mb-6"></div>
                      <p className="dior-body text-beauty-dark/70 leading-relaxed font-light">{t.exclusiveOffersDescription}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-playfair text-beauty-primary/80 tracking-widest">MEMBERS ONLY</span>
                      <div className="w-8 h-8 border-2 border-beauty-primary/30 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-4 h-4 text-beauty-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/promotions">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-beauty-primary/30 text-beauty-dark hover:bg-beauty-primary hover:text-beauty-light hover:border-beauty-primary transition-all duration-500 font-playfair tracking-luxury py-6 text-lg shadow-luxury hover:shadow-champagne-glow backdrop-blur-sm group-hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {t.viewOffers} 
                        <ArrowRightIcon className={cn("w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300", isRTL && "mr-3 ml-0 rotate-180 group-hover:-translate-x-1")} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-beauty-primary/10 to-beauty-secondary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Salon Partnership Section */}
      <WelcomeSalonPartnership />
      
      {/* Elite CTA Section - Ultra Luxury */}
      <section className="luxury-hero py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-noir opacity-98"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-beauty-accent/5 via-transparent to-beauty-primary/5 animate-pulse"></div>
        
        {/* Luxury Floating Elements */}
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-beauty-accent rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-beauty-secondary rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-beauty-primary rounded-full animate-ping opacity-35"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-beauty-accent rounded-full animate-pulse opacity-50"></div>
        
        <div className={cn("relative z-10 max-w-6xl mx-auto text-center", isRTL && "rtl")}>
          <div className="relative mb-12">
            <div className="absolute -inset-4 bg-gradient-luxury opacity-40 blur-3xl rounded-lg animate-pulse"></div>
            <h2 className="relative dior-display text-beauty-light mb-8 tracking-luxury drop-shadow-2xl leading-tight">
              {t.startBeautyJourney}
            </h2>
          </div>
          
          <div className="h-2 w-40 mx-auto mb-16 bg-gradient-to-r from-beauty-accent via-beauty-primary to-beauty-secondary shadow-champagne-glow rounded-full"></div>
          
          <div className="relative backdrop-blur-md bg-beauty-light/5 border-2 border-beauty-accent/30 rounded-3xl p-12 mb-20 shadow-luxury max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-luxury opacity-10 rounded-3xl"></div>
            <p className={cn("relative dior-body-xl text-beauty-light/95 leading-relaxed font-light tracking-wide", isRTL && "text-right")}>
              {t.startBeautyDescription}
            </p>
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-1 h-1 bg-beauty-accent rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-beauty-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-beauty-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-luxury opacity-30 blur-2xl rounded-full animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
            <Link to="/register">
              <Button className="relative beauty-button-premium shadow-champagne-xl group-hover:shadow-champagne-glow transform group-hover:scale-110 transition-all duration-700 text-xl py-8 px-16">
                <span className="relative z-10 flex items-center font-playfair tracking-luxury">
                  {t.startNow} 
                  <ArrowRightIcon className={cn("w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform duration-500", isRTL && "mr-4 ml-0 rotate-180 group-hover:-translate-x-2")} />
                </span>
                <div className="absolute inset-0 bg-gradient-luxury opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
              </Button>
            </Link>
          </div>
          
          {/* Luxury Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mt-16 opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-beauty-accent rounded-full animate-pulse"></div>
              <span className="text-beauty-light/70 text-sm font-light tracking-wide">AI-POWERED</span>
            </div>
            <div className="w-px h-6 bg-beauty-light/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-beauty-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-beauty-light/70 text-sm font-light tracking-wide">LUXURY</span>
            </div>
            <div className="w-px h-6 bg-beauty-light/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-beauty-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="text-beauty-light/70 text-sm font-light tracking-wide">EXCLUSIVE</span>
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
