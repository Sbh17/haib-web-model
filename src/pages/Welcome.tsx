
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightIcon, 
  StarIcon, 
  CalendarIcon, 
  SearchIcon, 
  MapPinIcon,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section - Dior Inspired */}
      <section className="bg-black text-white pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="dior-heading-xl text-white mb-8 animate-fade-in">
            HAIB
          </h1>
          <p className="dior-body-lg text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover and book exceptional beauty services at the finest salons. 
            Experience luxury, sophistication, and unparalleled quality in every appointment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link to="/home">
              <Button variant="luxury" size="xl" className="bg-white text-black hover:bg-white/90">
                Begin Your Journey
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="minimal" size="xl" className="border-white text-white hover:bg-white hover:text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="dior-heading-lg text-foreground mb-4">How It Works</h2>
            <p className="dior-body text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to your perfect beauty experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="bg-black w-20 h-20 flex items-center justify-center mb-8 group-hover:bg-black/90 transition-colors duration-300">
                <SearchIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="dior-heading-sm text-foreground mb-4">Discover</h3>
              <p className="dior-body text-muted-foreground leading-relaxed">
                Find exceptional beauty salons in your area with detailed information, authentic reviews, and premium services.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="bg-black w-20 h-20 flex items-center justify-center mb-8 group-hover:bg-black/90 transition-colors duration-300">
                <CalendarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="dior-heading-sm text-foreground mb-4">Reserve</h3>
              <p className="dior-body text-muted-foreground leading-relaxed">
                Schedule your appointments effortlessly with our sophisticated booking system designed for your convenience.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="bg-black w-20 h-20 flex items-center justify-center mb-8 group-hover:bg-black/90 transition-colors duration-300">
                <StarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="dior-heading-sm text-foreground mb-4">Experience</h3>
              <p className="dior-body text-muted-foreground leading-relaxed">
                Indulge in premium beauty treatments and share your exceptional experience with our community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Section */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="dior-heading-lg text-foreground mb-4">Explore HAIB</h2>
            <p className="dior-body text-muted-foreground max-w-2xl">
              Discover the sophisticated world of premium beauty services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="luxury-card p-8 group hover:shadow-xl transition-all duration-300">
              <h3 className="dior-heading-sm text-foreground mb-6 flex items-center">
                <MapPinIcon className="w-6 h-6 mr-4 text-black" />
                Find Premium Salons
              </h3>
              <p className="dior-body text-muted-foreground mb-8 leading-relaxed">
                Discover the finest beauty salons in your area, explore exclusive services, and read authentic reviews from our discerning community.
              </p>
              <Link to="/search">
                <Button variant="minimal" className="group-hover:bg-black group-hover:text-white transition-all duration-300">
                  Explore Salons <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="luxury-card p-8 group hover:shadow-xl transition-all duration-300">
              <h3 className="dior-heading-sm text-foreground mb-6 flex items-center">
                <StarIcon className="w-6 h-6 mr-4 text-black" />
                Exclusive Offers
              </h3>
              <p className="dior-body text-muted-foreground mb-8 leading-relaxed">
                Access exclusive promotions and special privileges at the most prestigious salons, reserved for our valued members.
              </p>
              <Link to="/promotions">
                <Button variant="minimal" className="group-hover:bg-black group-hover:text-white transition-all duration-300">
                  View Offers <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-black py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="dior-heading-lg text-white mb-6">Begin Your Beauty Journey</h2>
          <p className="dior-body-lg text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join HAIB today and discover a world of exceptional beauty services, 
            where luxury meets convenience and every appointment is an experience to remember.
          </p>
          
          <Link to="/home">
            <Button variant="luxury" size="xl" className="bg-white text-black hover:bg-white/90 shadow-lg">
              Start Now <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
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
