
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg dark:border-sidebar-border dark:bg-sidebar-background z-50">
      <div className="max-w-5xl mx-auto px-2 flex justify-around">
        <Link to="/home" className={cn(
          "flex flex-col items-center p-2 text-xs",
          isActive('/home') ? "text-beauty-primary" : "text-muted-foreground"
        )}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/search" className={cn(
          "flex flex-col items-center p-2 text-xs",
          isActive('/search') ? "text-beauty-primary" : "text-muted-foreground"
        )}>
          <Search size={20} />
          <span>Search</span>
        </Link>
        <Link to="/appointments" className={cn(
          "flex flex-col items-center p-2 text-xs",
          isActive('/appointments') ? "text-beauty-primary" : "text-muted-foreground"
        )}>
          <Calendar size={20} />
          <span>Appointments</span>
        </Link>
        <Link to="/news" className={cn(
          "flex flex-col items-center p-2 text-xs",
          isActive('/news') ? "text-beauty-primary" : "text-muted-foreground"
        )}>
          <User size={20} />
          <span>News</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
