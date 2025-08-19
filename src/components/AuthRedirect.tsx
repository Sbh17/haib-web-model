import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if we're still loading
    if (isLoading) return;

    // If user is not authenticated and trying to access protected routes
    if (!user && location.pathname !== '/welcome' && location.pathname !== '/auth') {
      navigate('/welcome', { replace: true });
      return;
    }

    // If user is authenticated and on welcome or auth page, redirect to chat
    if (user && (location.pathname === '/welcome' || location.pathname === '/auth')) {
      navigate('/chat', { replace: true });
      return;
    }
  }, [user, isLoading, location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthRedirect;