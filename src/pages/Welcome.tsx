
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
    <div className="min-h-screen flex flex-col bg-background theme-transition">
      {/* Hero Section - DIOR Luxury */}
      <section className="luxury-hero pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-noir opacity-90"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="dior-heading-xl text-beauty-light mb-8 animate-fade-in tracking-luxury">
            HAIB
          </h1>
          <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
          <p className="dior-body-lg text-beauty-light/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Découvrez et réservez des services de beauté d'exception dans les plus beaux salons. 
            Vivez l'expérience du luxe, de la sophistication et de la qualité inégalée à chaque rendez-vous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
            <Link to="/register" className="animate-slide-up">
              <Button className="beauty-button shadow-champagne">
                Commencer Votre Parcours
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Link to="/auth" className="animate-slide-up">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-beauty-accent text-beauty-light hover:bg-beauty-accent hover:text-beauty-dark bg-transparent backdrop-blur-sm transition-all duration-500 py-4 px-10 font-playfair tracking-luxury"
              >
                Se Connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section - Luxury Process */}
      <section className="py-32 px-6 bg-gradient-to-b from-beauty-light to-beauty-cream/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="dior-heading-lg text-beauty-dark mb-6 tracking-luxury">Comment Ça Marche</h2>
            <div className="h-1 w-24 mx-auto mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className="dior-body text-beauty-dark/70 max-w-2xl mx-auto leading-relaxed">
              Trois étapes simples vers votre expérience beauté parfaite
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center group animate-fade-in">
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <SearchIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">Découvrir</h3>
              <p className="dior-body text-beauty-dark/70 leading-relaxed">
                Trouvez des salons de beauté exceptionnels dans votre région avec des informations détaillées, des avis authentiques et des services premium.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group animate-fade-in">
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <CalendarIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">Réserver</h3>
              <p className="dior-body text-beauty-dark/70 leading-relaxed">
                Planifiez vos rendez-vous sans effort grâce à notre système de réservation sophistiqué conçu pour votre confort.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group animate-fade-in">
              <div className="luxury-card w-24 h-24 flex items-center justify-center mb-8 group-hover:shadow-champagne transition-all duration-500 border border-beauty-accent/20">
                <StarIcon className="w-12 h-12 text-beauty-accent" />
              </div>
              <h3 className="dior-heading-sm text-beauty-dark mb-6 tracking-luxury">Expérience</h3>
              <p className="dior-body text-beauty-dark/70 leading-relaxed">
                Offrez-vous des soins de beauté premium et partagez votre expérience exceptionnelle avec notre communauté.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Section - Luxury Services */}
      <section className="py-32 px-6 bg-gradient-to-b from-beauty-cream/30 to-beauty-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-pearl opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="dior-heading-lg text-beauty-dark mb-6 tracking-luxury">Explorer HAIB</h2>
            <div className="h-1 w-24 mb-8 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className="dior-body text-beauty-dark/70 max-w-2xl leading-relaxed">
              Découvrez l'univers sophistiqué des services de beauté premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="luxury-card p-12 group hover:shadow-luxury transition-all duration-500 border border-beauty-accent/20 backdrop-blur-sm">
              <h3 className="dior-heading-sm text-beauty-dark mb-8 flex items-center tracking-luxury">
                <MapPinIcon className="w-8 h-8 mr-4 text-beauty-accent" />
                Salons Premium
              </h3>
              <p className="dior-body text-beauty-dark/70 mb-10 leading-relaxed">
                Découvrez les plus beaux salons de beauté de votre région, explorez des services exclusifs et lisez les avis authentiques de notre communauté exigeante.
              </p>
              <Link to="/search">
                <Button 
                  variant="outline" 
                  className="border-beauty-accent text-beauty-dark hover:bg-beauty-accent hover:text-beauty-light transition-all duration-300 font-playfair tracking-luxury"
                >
                  Explorer les Salons <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="luxury-card p-12 group hover:shadow-luxury transition-all duration-500 border border-beauty-accent/20 backdrop-blur-sm">
              <h3 className="dior-heading-sm text-beauty-dark mb-8 flex items-center tracking-luxury">
                <StarIcon className="w-8 h-8 mr-4 text-beauty-accent" />
                Offres Exclusives
              </h3>
              <p className="dior-body text-beauty-dark/70 mb-10 leading-relaxed">
                Accédez aux promotions exclusives et privilèges spéciaux des salons les plus prestigieux, réservés à nos membres privilégiés.
              </p>
              <Link to="/promotions">
                <Button 
                  variant="outline" 
                  className="border-beauty-accent text-beauty-dark hover:bg-beauty-accent hover:text-beauty-light transition-all duration-300 font-playfair tracking-luxury"
                >
                  Voir les Offres <ArrowRightIcon className="w-4 h-4 ml-2" />
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
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="dior-heading-lg text-beauty-light mb-8 tracking-luxury">Commencez Votre Parcours Beauté</h2>
          <div className="h-1 w-32 mx-auto mb-12 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
          <p className="dior-body-lg text-beauty-light/90 mb-16 max-w-3xl mx-auto leading-relaxed">
            Rejoignez HAIB aujourd'hui et découvrez un monde de services de beauté d'exception, 
            où le luxe rencontre la commodité et chaque rendez-vous devient une expérience mémorable.
          </p>
          
          <Link to="/register">
            <Button className="beauty-button shadow-champagne animate-pulse hover:animate-none">
              Commencer Maintenant <ArrowRightIcon className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer - Luxury Elegance */}
      <footer className="bg-gradient-to-b from-beauty-cream/30 to-beauty-light py-16 px-6 mt-auto border-t border-beauty-accent/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="dior-heading-sm text-beauty-dark mb-4 tracking-luxury">HAIB</h3>
            <div className="h-1 w-16 mx-auto mb-4 bg-gradient-to-r from-beauty-accent to-beauty-secondary"></div>
            <p className="dior-body-sm text-beauty-dark/70 tracking-wider">Excellence en Services de Beauté</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mb-12">
            <a 
              href="https://instagram.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Suivez-nous sur Instagram"
            >
              <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://facebook.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Suivez-nous sur Facebook"
            >
              <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://twitter.com/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Suivez-nous sur Twitter"
            >
              <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://linkedin.com/company/haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Suivez-nous sur LinkedIn"
            >
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a 
              href="https://youtube.com/@haib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-gradient-to-r from-beauty-primary to-beauty-accent text-beauty-light flex items-center justify-center hover:shadow-champagne transition-all duration-300 group rounded-sm"
              aria-label="Suivez-nous sur YouTube"
            >
              <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            <Link to="/" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Accueil
            </Link>
            <Link to="/search" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Recherche
            </Link>
            <Link to="/promotions" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Offres
            </Link>
            <Link to="/auth" className="dior-label text-beauty-dark/70 hover:text-beauty-accent transition-colors tracking-wider">
              Connexion
            </Link>
          </div>
          
          <div className="text-center pt-8 border-t border-beauty-accent/20">
            <p className="dior-body-sm text-beauty-dark/60 tracking-wide">
              © 2024 HAIB. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
