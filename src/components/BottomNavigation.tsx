
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, CalendarIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-6 z-50">
      <Link
        to="/home"
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive('/home') ? 'text-beauty-primary' : 'text-gray-500'
        }`}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link
        to="/search"
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive('/search') ? 'text-beauty-primary' : 'text-gray-500'
        }`}
      >
        <SearchIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link
        to="/appointments"
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive('/appointments') ? 'text-beauty-primary' : 'text-gray-500'
        }`}
      >
        <CalendarIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Bookings</span>
      </Link>
      
      <Link
        to={user ? "/profile" : "/login"}
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive('/profile') || isActive('/login') ? 'text-beauty-primary' : 'text-gray-500'
        }`}
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-xs mt-1">{user ? 'Profile' : 'Login'}</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
