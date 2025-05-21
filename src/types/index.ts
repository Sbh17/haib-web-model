
export type UserRole = "user" | "salon_owner" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Salon {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  coverImage: string;
  rating: number;
  reviewCount: number;
  ownerId: string;
  services: Service[];
  promotions: Promotion[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  socialMedia?: SocialMedia;
  businessId?: string;
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
  discount: number;
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
