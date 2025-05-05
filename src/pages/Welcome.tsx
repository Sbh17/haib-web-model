import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, StarIcon, CalendarIcon, SearchIcon, MapPinIcon } from 'lucide-react';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Updated with new color */}
      <section className="bg-gradient-to-br from-beauty-primary to-beauty-secondary/80 text-white pt-16 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            BeautySpot
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover and book beauty services at the best salons near you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-beauty-primary hover:bg-white/90 font-semibold px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="bg-beauty-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-beauty-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Salons</h3>
              <p className="text-gray-600">Find top-rated beauty salons in your area with detailed information and reviews.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="bg-beauty-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-beauty-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointments</h3>
              <p className="text-gray-600">Schedule your appointments easily with our intuitive booking system.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="bg-beauty-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <StarIcon className="w-8 h-8 text-beauty-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Services</h3>
              <p className="text-gray-600">Get the best beauty treatments and share your experience with others.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Explore BeautySpot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-beauty-primary" />
                Find Local Salons
              </h3>
              <p className="text-gray-600 mb-4">
                Discover the best beauty salons in your area, browse services, and read authentic reviews.
              </p>
              <Link to="/search">
                <Button variant="outline" className="text-beauty-primary">
                  Search Salons <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <StarIcon className="w-5 h-5 mr-2 text-beauty-primary" />
                Special Offers
              </h3>
              <p className="text-gray-600 mb-4">
                Take advantage of exclusive promotions and discounts at top salons near you.
              </p>
              <Link to="/">
                <Button variant="outline" className="text-beauty-primary">
                  View Promotions <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-beauty-primary/10 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join BeautySpot today and discover the best beauty services in your area.
          </p>
          
          <Link to="/register">
            <Button size="lg" className="bg-beauty-primary hover:bg-beauty-primary/90 text-white font-semibold px-8">
              Create Your Account <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-600">© 2023 BeautySpot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/" className="text-gray-600 hover:text-beauty-primary">Home</Link>
            <Link to="/search" className="text-gray-600 hover:text-beauty-primary">Search</Link>
            <Link to="/register" className="text-gray-600 hover:text-beauty-primary">Sign Up</Link>
            <Link to="/login" className="text-gray-600 hover:text-beauty-primary">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
