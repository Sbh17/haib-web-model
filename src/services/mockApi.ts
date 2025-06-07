import { User, Salon, Service, Appointment, Review, NewsItem, Promotion, SalonWorker, SalonRequest, ServiceCategory } from '@/types';

// Mock data and API implementation
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSalons: Salon[] = [
  {
    id: '1',
    name: 'Glamour Studio',
    description: 'Premium beauty salon with expert stylists',
    address: '123 Beauty Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1234567890',
    email: 'info@glamourstudio.com',
    website: 'https://glamourstudio.com',
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    rating: 4.8,
    reviewCount: 127,
    priceRange: '$$$',
    latitude: 40.7128,
    longitude: -74.0060,
    isOpen: true,
    openingHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '10:00 AM - 5:00 PM'
    },
    amenities: ['WiFi', 'Parking', 'Wheelchair Accessible'],
    services: [],
    ownerId: '1',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockServices: Service[] = [
  {
    id: '1',
    salonId: '1',
    name: 'Haircut & Style',
    description: 'Professional haircut with styling',
    price: 65,
    duration: 60,
    categoryId: '1',
    category: 'Hair',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockServiceCategories: ServiceCategory[] = [
  { id: '1', name: 'Hair' },
  { id: '2', name: 'Nails' },
  { id: '3', name: 'Spa' },
  { id: '4', name: 'Makeup' }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: '1',
    salonId: '1',
    serviceId: '1',
    workerId: '1',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'confirmed',
    notes: 'Looking forward to the appointment',
    createdAt: new Date().toISOString()
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    salonId: '1',
    appointmentId: '1',
    rating: 5,
    comment: 'Excellent service!',
    createdAt: new Date().toISOString()
  }
];

const mockWorkers: SalonWorker[] = [
  {
    id: '1',
    salonId: '1',
    name: 'Sarah Johnson',
    specialty: 'Hair Styling',
    bio: 'Expert hair stylist with 10+ years experience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    phone: '+1234567891',
    email: 'sarah@glamourstudio.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSalonRequests: SalonRequest[] = [
  {
    id: '1',
    name: 'New Beauty Salon',
    description: 'A modern beauty salon',
    address: '456 Style Avenue',
    city: 'Los Angeles',
    ownerName: 'Jane Smith',
    ownerEmail: 'jane@newbeauty.com',
    ownerPhone: '+1987654321',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Summer Beauty Trends 2024',
    content: 'Discover the hottest beauty trends for this summer season...',
    category: 'Trends',
    date: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
  }
];

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: '50% Off First Visit',
    description: 'Get 50% off your first appointment at participating salons',
    discount: 50,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date().toISOString(),
    salonId: '1',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Set up salon services
mockSalons[0].services = mockServices;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
const mockApi = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(1000);
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return user;
    },
    
    register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      await delay(1000);
      const newUser: User = {
        id: Date.now().toString(),
        ...data,
        role: 'customer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    },
    
    logout: async (): Promise<void> => {
      await delay(500);
    },
    
    getCurrentUser: async (): Promise<User | null> => {
      await delay(500);
      return mockUsers[0] || null;
    }
  },
  
  salons: {
    getAll: async (): Promise<Salon[]> => {
      await delay(800);
      return mockSalons;
    },
    
    getById: async (id: string): Promise<Salon | null> => {
      await delay(600);
      return mockSalons.find(salon => salon.id === id) || null;
    },
    
    getNearby: async (lat: number, lng: number, radius: number = 10): Promise<Salon[]> => {
      await delay(1000);
      return mockSalons;
    },
    
    search: async (query: string): Promise<Salon[]> => {
      await delay(700);
      return mockSalons.filter(salon => 
        salon.name.toLowerCase().includes(query.toLowerCase()) ||
        salon.description.toLowerCase().includes(query.toLowerCase())
      );
    },

    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      await delay(600);
      return mockWorkers.filter(worker => worker.salonId === salonId);
    },

    requestNewSalon: async (salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest> => {
      await delay(1000);
      const newRequest: SalonRequest = {
        id: Date.now().toString(),
        ...salonData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      mockSalonRequests.push(newRequest);
      return newRequest;
    }
  },
  
  services: {
    getAll: async (): Promise<Service[]> => {
      await delay(600);
      return mockServices;
    },

    getForSalon: async (salonId: string): Promise<Service[]> => {
      await delay(600);
      return mockServices.filter(service => service.salonId === salonId);
    },

    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      await delay(400);
      return mockServiceCategories;
    }
  },

  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      await delay(700);
      return mockAppointments;
    },

    getMyAppointments: async (userId: string): Promise<Appointment[]> => {
      await delay(700);
      return mockAppointments.filter(apt => apt.userId === userId);
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
      await delay(1000);
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...appointmentData
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
      await delay(500);
      const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
      if (appointmentIndex !== -1) {
        mockAppointments[appointmentIndex].status = 'cancelled';
      }
    }
  },

  reviews: {
    getAll: async (): Promise<Review[]> => {
      await delay(600);
      return mockReviews;
    },

    getForSalon: async (salonId: string): Promise<Review[]> => {
      await delay(600);
      return mockReviews.filter(review => review.salonId === salonId);
    },

    create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
      await delay(500);
      const newReview: Review = {
        id: Date.now().toString(),
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      mockReviews.push(newReview);
      return newReview;
    }
  },
  
  news: {
    getAll: async (): Promise<NewsItem[]> => {
      await delay(600);
      return mockNews;
    },
    
    getById: async (id: string): Promise<NewsItem | null> => {
      await delay(400);
      return mockNews.find(item => item.id === id) || null;
    },

    getLatest: async (limit: number = 5): Promise<NewsItem[]> => {
      await delay(500);
      return mockNews.slice(0, limit);
    }
  },
  
  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      await delay(700);
      return mockPromotions;
    },
    
    getActive: async (): Promise<Promotion[]> => {
      await delay(700);
      return mockPromotions.filter(promo => promo.isActive);
    },

    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      await delay(600);
      return mockPromotions.filter(promo => promo.salonId === salonId);
    }
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      await delay(800);
      return mockUsers;
    },

    deleteUser: async (userId: string): Promise<void> => {
      await delay(500);
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }
    },

    resetUserPassword: async (userId: string): Promise<void> => {
      await delay(500);
      // In a real implementation, this would send a password reset email
      console.log(`Password reset initiated for user ${userId}`);
    },

    getAllSalons: async (): Promise<Salon[]> => {
      await delay(800);
      return mockSalons;
    },

    getSalonById: async (salonId: string): Promise<Salon | null> => {
      await delay(600);
      return mockSalons.find(salon => salon.id === salonId) || null;
    },

    updateSalon: async (salonId: string, salonData: Partial<Salon>): Promise<Salon> => {
      await delay(500);
      const salonIndex = mockSalons.findIndex(salon => salon.id === salonId);
      if (salonIndex !== -1) {
        mockSalons[salonIndex] = { ...mockSalons[salonIndex], ...salonData, updatedAt: new Date().toISOString() };
        return mockSalons[salonIndex];
      }
      throw new Error('Salon not found');
    },

    deleteSalon: async (salonId: string): Promise<void> => {
      await delay(500);
      const salonIndex = mockSalons.findIndex(salon => salon.id === salonId);
      if (salonIndex !== -1) {
        mockSalons.splice(salonIndex, 1);
      }
    },

    getSalonRequests: async (): Promise<SalonRequest[]> => {
      await delay(600);
      return mockSalonRequests;
    },

    approveSalonRequest: async (requestId: string): Promise<void> => {
      await delay(500);
      const requestIndex = mockSalonRequests.findIndex(req => req.id === requestId);
      if (requestIndex !== -1) {
        mockSalonRequests[requestIndex].status = 'approved';
      }
    },

    rejectSalonRequest: async (requestId: string): Promise<void> => {
      await delay(500);
      const requestIndex = mockSalonRequests.findIndex(req => req.id === requestId);
      if (requestIndex !== -1) {
        mockSalonRequests[requestIndex].status = 'rejected';
      }
    }
  },

  profiles: {
    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      await delay(500);
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData, updatedAt: new Date().toISOString() };
        return mockUsers[userIndex];
      }
      throw new Error('User not found');
    },

    getProfile: async (userId: string): Promise<User | null> => {
      await delay(400);
      return mockUsers.find(user => user.id === userId) || null;
    }
  }
};

export default mockApi;
