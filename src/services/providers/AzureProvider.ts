// Azure Cloud Provider Implementation
import { 
  ICloudProvider, 
  IAuthProvider, 
  IDatabaseProvider, 
  IStorageProvider,
  ISalonProvider,
  IServiceProvider,
  IAppointmentProvider,
  IReviewProvider,
  INewsProvider,
  IPromotionProvider,
  IAdminProvider
} from '@/interfaces/ICloudProvider';
import { User, Salon, Service, Appointment, Review, NewsItem, Promotion, SalonWorker, SalonRequest, ServiceCategory, UserRole } from '@/types';

export class AzureProvider implements ICloudProvider {
  name = 'azure';
  version = '1.0.0';
  
  private config: Record<string, any> = {};
  private isInitialized = false;
  private baseUrl = '';

  async initialize(config: Record<string, any>): Promise<void> {
    this.config = config;
    this.baseUrl = config.endpoint || 'https://your-azure-function-app.azurewebsites.net/api';
    this.isInitialized = true;
    console.log('Azure provider initialized');
  }

  isConnected(): boolean {
    return this.isInitialized && this.baseUrl !== '';
  }

  getConnectionStatus(): { connected: boolean; message?: string } {
    return {
      connected: this.isConnected(),
      message: this.isConnected() ? 'Connected to Azure' : 'Not connected to Azure'
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': this.config.functionKey || '',
        'Authorization': `Bearer ${this.config.accessToken || ''}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Azure API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth Provider Implementation
  auth: IAuthProvider = {
    login: async (email: string, password: string): Promise<User> => {
      const response = await this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token for future requests
      this.config.accessToken = response.token;
      return response.user;
    },

    register: async (userData: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      const response = await this.request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      this.config.accessToken = response.token;
      return response.user;
    },

    logout: async (): Promise<void> => {
      await this.request('/auth/logout', { method: 'POST' });
      this.config.accessToken = '';
    },

    getCurrentUser: async (): Promise<User | null> => {
      try {
        return await this.request<User>('/auth/me');
      } catch (error) {
        console.warn('Failed to get current user:', error);
        return null;
      }
    },

    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      return this.request<User>(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
    },

    getProfile: async (userId: string): Promise<User | null> => {
      try {
        return await this.request<User>(`/users/${userId}`);
      } catch (error) {
        console.warn('Failed to get user profile:', error);
        return null;
      }
    },
  };

  // Database Provider Implementation
  database: IDatabaseProvider = {
    create: async <T>(table: string, data: Partial<T>): Promise<T> => {
      return this.request<T>(`/tables/${table}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    read: async <T>(table: string, id: string): Promise<T | null> => {
      try {
        return await this.request<T>(`/tables/${table}/${id}`);
      } catch (error) {
        console.warn(`Failed to read ${table}/${id}:`, error);
        return null;
      }
    },

    update: async <T>(table: string, id: string, data: Partial<T>): Promise<T> => {
      return this.request<T>(`/tables/${table}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (table: string, id: string): Promise<void> => {
      await this.request(`/tables/${table}/${id}`, { method: 'DELETE' });
    },

    list: async <T>(
      table: string, 
      filters?: Record<string, any>, 
      options?: { limit?: number; offset?: number; orderBy?: string }
    ): Promise<T[]> => {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queryParams.append(`filter[${key}]`, value);
        });
      }
      
      if (options?.limit) queryParams.append('limit', options.limit.toString());
      if (options?.offset) queryParams.append('offset', options.offset.toString());
      if (options?.orderBy) queryParams.append('orderBy', options.orderBy);

      const queryString = queryParams.toString();
      const endpoint = `/tables/${table}${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.request<{ data: T[] }>(endpoint);
      return response.data;
    },

    search: async <T>(table: string, searchTerm: string, fields: string[]): Promise<T[]> => {
      const response = await this.request<{ data: T[] }>(`/tables/${table}/search`, {
        method: 'POST',
        body: JSON.stringify({ query: searchTerm, fields }),
      });
      return response.data;
    },

    subscribe: <T>(table: string, callback: (data: T[]) => void, filters?: Record<string, any>): (() => void) => {
      // Azure SignalR implementation would go here
      console.warn('Real-time subscriptions not implemented for Azure provider');
      
      // Return a no-op unsubscribe function
      return () => {};
    },
  };

  // Storage Provider Implementation
  storage: IStorageProvider = {
    uploadFile: async (bucket: string, path: string, file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('container', bucket);
      formData.append('path', path);

      const response = await fetch(`${this.baseUrl}/storage/upload`, {
        method: 'POST',
        headers: {
          'x-functions-key': this.config.functionKey || '',
          'Authorization': `Bearer ${this.config.accessToken || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.path;
    },

    downloadFile: async (bucket: string, path: string): Promise<Blob> => {
      const response = await fetch(`${this.baseUrl}/storage/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key': this.config.functionKey || '',
          'Authorization': `Bearer ${this.config.accessToken || ''}`,
        },
        body: JSON.stringify({ container: bucket, path }),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      return response.blob();
    },

    deleteFile: async (bucket: string, path: string): Promise<void> => {
      await this.request('/storage/delete', {
        method: 'DELETE',
        body: JSON.stringify({ container: bucket, path }),
      });
    },

    getPublicUrl: (bucket: string, path: string): string => {
      return `${this.config.storageAccount || 'https://yourstorage.blob.core.windows.net'}/${bucket}/${path}`;
    },

    createBucket: async (name: string, isPublic: boolean = false): Promise<void> => {
      await this.request('/storage/create-container', {
        method: 'POST',
        body: JSON.stringify({ name, public: isPublic }),
      });
    },
  };

  // Business logic implementations using the database layer
  salons: ISalonProvider = {
    getAll: async (): Promise<Salon[]> => {
      return this.database.list<Salon>('salons', undefined, { orderBy: 'createdAt' });
    },

    getById: async (id: string): Promise<Salon | null> => {
      return this.database.read<Salon>('salons', id);
    },

    getNearby: async (lat: number, lng: number, radius: number = 10): Promise<Salon[]> => {
      return this.request<Salon[]>(`/salons/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    },

    search: async (query: string): Promise<Salon[]> => {
      return this.database.search<Salon>('salons', query, ['name', 'description']);
    },

    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      return this.database.list<SalonWorker>('salon_workers', { salonId });
    },

    requestNewSalon: async (salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest> => {
      const requestData = {
        ...salonData,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      return this.database.create<SalonRequest>('salon_requests', requestData);
    },
  };

  services: IServiceProvider = {
    getAll: async (): Promise<Service[]> => {
      return this.database.list<Service>('services');
    },

    getForSalon: async (salonId: string): Promise<Service[]> => {
      return this.database.list<Service>('services', { salonId });
    },

    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      return this.database.list<ServiceCategory>('service_categories');
    },
  };

  appointments: IAppointmentProvider = {
    getAll: async (): Promise<Appointment[]> => {
      return this.database.list<Appointment>('appointments');
    },

    getMyAppointments: async (userId: string): Promise<Appointment[]> => {
      return this.database.list<Appointment>('appointments', { userId });
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
      return this.database.create<Appointment>('appointments', appointmentData);
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
      await this.database.update('appointments', appointmentId, { status: 'cancelled' });
    },

    getAvailableSlots: async (salonId: string, serviceId: string, date: string): Promise<string[]> => {
      return this.request<string[]>(`/appointments/available-slots?salonId=${salonId}&serviceId=${serviceId}&date=${date}`);
    },
  };

  reviews: IReviewProvider = {
    getAll: async (): Promise<Review[]> => {
      return this.database.list<Review>('reviews');
    },

    getForSalon: async (salonId: string): Promise<Review[]> => {
      return this.database.list<Review>('reviews', { salonId });
    },

    create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
      const data = { ...reviewData, createdAt: new Date().toISOString() };
      return this.database.create<Review>('reviews', data);
    },
  };

  news: INewsProvider = {
    getAll: async (): Promise<NewsItem[]> => {
      return this.database.list<NewsItem>('news');
    },

    getById: async (id: string): Promise<NewsItem | null> => {
      return this.database.read<NewsItem>('news', id);
    },

    getLatest: async (limit: number = 5): Promise<NewsItem[]> => {
      return this.database.list<NewsItem>('news', undefined, { limit, orderBy: 'createdAt' });
    },
  };

  promotions: IPromotionProvider = {
    getAll: async (): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions');
    },

    getActive: async (): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions', { isActive: true });
    },

    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions', { salonId });
    },
  };

  admin: IAdminProvider = {
    getAllUsers: async (): Promise<User[]> => {
      return this.database.list<User>('users');
    },

    deleteUser: async (userId: string): Promise<void> => {
      await this.database.delete('users', userId);
    },

    resetUserPassword: async (userId: string): Promise<void> => {
      await this.request(`/admin/users/${userId}/reset-password`, { method: 'POST' });
    },

    getAllSalons: async (): Promise<Salon[]> => {
      return this.database.list<Salon>('salons');
    },

    getSalonById: async (salonId: string): Promise<Salon | null> => {
      return this.database.read<Salon>('salons', salonId);
    },

    updateSalon: async (salonId: string, salonData: Partial<Salon>): Promise<Salon> => {
      return this.database.update<Salon>('salons', salonId, salonData);
    },

    deleteSalon: async (salonId: string): Promise<void> => {
      await this.database.delete('salons', salonId);
    },

    getSalonRequests: async (): Promise<SalonRequest[]> => {
      return this.database.list<SalonRequest>('salon_requests');
    },

    approveSalonRequest: async (requestId: string): Promise<void> => {
      await this.database.update('salon_requests', requestId, { status: 'approved' });
    },

    rejectSalonRequest: async (requestId: string): Promise<void> => {
      await this.database.update('salon_requests', requestId, { status: 'rejected' });
    },
  };

  profiles = {
    updateProfile: this.auth.updateProfile,
    getProfile: this.auth.getProfile,
  };

  // Migration helpers
  async exportData(): Promise<Record<string, any>> {
    const tables = ['users', 'salons', 'services', 'appointments', 'reviews', 'news', 'promotions'];
    const exportedData: Record<string, any> = {};

    for (const table of tables) {
      try {
        exportedData[table] = await this.database.list(table);
      } catch (error) {
        console.warn(`Failed to export ${table}:`, error);
        exportedData[table] = [];
      }
    }

    return exportedData;
  }

  async importData(data: Record<string, any>): Promise<void> {
    for (const [table, records] of Object.entries(data)) {
      if (Array.isArray(records)) {
        for (const record of records) {
          try {
            await this.database.create(table, record);
          } catch (error) {
            console.warn(`Failed to import record to ${table}:`, error);
          }
        }
      }
    }
  }
}