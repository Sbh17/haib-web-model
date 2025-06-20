
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isRole: (role: UserRole | UserRole[]) => boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers = {
  admin: {
    id: 'admin-123',
    email: 'admin@beautyspot.com',
    name: 'Admin User',
    phone: '+1234567890',
    role: 'admin' as UserRole,
    avatar: '',
    createdAt: new Date().toISOString(),
    bio: 'System Administrator',
  },
  salon_owner: {
    id: 'owner-123',
    email: 'owner@beautyspot.com',
    name: 'Salon Owner',
    phone: '+1234567891',
    role: 'salon_owner' as UserRole,
    avatar: '',
    createdAt: new Date().toISOString(),
    bio: 'Beauty Salon Owner',
  },
  user: {
    id: 'user-123',
    email: 'user@beautyspot.com',
    name: 'Regular User',
    phone: '+1234567892',
    role: 'user' as UserRole,
    avatar: '',
    createdAt: new Date().toISOString(),
    bio: 'Beauty enthusiast',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load stored role from localStorage or default to user
    const storedRole = localStorage.getItem('demo_role') as UserRole || 'user';
    setUser(mockUsers[storedRole]);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple mock login based on email
    let selectedUser = mockUsers.user;
    if (email.includes('admin')) {
      selectedUser = mockUsers.admin;
    } else if (email.includes('salon') || email.includes('owner')) {
      selectedUser = mockUsers.salon_owner;
    }
    
    setUser(selectedUser);
    localStorage.setItem('demo_role', selectedUser.role);
    
    toast({
      title: "Login successful!",
      description: `Welcome back, ${selectedUser.name}!`,
    });
    setIsLoading(false);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      ...mockUsers.user,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    
    setUser(newUser);
    localStorage.setItem('demo_role', 'user');
    
    toast({
      title: "Registration successful!",
      description: `Welcome, ${newUser.name}!`,
    });
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('demo_role');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const switchRole = (role: UserRole) => {
    const selectedUser = mockUsers[role];
    setUser(selectedUser);
    localStorage.setItem('demo_role', role);
    
    toast({
      title: "Role switched",
      description: `You are now viewing as: ${selectedUser.name}`,
    });
  };

  const isRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isRole,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
