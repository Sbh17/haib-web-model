
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { LocationProvider } from '@/context/LocationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { PushNotificationService } from '@/services/pushNotifications';

// Import pages
import Welcome from '@/pages/Welcome';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import SalonDetail from '@/pages/SalonDetail';
import BookAppointment from '@/pages/BookAppointment';
import PaymentCheckout from '@/pages/PaymentCheckout';
import PaymentSuccess from '@/pages/PaymentSuccess';
import Appointments from '@/pages/Appointments';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Promotions from '@/pages/Promotions';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import Auth from '@/pages/Auth';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import AppContent from '@/components/AppContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize push notifications when the app starts
    PushNotificationService.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <LocationProvider>
              <Router>
                <AppContent />
              </Router>
              <Toaster />
            </LocationProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
