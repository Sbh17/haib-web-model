
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { LocationProvider } from '@/context/LocationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import SalonDetail from '@/pages/SalonDetail';
import BookAppointment from '@/pages/BookAppointment';
import Appointments from '@/pages/Appointments';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import SalonRequest from '@/pages/SalonRequest';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import SalonManagement from '@/pages/SalonManagement';
import SalonEdit from '@/pages/SalonEdit';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Promotions from '@/pages/Promotions';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <LocationProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/salon/:id" element={<SalonDetail />} />
                    <Route path="/book/:salonId/:serviceId" element={<BookAppointment />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<ProfileSettings />} />
                    <Route path="/salon-request" element={<SalonRequest />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/owner/salons" element={<SalonManagement />} />
                    <Route path="/salon/:id/edit" element={<SalonEdit />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </LocationProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
