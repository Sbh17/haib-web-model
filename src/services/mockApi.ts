
import { User, Salon, Service, Appointment, Review, NewsItem, Promotion } from '@/types';

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
    services: ['1', '2'],
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
    category: 'Hair',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    salonId: '1',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    isActive: true
  }
];

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
    }
  }
};

export default mockApi;
