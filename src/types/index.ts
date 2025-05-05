
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

export interface SalonRequest {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
