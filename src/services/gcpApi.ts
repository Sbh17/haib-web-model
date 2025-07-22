// Google Cloud API Service for Beauty Salon Booking Platform

import { config } from '@/config/environment';
import type { 
  User, Salon, Service, Appointment, Review, 
  Promotion, NewsItem, SalonRequest 
} from '@/types';

// GCP API Configuration
const GCP_CONFIG = {
  projectId: config.integrations.gcp?.projectId || '',
  region: config.integrations.gcp?.region || 'us-central1',
  apiEndpoint: config.integrations.gcp?.apiEndpoint || '',
  databaseUrl: config.integrations.gcp?.databaseUrl || ''
};

// API Client for Google Cloud
class GCPApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = GCP_CONFIG.apiEndpoint;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAccessToken()}`
    };
  }

  private getAccessToken(): string {
    // Get Google Cloud access token from localStorage or auth context
    return localStorage.getItem('gcp_access_token') || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication APIs
  auth = {
    login: async (email: string, password: string) => {
      return this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (userData: Partial<User>) => {
      return this.request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    logout: async () => {
      return this.request('/auth/logout', { method: 'POST' });
    },

    getCurrentUser: async () => {
      return this.request<User>('/auth/me');
    },
  };

  // Salon APIs
  salons = {
    getAll: async () => {
      const response = await this.request<{ salons: Salon[]; total: number; page: number }>('/salons');
      // Return just salons array for compatibility with mock API
      return response.salons || [];
    },

    getById: async (id: string) => {
      return this.request<Salon>(`/salons/${id}`);
    },

    create: async (salonData: Omit<Salon, 'id'>) => {
      return this.request<Salon>('/salons', {
        method: 'POST',
        body: JSON.stringify(salonData),
      });
    },

    update: async (id: string, salonData: Partial<Salon>) => {
      return this.request<Salon>(`/salons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(salonData),
      });
    },

    delete: async (id: string) => {
      return this.request(`/salons/${id}`, { method: 'DELETE' });
    },

    getNearby: async (lat: number, lng: number, radius: number = 10) => {
      return this.request<Salon[]>(`/salons/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    },

    search: async (query: string) => {
      return this.request<Salon[]>(`/salons/search?q=${encodeURIComponent(query)}`);
    },

    getWorkers: async (salonId: string) => {
      return this.request<any[]>(`/salons/${salonId}/workers`);
    },

    requestNewSalon: async (salonData: any) => {
      return this.request<any>('/salon-requests', {
        method: 'POST',
        body: JSON.stringify(salonData),
      });
    },
  };

  // Service APIs
  services = {
    getAll: async (salonId?: string) => {
      const endpoint = salonId ? `/salons/${salonId}/services` : '/services';
      return this.request<Service[]>(endpoint);
    },

    getById: async (id: string) => {
      return this.request<Service>(`/services/${id}`);
    },

    create: async (serviceData: Omit<Service, 'id'>) => {
      return this.request<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });
    },

    update: async (id: string, serviceData: Partial<Service>) => {
      return this.request<Service>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serviceData),
      });
    },

    delete: async (id: string) => {
      return this.request(`/services/${id}`, { method: 'DELETE' });
    },

    getForSalon: async (salonId: string) => {
      return this.request<Service[]>(`/salons/${salonId}/services`);
    },

    getServiceCategories: async () => {
      return this.request<any[]>('/service-categories');
    },
  };

  // Appointment APIs
  appointments = {
    getAll: async (params?: { userId?: string; salonId?: string; status?: string }) => {
      const queryString = params ? new URLSearchParams(params as any).toString() : '';
      return this.request<Appointment[]>(`/appointments?${queryString}`);
    },

    getMyAppointments: async (userId: string) => {
      return this.request<Appointment[]>(`/appointments?userId=${userId}`);
    },

    getById: async (id: string) => {
      return this.request<Appointment>(`/appointments/${id}`);
    },

    create: async (appointmentData: Omit<Appointment, 'id'>) => {
      return this.request<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>) => {
      return this.request<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
    },

    update: async (id: string, appointmentData: Partial<Appointment>) => {
      return this.request<Appointment>(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      });
    },

    cancel: async (id: string, reason?: string) => {
      return this.request<Appointment>(`/appointments/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },

    cancelAppointment: async (appointmentId: string) => {
      return this.request<Appointment>(`/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    },

    getAvailableSlots: async (salonId: string, serviceId: string, date: string) => {
      return this.request<string[]>(`/appointments/available-slots?salonId=${salonId}&serviceId=${serviceId}&date=${date}`);
    },
  };

  // Review APIs
  reviews = {
    getAll: async (salonId?: string) => {
      const endpoint = salonId ? `/salons/${salonId}/reviews` : '/reviews';
      return this.request<Review[]>(endpoint);
    },

    getForSalon: async (salonId: string) => {
      return this.request<Review[]>(`/salons/${salonId}/reviews`);
    },

    create: async (reviewData: Omit<Review, 'id'>) => {
      return this.request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },

    update: async (id: string, reviewData: Partial<Review>) => {
      return this.request<Review>(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
      });
    },

    delete: async (id: string) => {
      return this.request(`/reviews/${id}`, { method: 'DELETE' });
    },
  };

  // Promotion APIs
  promotions = {
    getAll: async (salonId?: string) => {
      const endpoint = salonId ? `/salons/${salonId}/promotions` : '/promotions';
      return this.request<Promotion[]>(endpoint);
    },

    getForSalon: async (salonId: string) => {
      return this.request<Promotion[]>(`/salons/${salonId}/promotions`);
    },

    getActive: async () => {
      return this.request<Promotion[]>('/promotions/active');
    },

    create: async (promotionData: Omit<Promotion, 'id'>) => {
      return this.request<Promotion>('/promotions', {
        method: 'POST',
        body: JSON.stringify(promotionData),
      });
    },
  };

  // News APIs
  news = {
    getAll: async (params?: { page?: number; limit?: number; category?: string }) => {
      const queryString = params ? new URLSearchParams(params as any).toString() : '';
      const response = await this.request<{ news: NewsItem[]; total: number }>(`/news?${queryString}`);
      // Return just news array for compatibility
      return response.news || [];
    },

    getById: async (id: string) => {
      return this.request<NewsItem>(`/news/${id}`);
    },
  };

  // Admin APIs
  admin = {
    getDashboardStats: async () => {
      return this.request<{
        totalSalons: number;
        totalUsers: number;
        totalAppointments: number;
        totalRevenue: number;
        recentAppointments: Appointment[];
        topSalons: Salon[];
      }>('/admin/dashboard');
    },

    getAllUsers: async () => {
      return this.request<User[]>('/admin/users');
    },

    deleteUser: async (userId: string) => {
      return this.request(`/admin/users/${userId}`, { method: 'DELETE' });
    },

    resetUserPassword: async (userId: string) => {
      return this.request(`/admin/users/${userId}/reset-password`, { method: 'POST' });
    },

    getAllSalons: async () => {
      return this.request<Salon[]>('/admin/salons');
    },

    getSalonRequests: async () => {
      return this.request<SalonRequest[]>('/admin/salon-requests');
    },

    getSalonById: async (salonId: string) => {
      return this.request<Salon>(`/admin/salons/${salonId}`);
    },

    updateSalon: async (salonId: string, salonData: Partial<Salon>) => {
      return this.request<Salon>(`/admin/salons/${salonId}`, {
        method: 'PUT',
        body: JSON.stringify(salonData),
      });
    },

    deleteSalon: async (salonId: string) => {
      return this.request(`/admin/salons/${salonId}`, { method: 'DELETE' });
    },

    approveSalonRequest: async (requestId: string) => {
      return this.request<SalonRequest>(`/admin/salon-requests/${requestId}/approve`, {
        method: 'POST',
      });
    },

    rejectSalonRequest: async (requestId: string, reason: string) => {
      return this.request<SalonRequest>(`/admin/salon-requests/${requestId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
  };

  // Profile APIs
  profiles = {
    update: async (userId: string, profileData: Partial<User>) => {
      return this.request<User>(`/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },

    getById: async (userId: string) => {
      return this.request<User>(`/profiles/${userId}`);
    },
  };
}

export default new GCPApiClient();