import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationPanel from '@/components/NotificationPanel';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  // Always call ALL hooks first in consistent order
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  
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
  
  // Now calculate values
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const hideHeader = location.pathname === '/welcome' || location.pathname === '/auth' || location.pathname === '/register';
  const showSidebar = !hideHeader;
  
  // AFTER all hooks are called, check if we should render
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
        return t.search;
      case '/appointments':
        return t.appointments;
      case '/news':
        return t.news;
      case '/promotions':
        return t.promotions;
      case '/profile':
        return t.profile;
      case '/settings':
        return t.settings;
      default:
        return '';
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-beauty-accent/20 bg-gradient-to-r from-beauty-light/95 to-beauty-cream/95 backdrop-blur-lg shadow-elegant theme-transition",
      isRTL && "border-l border-r-0"
    )}>
      <div className={cn("flex h-16 items-center justify-between px-6", isRTL && "flex-row-reverse")}>
        {/* Left side - Fixed width */}
        <div className={cn("flex items-center gap-4 w-32", isRTL && "flex-row-reverse")}>
          {!isHomePage ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
            >
              <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
              <span className="hidden md:inline font-inter font-light tracking-wide">{t.back}</span>
            </Button>
          ) : (
            showSidebar && <SidebarTrigger className="text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm" />
          )}
          
          {getPageTitle() && (
            <h1 className={cn("dior-heading-sm text-beauty-dark hidden sm:block", isRTL && "text-right")}>
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Center - Logo - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div onClick={() => navigate('/home')} className="cursor-pointer flex items-center group">
            {isHomePage ? (
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                <span className="dior-heading-xl text-black font-bold tracking-luxury text-3xl">H</span>
                <span className="dior-heading-xl text-black font-bold tracking-luxury text-3xl">A</span>
                <span className="dior-heading-xl text-black font-bold tracking-luxury text-3xl">I</span>
                <span className="dior-heading-xl text-black font-bold tracking-luxury text-3xl">B</span>
              </div>
            ) : (
              <Logo width={120} height={40} className="transition-transform duration-300 group-hover:scale-105" />
            )}
          </div>
        </div>

        {/* Right side - Fixed width to match left */}
        <div className={cn("flex items-center gap-3 w-32 justify-end", isRTL && "flex-row-reverse justify-start")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            className="hidden md:flex text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <LanguageSelector />
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