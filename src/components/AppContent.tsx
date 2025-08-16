import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthRedirect from '@/components/AuthRedirect';
import ModernChatWidget from '@/components/chat/ModernChatWidget';

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

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookAppointment = (bookingData: any) => {
    // Navigate to booking page with the AI-suggested appointment data
    navigate('/search', { 
      state: { 
        aiSuggestion: bookingData,
        fromChat: true 
      } 
    });
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/salon/:id" element={
            <ProtectedRoute>
              <SalonDetail />
            </ProtectedRoute>
          } />
          <Route path="/book/:salonId/:serviceId" element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          } />
          <Route path="/payment-checkout" element={
            <ProtectedRoute>
              <PaymentCheckout />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          } />
          <Route path="/news/:id" element={
            <ProtectedRoute>
              <NewsDetail />
            </ProtectedRoute>
          } />
          <Route path="/promotions" element={
            <ProtectedRoute>
              <Promotions />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* AI Chat Assistant - Available on all protected routes */}
        {location.pathname !== '/welcome' && location.pathname !== '/auth' && location.pathname !== '/register' && (
          <ModernChatWidget onBookAppointment={handleBookAppointment} />
        )}
      </div>
    </AuthRedirect>
  );
};

export default AppContent;