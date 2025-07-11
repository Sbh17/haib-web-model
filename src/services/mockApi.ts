import { User, Salon, Service, Appointment, Review, NewsItem, Promotion, SalonWorker, SalonRequest, ServiceCategory } from '@/types';
import { 
  users, 
  salons, 
  services, 
  serviceCategories, 
  appointments, 
  reviews, 
  newsItems, 
  promotions, 
  salonRequests 
} from './mockData';

// Use the rich mock data from mockData.ts
const mockUsers: User[] = users.map(user => ({
  ...user,
  // Ensure compatibility with User type
  createdAt: user.createdAt,
  updatedAt: user.createdAt
}));

const mockSalons: Salon[] = salons.map(salon => ({
  ...salon,
  // Convert to expected format
  state: 'NY', // Default state since not in original data
  zipCode: '10001', // Default zip since not in original data
  phone: '+1234567890', // Default phone since not in original data
  email: `info@${salon.name.toLowerCase().replace(/\s+/g, '')}.com`,
  website: `https://${salon.name.toLowerCase().replace(/\s+/g, '')}.com`,
  images: [salon.coverImage],
  priceRange: '$$$',
  latitude: salon.location.latitude,
  longitude: salon.location.longitude,
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
  updatedAt: salon.createdAt
}));

const mockServices: Service[] = services.map(service => ({
  ...service,
  category: serviceCategories.find(cat => cat.id === service.categoryId)?.name || 'Hair',
  updatedAt: service.createdAt
}));

const mockServiceCategories: ServiceCategory[] = serviceCategories;

const mockAppointments: Appointment[] = appointments.map(appointment => ({
  ...appointment,
  workerId: '1' // Default worker ID since not in original data
}));

const mockReviews: Review[] = reviews;

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
  },
  {
    id: '2',
    salonId: '2',
    name: 'Mike Rodriguez',
    specialty: 'Men\'s Grooming',
    bio: 'Professional barber specializing in modern cuts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    phone: '+1234567892',
    email: 'mike@urbancuts.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    salonId: '3',
    name: 'Lisa Chen',
    specialty: 'Massage Therapy',
    bio: 'Licensed massage therapist with spa expertise',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    phone: '+1234567893',
    email: 'lisa@serenespa.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    salonId: '4',
    name: 'Amanda Foster',
    specialty: 'Hair Coloring',
    bio: 'Color specialist with expertise in balayage and highlights',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda',
    phone: '+1234567894',
    email: 'amanda@glamourhair.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    salonId: '5',
    name: 'Jessica Wong',
    specialty: 'Nail Art',
    bio: 'Creative nail artist specializing in custom designs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
    phone: '+1234567895',
    email: 'jessica@blissnailspa.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    salonId: '6',
    name: 'David Thompson',
    specialty: 'Traditional Shaving',
    bio: 'Master barber with expertise in classic grooming techniques',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    phone: '+1234567896',
    email: 'david@groominglounge.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSalonRequests: SalonRequest[] = salonRequests;

const mockNews: NewsItem[] = newsItems;

const mockPromotions: Promotion[] = promotions.map(promo => ({
  ...promo,
  isActive: new Date(promo.endDate) > new Date()
}));

// Set up salon services - assign services to their respective salons
mockSalons.forEach(salon => {
  salon.services = mockServices.filter(service => service.salonId === salon.id);
});

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
