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
  try {
    const sidebarContext = useSidebar();
    toggleSidebar = sidebarContext?.toggleSidebar;
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Sidebar trigger for when sidebar is available */}
        <div className="flex items-center gap-4">
          {showSidebar && toggleSidebar && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          {!isHomePage ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {getPageTitle() && (
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center">
          <div onClick={() => navigate('/home')} className="cursor-pointer">
            <Logo width={120} height={40} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center gap-2 hover:bg-accent"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <NotificationPanel />

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="hover:bg-accent"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
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