// Mock API service
// This is a placeholder for a real API service that would connect to a backend

import { users, salons, services, appointments, reviews, promotions, salonRequests, serviceCategories, newsItems } from './mockData';
import { User, Salon, Appointment, Review, SalonRequest, ServiceCategory, Service, NewsItem } from '@/types';

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
  },
  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      await delay(300); // Simulate network delay
      return appointments;
    },
    create: async (appointment: Appointment): Promise<Appointment> => {
      await delay(500); // Simulate network delay
      appointments.push(appointment);
      return appointment;
    },
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
  },
  promotions: {
    getBySalonId: async (salonId: string): Promise<Promotion[]> => {
      await delay(300); // Simulate network delay
      return promotions.filter(promotion => promotion.salonId === salonId);
    },
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
  },
};

export default api;
