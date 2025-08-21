import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Search, Menu, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationPanel from '@/components/NotificationPanel';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Only get sidebar context if we're in a sidebar-enabled route
  let toggleSidebar: (() => void) | undefined;
  let sidebarOpen = false;
  try {
    const sidebarContext = useSidebar();
    toggleSidebar = sidebarContext?.toggleSidebar;
    sidebarOpen = sidebarContext?.open || false;
  } catch {
    // Not in a sidebar context, which is fine for non-sidebar routes
  }
  
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  
  // Hide header on welcome and auth pages  
  const hideHeader = location.pathname === '/welcome' || location.pathname === '/auth' || location.pathname === '/register';
  const showSidebar = !hideHeader;
  
  // Don't render header if user is not authenticated or on specific pages
  if (hideHeader || !user) {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/home':
      case '/':
        return '';
      case '/search':
        return 'Search';
      case '/appointments':
        return 'Appointments';
      case '/news':
        return 'News';
      case '/promotions':
        return 'Promotions';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      default:
        return '';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-beauty-accent/20 bg-gradient-to-r from-beauty-light/95 to-beauty-cream/95 backdrop-blur-lg shadow-elegant theme-transition">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Fixed width */}
        <div className="flex items-center gap-4 w-32">
          {!isHomePage ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline font-inter font-light tracking-wide">Back</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="md:hidden text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {getPageTitle() && (
            <h1 className="dior-heading-sm text-beauty-dark hidden sm:block">
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Center - Logo - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div onClick={() => navigate('/home')} className="cursor-pointer flex items-center group">
            <Logo width={100} height={32} className="transition-transform duration-300 group-hover:scale-105" />
          </div>
        </div>

        {/* Right side - Fixed width to match left */}
        <div className="flex items-center gap-3 w-32 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            className="hidden md:flex text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
            className="text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          <NotificationPanel />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
          >
            <Avatar className="h-7 w-7 border border-beauty-accent/20">
              <AvatarFallback className="bg-beauty-accent/10 text-beauty-dark">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;