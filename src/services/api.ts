
// Mock API service
// This is a placeholder for a real API service that would connect to a backend

import { users, salons, services, appointments, reviews, promotions, salonRequests, serviceCategories, newsItems } from './mockData';
import { User, Salon, Appointment, Review, SalonRequest, ServiceCategory, Service, NewsItem, Promotion, SalonWorker, AppointmentAnalytics } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(500); // Simulate network delay
      
      // For specific mock users, we'll accept specific passwords
      if (email === 'admin@beautyspot.com' && password === 'admin123') {
        const adminUser = users.find(u => u.email === email);
        if (adminUser) {
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          return adminUser;
        }
      }

      // For salon owner
      if (email === 'salon1@example.com' && password === 'owner123') {
        const ownerUser = users.find(u => u.email === email);
        if (ownerUser) {
          localStorage.setItem('currentUser', JSON.stringify(ownerUser));
          return ownerUser;
        }
      }
      
      // For regular user
      if (email === 'user@example.com' && password === 'user123') {
        const regularUser = users.find(u => u.email === email);
        if (regularUser) {
          localStorage.setItem('currentUser', JSON.stringify(regularUser));
          return regularUser;
        }
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
    },
    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      await delay(300);
      // Mock data - in real app, would fetch from database
      return [
        {
          id: 'worker-1',
          salonId,
          name: 'Sarah Johnson',
          specialty: 'Hair Stylist',
          bio: 'Experienced stylist specializing in modern cuts and color',
          avatar: '',
          phone: '555-0101',
          email: 'sarah@salon.com',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'worker-2',
          salonId,
          name: 'Maria Garcia',
          specialty: 'Nail Technician',
          bio: 'Expert in nail art and manicures',
          avatar: '',
          phone: '555-0102',
          email: 'maria@salon.com',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    },
    
    addWorker: async (worker: Omit<SalonWorker, 'id' | 'createdAt' | 'updatedAt'>): Promise<SalonWorker> => {
      await delay(500);
      const newWorker: SalonWorker = {
        id: String(Date.now()),
        ...worker,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newWorker;
    },
    
    updateWorker: async (workerId: string, workerData: Partial<SalonWorker>): Promise<SalonWorker> => {
      await delay(500);
      // Mock update - in real app would update in database
      return {
        id: workerId,
        ...workerData,
        updatedAt: new Date().toISOString()
      } as SalonWorker;
    },
    
    deleteWorker: async (workerId: string): Promise<void> => {
      await delay(500);
      // Mock delete - in real app would delete from database
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
      
      // Update salon's basic information
      Object.assign(salon, salonData);
      
      // Handle service updates if they exist in the submission
      if (salonData.services) {
        // First, get existing services for this salon
        const existingServices = services.filter(service => service.salonId === salonId);
        
        // Process each service in the submission
        salonData.services.forEach(submittedService => {
          if (submittedService.id) {
            // This is an existing service - update it
            const serviceToUpdate = services.find(s => s.id === submittedService.id);
            if (serviceToUpdate) {
              Object.assign(serviceToUpdate, {
                ...submittedService,
                salonId: salonId,  // Ensure salonId is set correctly
              });
            }
          } else {
            // This is a new service - create it
            const newService: Service = {
              id: String(Date.now()) + Math.random().toString(36).substring(2, 9),
              salonId: salonId,
              name: submittedService.name || "",
              description: submittedService.description || "",
              price: submittedService.price || 0,
              duration: submittedService.duration || 30,
              categoryId: submittedService.categoryId || serviceCategories[0].id,
              image: submittedService.image || undefined,
            };
            services.push(newService);
          }
        });
        
        // Check for services that were deleted
        const submittedServiceIds = salonData.services
          .filter(s => s.id)
          .map(s => s.id as string);
          
        const existingServiceIds = existingServices.map(s => s.id);
        const servicesToDelete = existingServiceIds.filter(id => !submittedServiceIds.includes(id));
        
        if (servicesToDelete.length > 0) {
          // Remove deleted services
          for (const serviceId of servicesToDelete) {
            const index = services.findIndex(s => s.id === serviceId);
            if (index !== -1) {
              services.splice(index, 1);
            }
          }
        }
      }
      
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
  },
  profiles: {
    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      await delay(500);
      // Mock update - in real app would update in database
      const updatedUser = {
        ...profileData,
        id: userId,
        updatedAt: new Date().toISOString()
      } as User;
      
      // Update localStorage for demo
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    },
    
    uploadAvatar: async (userId: string, file: File): Promise<string> => {
      await delay(1000);
      // Mock upload - in real app would upload to storage
      return `https://via.placeholder.com/150?text=${userId.slice(0, 2)}`;
    }
  },
  analytics: {
    getAppointmentAnalytics: async (timeRange: string = 'month'): Promise<AppointmentAnalytics> => {
      await delay(500);
      // Mock analytics - in real app would calculate from database
      return {
        totalAppointments: 1250,
        completedAppointments: 987,
        cancelledAppointments: 125,
        pendingAppointments: 138,
        revenue: 45670,
        averageRating: 4.6,
        topSalons: [
          { salonName: "Glamour Studio", appointmentCount: 245, revenue: 12300 },
          { salonName: "Style Haven", appointmentCount: 198, revenue: 9870 },
          { salonName: "Beauty Palace", appointmentCount: 167, revenue: 8450 },
          { salonName: "Trendy Cuts", appointmentCount: 143, revenue: 7200 },
          { salonName: "Elegance Spa", appointmentCount: 112, revenue: 5600 }
        ],
        monthlyData: [
          { month: 'Jan', appointments: 156, revenue: 7800 },
          { month: 'Feb', appointments: 189, revenue: 9450 },
          { month: 'Mar', appointments: 234, revenue: 11700 },
          { month: 'Apr', appointments: 198, revenue: 9900 },
          { month: 'May', appointments: 267, revenue: 13350 },
          { month: 'Jun', appointments: 245, revenue: 12250 }
        ]
      };
    }
  }
};

export default api;
