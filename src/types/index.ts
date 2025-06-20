export type UserRole = "user" | "salon_owner" | "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  preferences?: Record<string, any>;
  updatedAt?: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface SalonWorker {
  id: string;
  salonId: string;
  name: string;
  specialty?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Salon {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;
  longitude?: number;
  coverImage: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  priceRange?: string;
  isOpen?: boolean;
  openingHours?: Record<string, string>;
  amenities?: string[];
  ownerId: string;
  services: string[] | Service[];
  promotions?: Promotion[];
  workers?: SalonWorker[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  socialMedia?: SocialMedia;
  businessId?: string;
  distance?: number; // Distance in kilometers for nearby salons
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  salonId: string;
  categoryId: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  workerId?: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  salonId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  salonId: string;
  title: string;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  validUntil?: string;
  discount: number;
  isActive?: boolean;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
  category: string;
}

// Define a specific interface for the service input in salon requests
export interface SalonRequestService {
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface SalonRequest {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  businessId?: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  // Add these new properties using the proper interface
  images?: string[];
  services?: SalonRequestService[];
  socialMedia?: SocialMedia;
}

export interface AppointmentAnalytics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  revenue: number;
  averageRating: number;
  topSalons: Array<{
    salonName: string;
    appointmentCount: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
}
