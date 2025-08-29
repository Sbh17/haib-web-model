import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthRedirect from '@/components/AuthRedirect';
import AIChatSidebar from '@/components/chat/AIChatSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
import AccountSecurity from '@/pages/AccountSecurity';
import PrivacySettings from '@/pages/PrivacySettings';
import AdminDashboard from '@/pages/AdminDashboard';
import OwnerDashboard from '@/pages/OwnerDashboard';
import Favorites from '@/pages/Favorites';
import Reviews from '@/pages/Reviews';
import Auth from '@/pages/Auth';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import VIPPartnership from '@/pages/VIPPartnership';
import PartnershipStatus from '@/pages/PartnershipStatus';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

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
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen bg-background touch-manipulation flex w-full">
          <AIChatSidebar onBookAppointment={handleBookAppointment} />
          
          <div className="flex-1 flex flex-col">
            <Header />
            
            <main className="flex-1 overflow-auto">
              <Routes>
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
                <Route path="/profile-settings" element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } />
                <Route path="/account-security" element={
                  <ProtectedRoute>
                    <AccountSecurity />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/owner/salons" element={
                  <ProtectedRoute>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="/reviews" element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                } />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vip-partnership" element={<VIPPartnership />} />
                <Route path="/partnership-status" element={
                  <ProtectedRoute>
                    <PartnershipStatus />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthRedirect>
  );
};

export default AppContent;