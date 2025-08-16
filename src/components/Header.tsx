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
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
      sidebarOpen ? 'md:ml-80' : ''
    }`}>
      <div className={`flex h-16 items-center justify-between px-4 md:px-6 transition-all duration-300 ${
        sidebarOpen ? 'gap-2' : 'gap-4'
      }`}>
        {/* Left side - Sidebar trigger and navigation */}
        <div className={`flex items-center transition-all duration-300 ${
          sidebarOpen ? 'gap-2' : 'gap-4'
        }`}>
          {showSidebar && toggleSidebar && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className={`flex items-center gap-2 transition-all duration-300 ${
                sidebarOpen ? 'text-primary bg-primary/10' : ''
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              {!sidebarOpen && <span className="hidden md:inline">Chat</span>}
            </Button>
          )}
          {!isHomePage ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className={`flex items-center gap-2 hover:bg-accent ${
                sidebarOpen ? 'hidden sm:flex' : 'flex'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className={sidebarOpen ? 'hidden lg:inline' : 'hidden sm:inline'}>Back</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {getPageTitle() && (
            <h1 className={`text-lg font-semibold text-foreground transition-all duration-300 ${
              sidebarOpen ? 'hidden lg:block' : 'hidden sm:block'
            }`}>
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Center - Logo */}
        <div className={`flex-1 flex justify-center transition-all duration-300 ${
          sidebarOpen ? 'ml-2 mr-2' : ''
        }`}>
          <div onClick={() => navigate('/home')} className="cursor-pointer">
            <Logo 
              width={sidebarOpen ? 100 : 120} 
              height={sidebarOpen ? 32 : 40} 
              className="transition-all duration-300"
            />
          </div>
        </div>

        {/* Right side */}
        <div className={`flex items-center transition-all duration-300 ${
          sidebarOpen ? 'gap-1' : 'gap-2'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            className={`items-center gap-2 hover:bg-accent transition-all duration-300 ${
              sidebarOpen ? 'hidden lg:flex' : 'hidden sm:flex'
            }`}
          >
            <Search className="h-4 w-4" />
            {!sidebarOpen && <span className="hidden xl:inline">Search</span>}
          </Button>
          
          <NotificationPanel />

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="hover:bg-accent"
          >
            <Avatar className={`transition-all duration-300 ${
              sidebarOpen ? 'h-6 w-6' : 'h-7 w-7'
            }`}>
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                <User className={`transition-all duration-300 ${
                  sidebarOpen ? 'h-3 w-3' : 'h-4 w-4'
                }`} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;