// Mock API service
// This is a placeholder for a real API service that would connect to a backend

import { users, salons, services, appointments, reviews, promotions, salonRequests, serviceCategories, newsItems } from './mockData';
import { User, Salon, Appointment, Review, SalonRequest, ServiceCategory, Service, NewsItem, Promotion, SocialMedia } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(500); // Simulate network delay
      
      // For admin@beautyspot.com, we'll accept any password
      if (email === 'admin@beautyspot.com') {
        const adminUser = users.find(u => u.email === email);
        if (adminUser) {
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          return adminUser;
        }
      }
      
      // For other demo users
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      
      throw new Error('Invalid email or password');
    },
    register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      await delay(500); // Simulate network delay
      const newUser: User = {
        id: String(Date.now()),
        ...data,
        role: 'user',
        createdAt: new Date().toISOString(),
      } as User;
      users.push(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    },
    getCurrentUser: async (): Promise<User | null> => {
      await delay(300); // Simulate network delay
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    },
    logout: async (): Promise<void> => {
      await delay(300); // Simulate network delay
      localStorage.removeItem('currentUser');
    },
  },
  salons: {
    getAll: async (): Promise<Salon[]> => {
      await delay(300); // Simulate network delay
      return salons;
    },
    getById: async (id: string): Promise<Salon | undefined> => {
      await delay(300); // Simulate network delay
      return salons.find(salon => salon.id === id);
    },
    getNearby: async (lat: number, lng: number, radius: number = 5): Promise<Salon[]> => {
      await delay(500); // Simulate network delay
      // For mock data, we're just returning all salons since we don't have actual geocoordinates
      return salons;
    },
    search: async (query: string): Promise<Salon[]> => {
      await delay(500); // Simulate network delay
      if (!query) return salons;
      return salons.filter(salon => 
        salon.name.toLowerCase().includes(query.toLowerCase()) ||
        salon.description.toLowerCase().includes(query.toLowerCase()) ||
        salon.address.toLowerCase().includes(query.toLowerCase())
      );
    },
    requestNewSalon: async (request: Omit<SalonRequest, "id" | "status" | "createdAt">): Promise<void> => {
      await delay(500); // Simulate network delay
      const newRequest: SalonRequest = {
        id: String(Date.now()),
        ...request,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      salonRequests.push(newRequest);
    }
  },
  services: {
    getBySalonId: async (salonId: string): Promise<Service[]> => {
      await delay(300); // Simulate network delay
      return services.filter(service => service.salonId === salonId);
    },
    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      await delay(300); // Simulate network delay
      return serviceCategories;
    },
    getForSalon: async (salonId: string): Promise<Service[]> => {
      await delay(300); // Simulate network delay
      return services.filter(service => service.salonId === salonId);
    }
  },
  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      await delay(300); // Simulate network delay
      return appointments;
    },
    getMyAppointments: async (userId?: string): Promise<Appointment[]> => {
      await delay(500); // Simulate network delay
      if (userId) {
        return appointments.filter(appointment => appointment.userId === userId);
      }
      return appointments; // Return all if no userId provided
    },
    create: async (appointment: Appointment): Promise<Appointment> => {
      await delay(500); // Simulate network delay
      appointments.push(appointment);
      return appointment;
    },
    bookAppointment: async (appointmentData: Omit<Appointment, "id" | "status">): Promise<Appointment> => {
      await delay(500); // Simulate network delay
      const newAppointment: Appointment = {
        id: String(Date.now()),
        ...appointmentData,
        status: 'confirmed',
      };
      appointments.push(newAppointment);
      return newAppointment;
    },
    cancelAppointment: async (id: string): Promise<void> => {
      await delay(500); // Simulate network delay
      const appointment = appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    }
  },
  reviews: {
    getBySalonId: async (salonId: string): Promise<Review[]> => {
      await delay(300); // Simulate network delay
      return reviews.filter(review => review.salonId === salonId);
    },
    create: async (review: Review): Promise<Review> => {
      await delay(500); // Simulate network delay
      reviews.push(review);
      return review;
    },
    getForSalon: async (salonId: string): Promise<Review[]> => {
      await delay(300); // Simulate network delay
      return reviews.filter(review => review.salonId === salonId);
    }
  },
  promotions: {
    getBySalonId: async (salonId: string): Promise<Promotion[]> => {
      await delay(300); // Simulate network delay
      return promotions.filter(promotion => promotion.salonId === salonId);
    },
    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      await delay(300); // Simulate network delay
      return promotions.filter(promotion => promotion.salonId === salonId);
    },
    getAll: async (): Promise<Promotion[]> => {
      await delay(300); // Simulate network delay
      return promotions;
    },
    getActive: async (): Promise<Promotion[]> => {
      await delay(300); // Simulate network delay
      const now = new Date().toISOString();
      return promotions.filter(
        promo => promo.startDate <= now && promo.endDate >= now
      );
    }
  },
  news: {
    getAll: async (): Promise<NewsItem[]> => {
      await delay(300); // Simulate network delay
      return newsItems;
    },
    getById: async (id: string): Promise<NewsItem | undefined> => {
      await delay(300); // Simulate network delay
      return newsItems.find(newsItem => newsItem.id === id);
    },
    getLatest: async (limit: number = 3): Promise<NewsItem[]> => {
      await delay(300); // Simulate network delay
      return [...newsItems]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  },
  admin: {
    getAllUsers: async (): Promise<User[]> => {
      await delay(500);
      return users;
    },
    deleteUser: async (userId: string): Promise<void> => {
      await delay(500);
      const index = users.findIndex(user => user.id === userId);
      if (index > -1) {
        users.splice(index, 1);
      }
    },
    resetUserPassword: async (userId: string): Promise<void> => {
      await delay(500);
      console.log(`Password reset requested for user ID: ${userId}`);
      // In a real application, you would trigger a password reset email here.
    },
    getSalonRequests: async (): Promise<SalonRequest[]> => {
      await delay(500);
      return salonRequests;
    },
    approveSalonRequest: async (requestId: string): Promise<void> => {
      await delay(500);
      const request = salonRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'approved';
      }
    },
    rejectSalonRequest: async (requestId: string): Promise<void> => {
      await delay(500);
      const request = salonRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'rejected';
      }
    },
    getAllSalons: async (): Promise<Salon[]> => {
      await delay(500);
      return salons;
    },
    getSalonById: async (salonId: string): Promise<Salon | undefined> => {
      await delay(500);
      return salons.find(salon => salon.id === salonId);
    },
    updateSalon: async (salonId: string, salonData: Partial<Salon>): Promise<Salon> => {
      await delay(500);
      const salon = salons.find(s => s.id === salonId);
      if (!salon) {
        throw new Error('Salon not found');
      }
      
      Object.assign(salon, salonData);
      return salon;
    },
    deleteSalon: async (salonId: string): Promise<void> => {
      await delay(500);
      const index = salons.findIndex(salon => salon.id === salonId);
      if (index > -1) {
        salons.splice(index, 1);
      }
    }
  },
  salonOwner: {
    getMySalons: async (ownerId?: string): Promise<Salon[]> => {
      await delay(500); // Simulate network delay
      if (ownerId) {
        return salons.filter(salon => salon.ownerId === ownerId);
      }
      return salons; // Return all if no ownerId provided
    }
  }
};

export default api;
