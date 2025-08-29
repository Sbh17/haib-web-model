// Supabase Cloud Provider Implementation
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseProvider implements ICloudProvider {
  name = 'supabase';
  version = '2.0.0';
  
  private client: SupabaseClient | null = null;
  private isInitialized = false;

  async initialize(config: Record<string, any>): Promise<void> {
    const { url, key } = config;
    if (!url || !key) {
      throw new Error('Supabase URL and key are required');
    }

    this.client = createClient(url, key);
    this.isInitialized = true;
    console.log('Supabase provider initialized');
  }

  isConnected(): boolean {
    return this.isInitialized && this.client !== null;
  }

  getConnectionStatus(): { connected: boolean; message?: string } {
    return {
      connected: this.isConnected(),
      message: this.isConnected() ? 'Connected to Supabase' : 'Not connected to Supabase'
    };
  }

  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }
    return this.client;
  }

  // Helper function for demo users
  private getDemoUserName(email: string): string {
    const demoUsers: Record<string, string> = {
      'demo@customer.com': 'Demo Customer',
      'demo@owner.com': 'Demo Owner',
      'demo@admin.com': 'Demo Admin',
    };
    return demoUsers[email] || email.split('@')[0];
  }

  private getDemoUserRole(email: string): UserRole {
    const demoRoles: Record<string, UserRole> = {
      'demo@customer.com': 'customer',
      'demo@owner.com': 'owner',
      'demo@admin.com': 'admin',
    };
    return demoRoles[email] || 'customer';
  }

  // Auth Provider Implementation
  auth: IAuthProvider = {
    login: async (email: string, password: string): Promise<User> => {
      const client = this.getClient();
      
      // First try to sign in
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If login fails, try to create demo user
        const { data: signUpData, error: signUpError } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: this.getDemoUserName(email),
              role: this.getDemoUserRole(email),
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('Failed to create user');

        // Create profile
        await client.from('profiles').insert([{
          id: signUpData.user.id,
          email,
          name: this.getDemoUserName(email),
          role: this.getDemoUserRole(email),
          avatar: '',
        }]);

        return {
          id: signUpData.user.id,
          email: signUpData.user.email || email,
          name: this.getDemoUserName(email),
          role: this.getDemoUserRole(email),
          avatar: '',
          createdAt: signUpData.user.created_at,
          updatedAt: signUpData.user.updated_at,
        };
      }

      if (!data.user) throw new Error('Login successful but no user data');

      // Fetch profile
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        email: data.user.email || email,
        name: profile?.name || this.getDemoUserName(email),
        role: (profile?.role as UserRole) || this.getDemoUserRole(email),
        avatar: profile?.avatar || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      };
    },

    register: async (userData: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      const client = this.getClient();
      
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: 'customer' as UserRole,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');

      // Create profile
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .insert([{
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: 'customer' as UserRole,
          avatar: '',
        }])
        .select('*')
        .single();

      return {
        id: data.user.id,
        email: data.user.email || userData.email,
        name: profile?.name || userData.name,
        role: (profile?.role as UserRole) || 'customer',
        avatar: profile?.avatar || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      };
    },

    logout: async (): Promise<void> => {
      const client = this.getClient();
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },

    getCurrentUser: async (): Promise<User | null> => {
      const client = this.getClient();
      
      const { data: { user }, error } = await client.auth.getUser();
      if (error || !user) return null;

      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.email?.split('@')[0] || 'User',
        role: (profile?.role as UserRole) || 'customer',
        avatar: profile?.avatar || '',
        createdAt: user.created_at,
        updatedAt: profile?.updated_at || user.updated_at,
      };
    },

    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          avatar: profileData.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        avatar: data.avatar,
        phone: data.phone,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },

    getProfile: async (userId: string): Promise<User | null> => {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        avatar: data.avatar,
        phone: data.phone,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
  };

  // Database Provider Implementation
  database: IDatabaseProvider = {
    create: async <T>(table: string, data: Partial<T>): Promise<T> => {
      const client = this.getClient();
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select('*')
        .single();

      if (error) throw error;
      return result;
    },

    read: async <T>(table: string, id: string): Promise<T | null> => {
      const client = this.getClient();
      const { data, error } = await client
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data;
    },

    update: async <T>(table: string, id: string, data: Partial<T>): Promise<T> => {
      const client = this.getClient();
      const { data: result, error } = await client
        .from(table)
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return result;
    },

    delete: async (table: string, id: string): Promise<void> => {
      const client = this.getClient();
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    list: async <T>(table: string, filters?: Record<string, any>, options?: { limit?: number; offset?: number; orderBy?: string }): Promise<T[]> => {
      const client = this.getClient();
      let query = client.from(table).select('*');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    },

    search: async <T>(table: string, searchTerm: string, fields: string[]): Promise<T[]> => {
      const client = this.getClient();
      
      // Build search query - search in first field, we can enhance this later
      const { data, error } = await client
        .from(table)
        .select('*')
        .ilike(fields[0], `%${searchTerm}%`);

      if (error) throw error;
      return data || [];
    },

    subscribe: <T>(table: string, callback: (data: T[]) => void, filters?: Record<string, any>): (() => void) => {
      const client = this.getClient();
      
      const subscription = client
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          () => {
            // Refetch data when changes occur
            this.database.list<T>(table, filters).then(callback);
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(subscription);
      };
    },
  };

  // Storage Provider Implementation
  storage: IStorageProvider = {
    uploadFile: async (bucket: string, path: string, file: File): Promise<string> => {
      const client = this.getClient();
      
      const { data, error } = await client.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return data.path;
    },

    downloadFile: async (bucket: string, path: string): Promise<Blob> => {
      const client = this.getClient();
      
      const { data, error } = await client.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return data;
    },

    deleteFile: async (bucket: string, path: string): Promise<void> => {
      const client = this.getClient();
      
      const { error } = await client.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    },

    getPublicUrl: (bucket: string, path: string): string => {
      const client = this.getClient();
      
      const { data } = client.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    },

    createBucket: async (name: string, isPublic: boolean = false): Promise<void> => {
      const client = this.getClient();
      
      const { error } = await client.storage
        .createBucket(name, { public: isPublic });

      if (error) throw error;
    },
  };

  // Business logic implementations using the database layer
  salons: ISalonProvider = {
    getAll: async (): Promise<Salon[]> => {
      // Implementation using this.database.list
      return this.database.list<Salon>('salons', undefined, { orderBy: 'created_at' });
    },

    getById: async (id: string): Promise<Salon | null> => {
      return this.database.read<Salon>('salons', id);
    },

    getNearby: async (lat: number, lng: number, radius: number = 10): Promise<Salon[]> => {
      // Mock implementation - would need PostGIS for real geospatial queries
      return this.database.list<Salon>('salons');
    },

    search: async (query: string): Promise<Salon[]> => {
      return this.database.search<Salon>('salons', query, ['name', 'description']);
    },

    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      return this.database.list<SalonWorker>('salon_workers', { salon_id: salonId });
    },

    requestNewSalon: async (salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest> => {
      const requestData = {
        ...salonData,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      return this.database.create<SalonRequest>('salon_requests', requestData);
    },
  };

  services: IServiceProvider = {
    getAll: async (): Promise<Service[]> => {
      return this.database.list<Service>('services', undefined, { orderBy: 'created_at' });
    },

    getForSalon: async (salonId: string): Promise<Service[]> => {
      return this.database.list<Service>('services', { salon_id: salonId });
    },

    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      return this.database.list<ServiceCategory>('service_categories');
    },
  };

  appointments: IAppointmentProvider = {
    getAll: async (): Promise<Appointment[]> => {
      return this.database.list<Appointment>('appointments', undefined, { orderBy: 'created_at' });
    },

    getMyAppointments: async (userId: string): Promise<Appointment[]> => {
      return this.database.list<Appointment>('appointments', { user_id: userId });
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
      return this.database.create<Appointment>('appointments', appointmentData);
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
      await this.database.update('appointments', appointmentId, { status: 'cancelled' });
    },
  };

  reviews: IReviewProvider = {
    getAll: async (): Promise<Review[]> => {
      return this.database.list<Review>('reviews', undefined, { orderBy: 'created_at' });
    },

    getForSalon: async (salonId: string): Promise<Review[]> => {
      return this.database.list<Review>('reviews', { salon_id: salonId });
    },

    create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
      const data = { ...reviewData, created_at: new Date().toISOString() };
      return this.database.create<Review>('reviews', data);
    },
  };

  news: INewsProvider = {
    getAll: async (): Promise<NewsItem[]> => {
      return this.database.list<NewsItem>('news', undefined, { orderBy: 'created_at' });
    },

    getById: async (id: string): Promise<NewsItem | null> => {
      return this.database.read<NewsItem>('news', id);
    },

    getLatest: async (limit: number = 5): Promise<NewsItem[]> => {
      return this.database.list<NewsItem>('news', undefined, { orderBy: 'created_at', limit });
    },
  };

  promotions: IPromotionProvider = {
    getAll: async (): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions', undefined, { orderBy: 'created_at' });
    },

    getActive: async (): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions', { is_active: true });
    },

    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      return this.database.list<Promotion>('promotions', { salon_id: salonId });
    },
  };

  admin: IAdminProvider = {
    getAllUsers: async (): Promise<User[]> => {
      return this.database.list<User>('profiles');
    },

    deleteUser: async (userId: string): Promise<void> => {
      await this.database.delete('profiles', userId);
    },

    resetUserPassword: async (userId: string): Promise<void> => {
      // Would need to implement password reset logic
      console.log(`Password reset for user ${userId}`);
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
    const tables = ['profiles', 'salons', 'services', 'appointments', 'reviews', 'news', 'promotions'];
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
