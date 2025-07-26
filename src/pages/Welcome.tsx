
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

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section - DIOR Monochromatic Elegance */}
      <section className="bg-dior-black text-dior-white pt-20 pb-32 px-6 relative overflow-hidden">
        {/* Subtle gold accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dior-gold to-transparent opacity-30"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="dior-heading-xl mb-8 animate-fade-in">
            HAIB
          </h1>
          <div className="w-24 h-px bg-dior-gold mx-auto mb-8 opacity-60"></div>
          
          <p className="dior-body-lg max-w-3xl mx-auto leading-relaxed mb-12">
            Discover and book exceptional beauty services at the finest salons. 
            Experience luxury, sophistication, and unparalleled quality in every appointment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link to="/register">
              <Button className="bg-dior-white text-dior-black hover:bg-dior-pearl px-12 py-4 font-medium tracking-wider uppercase text-sm transition-all duration-300">
                Begin Your Journey
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="border-dior-white text-dior-white hover:bg-dior-white hover:text-dior-black px-12 py-4 font-medium tracking-wider uppercase text-sm transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Strategic gold accent */}
          <div className="mt-16 opacity-40">
            <div className="w-2 h-2 bg-dior-gold rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section - DIOR High Contrast */}
      <section className="py-24 px-6 bg-dior-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="dior-heading-lg mb-4">How It Works</h2>
            <div className="w-16 h-px bg-dior-gold mx-auto mb-6 opacity-60"></div>
            <p className="dior-body max-w-2xl mx-auto">
              Three simple steps to your perfect beauty experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Discover */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-dior-black w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                  <SearchIcon className="w-10 h-10 text-dior-white" />
                </div>
                {/* Gold accent dot */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-dior-gold rounded-full opacity-80"></div>
              </div>
              <h3 className="dior-heading-sm mb-4">Discover</h3>
              <p className="dior-body leading-relaxed">
                Find exceptional beauty salons in your area with detailed information, authentic reviews, and premium services.
              </p>
            </div>
            
            {/* Reserve */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-dior-black w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                  <CalendarIcon className="w-10 h-10 text-dior-white" />
                </div>
                {/* Gold accent line */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-px bg-dior-gold opacity-80"></div>
              </div>
              <h3 className="dior-heading-sm mb-4">Reserve</h3>
              <p className="dior-body leading-relaxed">
                Schedule your appointments effortlessly with our sophisticated booking system designed for your convenience.
              </p>
            </div>
            
            {/* Experience */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                <div className="bg-dior-black w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                  <StarIcon className="w-10 h-10 text-dior-white" />
                </div>
                {/* Gold accent triangle */}
                <div className="absolute -top-1 -left-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-dior-gold opacity-80"></div>
              </div>
              <h3 className="dior-heading-sm mb-4">Experience</h3>
              <p className="dior-body leading-relaxed">
                Indulge in premium beauty treatments and share your exceptional experience with our community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Section - DIOR Sophisticated Grays */}
      <section className="py-24 px-6 bg-dior-smoke">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="dior-heading-lg mb-4">Explore HAIB</h2>
            <div className="w-20 h-px bg-dior-gold mx-auto mb-6 opacity-60"></div>
            <p className="dior-body max-w-2xl mx-auto">
              Discover the sophisticated world of premium beauty services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Find Premium Salons Card */}
            <div className="group cursor-pointer">
              <div className="bg-dior-white border-l-4 border-l-dior-gold p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                {/* Subtle gold gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-dior-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-dior-black flex items-center justify-center mr-4">
                      <MapPinIcon className="w-6 h-6 text-dior-white" />
                    </div>
                    <h3 className="dior-heading-sm">Find Premium Salons</h3>
                  </div>
                  
                  <p className="dior-body mb-8 leading-relaxed">
                    Discover the finest beauty salons in your area, explore exclusive services, and read authentic reviews from our discerning community.
                  </p>
                  
                  <Link to="/search">
                    <Button variant="outline" className="border-dior-black text-dior-black hover:bg-dior-black hover:text-dior-white transition-all duration-300 px-8 py-3 font-medium tracking-wider uppercase text-sm">
                      Explore Salons <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Exclusive Offers Card */}
            <div className="group cursor-pointer">
              <div className="bg-dior-white border-l-4 border-l-dior-gold p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                {/* Subtle gold gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-dior-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-dior-black flex items-center justify-center mr-4">
                      <StarIcon className="w-6 h-6 text-dior-white" />
                    </div>
                    <h3 className="dior-heading-sm">Exclusive Offers</h3>
                  </div>
                  
                  <p className="dior-body mb-8 leading-relaxed">
                    Access exclusive promotions and special privileges at the most prestigious salons, reserved for our valued members.
                  </p>
                  
                  <Link to="/promotions">
                    <Button variant="outline" className="border-dior-black text-dior-black hover:bg-dior-black hover:text-dior-white transition-all duration-300 px-8 py-3 font-medium tracking-wider uppercase text-sm">
                      View Offers <ArrowRightIcon className="w-4 h-4 ml-2" />
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
      
      {/* CTA Section - DIOR Pure Contrast */}
      <section className="bg-dior-black py-24 px-6 relative overflow-hidden">
        {/* Elegant gold accents */}
        <div className="absolute top-12 left-1/4 w-2 h-2 bg-dior-gold rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-12 right-1/4 w-1 h-1 bg-dior-gold rounded-full opacity-60"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="dior-heading-lg text-dior-white mb-6">Begin Your Beauty Journey</h2>
          <div className="w-32 h-px bg-dior-gold mx-auto mb-8 opacity-60"></div>
          
          <p className="dior-body-lg text-dior-silver max-w-3xl mx-auto leading-relaxed mb-12">
            Join HAIB today and discover a world of exceptional beauty services, 
            where luxury meets convenience and every appointment is an experience to remember.
          </p>
          
          <Link to="/register">
            <Button className="bg-dior-white text-dior-black hover:bg-dior-pearl hover:shadow-2xl px-16 py-5 font-medium tracking-wider uppercase text-sm transition-all duration-500 transform hover:scale-105">
              Start Now <ArrowRightIcon className="w-5 h-5 ml-3" />
            </Button>
          </Link>
          
          {/* Minimalist gold accent */}
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-1 h-1 bg-dior-gold rounded-full opacity-60"></div>
              <div className="w-1 h-1 bg-dior-gold rounded-full opacity-40"></div>
              <div className="w-1 h-1 bg-dior-gold rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-100 dark:bg-neutral-800 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="dior-heading-sm text-foreground mb-2">HAIB</h3>
            <p className="dior-body-sm text-muted-foreground">Excellence in Beauty Services</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://instagram.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 group"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://facebook.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 group"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://twitter.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 group"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://linkedin.com/company/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 group"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://youtube.com/@haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-300 group"
              aria-label="Follow us on YouTube"
            >
              <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <Link to="/" className="dior-label text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/search" className="dior-label text-muted-foreground hover:text-foreground transition-colors">
              Search
            </Link>
            <Link to="/promotions" className="dior-label text-muted-foreground hover:text-foreground transition-colors">
              Offers
            </Link>
            <Link to="/auth" className="dior-label text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>
          
          <div className="text-center pt-8 border-t border-border">
            <p className="dior-body-sm text-muted-foreground">
              © 2024 HAIB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
