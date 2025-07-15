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
import { LogOut, Calendar, Plus, Settings, Crown, Sparkles, ChevronRight } from 'lucide-react';
import { UserRole } from '@/types';
import { Link } from 'react-router-dom';

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
      icon: <Calendar className="h-5 w-5" />,
      href: '/appointments',
      roles: ['user', 'salon_owner', 'admin'] as UserRole[],
      description: 'View and manage your beauty appointments'
    },
    {
      name: 'Account Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/profile/settings',
      roles: ['user', 'salon_owner', 'admin'] as UserRole[],
      description: 'Personalize your profile and preferences'
    },
    {
      name: 'Request a Salon',
      icon: <Plus className="h-5 w-5" />,
      href: '/salon-request',
      roles: ['user'] as UserRole[],
      description: 'Partner with us and add your salon'
    },
    {
      name: 'Manage My Salons',
      icon: <Crown className="h-5 w-5" />,
      href: '/owner/salons',
      roles: ['salon_owner'] as UserRole[],
      description: 'Oversee your salon operations'
    },
    {
      name: 'Admin Dashboard',
      icon: <Sparkles className="h-5 w-5" />,
      href: '/admin/dashboard',
      roles: ['admin'] as UserRole[],
      description: 'System administration and analytics'
    },
  ];
  
  const filteredNavigation = navigation.filter(item => 
    isRole(item.roles)
  );

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'salon_owner':
        return 'Salon Partner';
      case 'admin':
        return 'Administrator';
      default:
        return 'Member';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'salon_owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Sparkles className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Dior-Inspired Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-sm font-light tracking-widest text-muted-foreground uppercase">
                  Profile
                </span>
              </div>
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                Bonjour, {profile.full_name?.split(' ')[0]}
              </h1>
            </div>
            <Link 
              to="/profile/settings" 
              className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
          
          {/* Profile Card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                  <AvatarImage src={profile.avatar_url || '/placeholder.svg'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-lg font-light">
                    {getInitials(profile.full_name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary/10 rounded-full p-1">
                  {getRoleIcon(profile.role || 'user')}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-light text-foreground mb-1">
                  {profile.full_name}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {user?.email}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full">
                  {getRoleIcon(profile.role || 'user')}
                  <span className="text-xs font-medium text-primary tracking-wide">
                    {getRoleDisplayName(profile.role || 'user')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-6 pb-24">
        <div className="space-y-3">
          {filteredNavigation.map((item, index) => (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className="group w-full text-left p-4 bg-card/50 hover:bg-card border border-border/30 hover:border-primary/20 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/5 group-hover:bg-primary/10 rounded-lg transition-colors">
                    {React.cloneElement(item.icon, { 
                      className: "h-5 w-5 text-primary" 
                    })}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
        
        {/* Sign Out Section */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="group w-full text-left p-4 bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 rounded-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-destructive/10 group-hover:bg-destructive/20 rounded-lg transition-colors">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-medium text-destructive">
                    Sign Out
                  </h3>
                  <p className="text-sm text-destructive/70">
                    End your current session
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-destructive/70 group-hover:text-destructive transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Dior-Inspired Sign Out Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="border-border/50 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-destructive/10 rounded-full w-fit">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-light tracking-tight">
              Au Revoir
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
              Are you certain you wish to end your session? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl font-light">
              Stay Connected
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="rounded-xl bg-destructive hover:bg-destructive/90 font-light"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
