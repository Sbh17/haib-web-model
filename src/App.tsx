
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import SalonDetail from "./pages/SalonDetail";
import BookAppointment from "./pages/BookAppointment";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Settings from "./pages/Settings";
import SalonRequest from "./pages/SalonRequest";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUsers from "./pages/AdminUsers";
import SalonManagement from "./pages/SalonManagement";
import SalonEdit from "./pages/SalonEdit";
import SalonOwnerDashboard from "./pages/SalonOwnerDashboard";
import Promotions from "./pages/Promotions";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";
import AdminAccess from "./pages/AdminAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search />} />
                <Route path="/salons/:id" element={<SalonDetail />} />
                <Route path="/appointments/book" element={<BookAppointment />} />
                <Route path="/payment-checkout" element={<PaymentCheckout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/salon-request" element={<SalonRequest />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/admin/access" element={<AdminAccess />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/salons" element={<SalonManagement />} />
                <Route path="/admin/salons/:id" element={<SalonEdit />} />
                <Route path="/owner/salons" element={<SalonOwnerDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
