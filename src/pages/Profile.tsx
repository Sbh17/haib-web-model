import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import BottomNavigation from '@/components/BottomNavigation';
import { LogOutIcon, UserIcon, CalendarIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { UserRole } from '@/types';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, isRole } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!profile) {
      navigate('/auth');
    }
  }, [profile, navigate]);
  
  if (!profile) {
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Navigation options based on user role
  const navigation = [
    {
      name: 'My Appointments',
      icon: <CalendarIcon className="h-5 w-5" />,
      href: '/appointments',
      roles: ['user', 'salon_owner', 'admin'] as UserRole[],
    },
    {
      name: 'Account Settings',
      icon: <SettingsIcon className="h-5 w-5" />,
      href: '/profile/settings',
      roles: ['user', 'salon_owner', 'admin'] as UserRole[],
    },
    {
      name: 'Request a Salon',
      icon: <PlusIcon className="h-5 w-5" />,
      href: '/salon-request',
      roles: ['user'] as UserRole[],
    },
    {
      name: 'Manage My Salons',
      icon: <SettingsIcon className="h-5 w-5" />,
      href: '/owner/salons',
      roles: ['salon_owner'] as UserRole[],
    },
    {
      name: 'Admin Dashboard',
      icon: <SettingsIcon className="h-5 w-5" />,
      href: '/admin/dashboard',
      roles: ['admin'] as UserRole[],
    },
  ];
  
  const filteredNavigation = navigation.filter(item => 
    isRole(item.roles)
  );
  
  return (
    <div className="pb-20">
      {/* Profile Header */}
      <header className="bg-beauty-primary text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Link to="/profile/settings" className="hover:opacity-80">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={profile.avatar_url || '/placeholder.svg'} />
            <AvatarFallback className="bg-beauty-primary text-white text-lg">
              {getInitials(profile.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <div className="mt-1">
              <span className="bg-beauty-primary/10 text-beauty-primary text-xs px-2 py-1 rounded-full">
                 {profile.role === 'salon_owner' ? 'Salon Owner' : 
                 profile.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="p-6">
        <div className="space-y-2">
          {filteredNavigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start text-left py-6 text-base font-normal"
              onClick={() => navigate(item.href)}
            >
              <div className="flex items-center">
                <div className="mr-3 text-gray-500">{item.icon}</div>
                {item.name}
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full justify-start text-left py-6 text-base font-normal text-red-500 border-red-200"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <div className="flex items-center">
              <LogOutIcon className="h-5 w-5 mr-3" />
              Sign Out
            </div>
          </Button>
        </div>
      </div>
      
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
