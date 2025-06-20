import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/environment';
import { User, Salon, Service, Appointment, Review, NewsItem, Promotion, SalonWorker, SalonRequest, ServiceCategory, UserRole } from '@/types';

// Initialize Supabase client
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

const supabase = createClient(supabaseUrl, supabaseKey);

const firebaseApi = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      try {
        console.log('Attempting login for:', email);
        
        // First try to sign in with existing credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          console.log('Login failed, attempting to create demo user:', error.message);
          
          // If login fails, try to create the demo user account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                name: getDemoUserName(email),
                role: getDemoUserRole(email),
              }
            }
          });

          if (signUpError) {
            console.error('Sign up also failed:', signUpError);
            throw signUpError;
          }

          if (!signUpData.user) {
            throw new Error('Failed to create user account');
          }

          // Create profile for the new user
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: signUpData.user.id,
                email: email,
                name: getDemoUserName(email),
                role: getDemoUserRole(email),
                avatar: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select('*')
            .single();

          if (profileError) {
            console.error('Failed to create profile:', profileError);
            // Don't throw here, we can still return the user
          }

          const user: User = {
            id: signUpData.user.id,
            email: signUpData.user.email || email,
            name: getDemoUserName(email),
            role: getDemoUserRole(email),
            avatar: '',
            createdAt: signUpData.user.created_at,
            updatedAt: signUpData.user.updated_at,
          };

          console.log('Successfully created demo user:', user);
          return user;
        }

        if (!data.user) {
          throw new Error('Login successful but no user data returned');
        }

        // Fetch user details from the public profiles table
        let userDetails = null;
        const { data: profileData, error: userDetailsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userDetailsError || !profileData) {
          console.log('Profile not found, creating one for existing user');
          
          // Create profile for existing user
          const { data: newProfileData, error: createProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email || email,
                name: getDemoUserName(email),
                role: getDemoUserRole(email),
                avatar: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select('*')
            .single();

          if (createProfileError) {
            console.error('Failed to create profile for existing user:', createProfileError);
            userDetails = {
              name: getDemoUserName(email),
              role: getDemoUserRole(email),
              avatar: '',
            };
          } else {
            userDetails = newProfileData;
          }
        } else {
          userDetails = profileData;
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: userDetails?.name || getDemoUserName(email),
          role: userDetails?.role || getDemoUserRole(email),
          avatar: userDetails?.avatar || '',
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };

        console.log('Login successful:', user);
        return user;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: data.name,
              phone: data.phone,
              role: 'customer' as UserRole,
            },
          },
        });

        if (authError) {
          throw authError;
        }

        if (!authData.user) {
          throw new Error('Registration failed - no user data returned');
        }

        // Insert user details into the public profiles table
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              name: data.name,
              phone: data.phone,
              role: 'customer' as UserRole,
              avatar: '',
              created_at: authData.user.created_at,
              updated_at: authData.user.updated_at,
            },
          ])
          .select('*')
          .single();

        if (userDetailsError) {
          console.error('Failed to create user profile:', userDetailsError);
          // Don't throw, we can still return the user
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email || data.email,
          name: userDetails?.name || data.name,
          role: (userDetails?.role as UserRole) || 'customer',
          avatar: userDetails?.avatar || '',
          createdAt: authData.user.created_at,
          updatedAt: authData.user.updated_at,
        };

        return user;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    logout: async (): Promise<void> => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    },

    getCurrentUser: async (): Promise<User | null> => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (!user) {
          return null;
        }

        // Fetch user details from the public profiles table
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userDetailsError || !userDetails) {
          console.log('Profile not found for current user, creating one');
          
          // Create profile for current user if it doesn't exist
          const { data: newProfileData, error: createProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email || '',
                name: user.email?.split('@')[0] || 'User',
                role: 'customer' as UserRole,
                avatar: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select('*')
            .single();

          if (createProfileError) {
            console.error('Failed to create profile for current user:', createProfileError);
            return {
              id: user.id,
              email: user.email || '',
              name: user.email?.split('@')[0] || 'User',
              role: 'customer',
              avatar: '',
              createdAt: user.created_at,
              updatedAt: user.updated_at,
            };
          }

          return {
            id: user.id,
            email: user.email || '',
            name: newProfileData.name,
            role: newProfileData.role as UserRole,
            avatar: newProfileData.avatar,
            createdAt: user.created_at,
            updatedAt: newProfileData.updated_at,
          };
        }

        const currentUser: User = {
          id: user.id,
          email: user.email || '',
          name: userDetails.name,
          role: userDetails.role as UserRole,
          avatar: userDetails.avatar,
          createdAt: user.created_at,
          updatedAt: userDetails.updated_at,
        };

        return currentUser;
      } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
      }
    },
  },

  salons: {
    getAll: async (): Promise<Salon[]> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching salons:', error);
          return [];
        }

        return data.map(salon => ({
          id: salon.id,
          name: salon.name,
          description: salon.description,
          address: salon.address,
          city: salon.city,
          coverImage: salon.cover_image,
          rating: salon.rating,
          reviewCount: salon.review_count,
          ownerId: salon.owner_id,
          services: [],
          status: salon.status,
          createdAt: salon.created_at,
          socialMedia: salon.social_media,
        }));
      } catch (error) {
        console.error('Error fetching salons:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<Salon | null> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching salon:', error);
          return null;
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          coverImage: data.cover_image,
          rating: data.rating,
          reviewCount: data.review_count,
          ownerId: data.owner_id,
          services: [],
          status: data.status,
          createdAt: data.created_at,
          socialMedia: data.social_media,
        };
      } catch (error) {
        console.error('Error fetching salon:', error);
        return null;
      }
    },

    getNearby: async (lat: number, lng: number, radius: number = 10): Promise<Salon[]> => {
      // This is a mock implementation.  You'll need to implement the actual
      // geospatial query using PostGIS or a similar extension in Supabase.
      console.log('Fetching nearby salons (mock):', lat, lng, radius);
      return firebaseApi.salons.getAll();
    },

    search: async (query: string): Promise<Salon[]> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .ilike('name', `%${query}%`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error searching salons:', error);
          return [];
        }

        return data.map(salon => ({
          id: salon.id,
          name: salon.name,
          description: salon.description,
          address: salon.address,
          city: salon.city,
          coverImage: salon.cover_image,
          rating: salon.rating,
          reviewCount: salon.review_count,
          ownerId: salon.owner_id,
          services: [],
          status: salon.status,
          createdAt: salon.created_at,
          socialMedia: salon.social_media,
        }));
      } catch (error) {
        console.error('Error searching salons:', error);
        return [];
      }
    },

    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      try {
        const { data, error } = await supabase
          .from('salon_workers')
          .select('*')
          .eq('salon_id', salonId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching salon workers:', error);
          return [];
        }

        return data.map(worker => ({
          id: worker.id,
          salonId: worker.salon_id,
          name: worker.name,
          specialty: worker.specialty,
          bio: worker.bio,
          avatar: worker.avatar,
          phone: worker.phone,
          email: worker.email,
          isActive: worker.is_active,
          createdAt: worker.created_at,
          updatedAt: worker.updated_at,
        }));
      } catch (error) {
        console.error('Error fetching salon workers:', error);
        return [];
      }
    },

    requestNewSalon: async (salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest> => {
      try {
        const { data, error } = await supabase
          .from('salon_requests')
          .insert([
            {
              name: salonData.name,
              description: salonData.description,
              address: salonData.address,
              city: salonData.city,
              owner_email: salonData.ownerEmail,
              owner_name: salonData.ownerName,
              owner_phone: salonData.ownerPhone,
              social_media: salonData.socialMedia,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Error requesting new salon:', error);
          throw error;
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          ownerEmail: data.owner_email,
          ownerName: data.owner_name,
          ownerPhone: data.owner_phone,
          status: data.status,
          createdAt: data.created_at,
          socialMedia: data.social_media,
        };
      } catch (error) {
        console.error('Error requesting new salon:', error);
        throw error;
      }
    },
  },

  services: {
    getAll: async (): Promise<Service[]> => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching services:', error);
          return [];
        }

        return data.map(service => ({
          id: service.id,
          salonId: service.salon_id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          categoryId: service.category_id,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
        }));
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    },

    getForSalon: async (salonId: string): Promise<Service[]> => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('salon_id', salonId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching salon services:', error);
          return [];
        }

        return data.map(service => ({
          id: service.id,
          salonId: service.salon_id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          categoryId: service.category_id,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
        }));
      } catch (error) {
        console.error('Error fetching salon services:', error);
        return [];
      }
    },

    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching service categories:', error);
          return [];
        }

        return data.map(category => ({
          id: category.id,
          name: category.name,
        }));
      } catch (error) {
        console.error('Error fetching service categories:', error);
        return [];
      }
    },
  },

  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching appointments:', error);
          return [];
        }

        return data.map(appointment => ({
          id: appointment.id,
          userId: appointment.user_id,
          salonId: appointment.salon_id,
          serviceId: appointment.service_id,
          date: appointment.date,
          status: appointment.status,
          notes: appointment.notes,
          createdAt: appointment.created_at,
        }));
      } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }
    },

    getMyAppointments: async (userId: string): Promise<Appointment[]> => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching user appointments:', error);
          return [];
        }

        return data.map(appointment => ({
          id: appointment.id,
          userId: appointment.user_id,
          salonId: appointment.salon_id,
          serviceId: appointment.service_id,
          date: appointment.date,
          status: appointment.status,
          notes: appointment.notes,
          createdAt: appointment.created_at,
        }));
      } catch (error) {
        console.error('Error fetching user appointments:', error);
        return [];
      }
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([
            {
              user_id: appointmentData.userId,
              salon_id: appointmentData.salonId,
              service_id: appointmentData.serviceId,
              date: appointmentData.date,
              status: appointmentData.status,
              notes: appointmentData.notes,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Error booking appointment:', error);
          throw error;
        }

        return {
          id: data.id,
          userId: data.user_id,
          salonId: data.salon_id,
          serviceId: data.service_id,
          date: data.date,
          status: data.status,
          notes: data.notes,
          createdAt: data.created_at,
        };
      } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
      }
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', appointmentId);

        if (error) {
          console.error('Error cancelling appointment:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
      }
    },
  },

  reviews: {
    getAll: async (): Promise<Review[]> => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },

    getForSalon: async (salonId: string): Promise<Review[]> => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('salon_id', salonId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching salon reviews:', error);
        return [];
      }
    },

    create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([{
            user_id: reviewData.userId,
            salon_id: reviewData.salonId,
            appointment_id: reviewData.appointmentId,
            rating: reviewData.rating,
            comment: reviewData.comment
          }])
          .select()
          .single();

        if (error) throw error;
        return {
          id: data.id,
          userId: data.user_id,
          salonId: data.salon_id,
          appointmentId: data.appointment_id,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.created_at
        };
      } catch (error) {
        console.error('Error creating review:', error);
        throw error;
      }
    }
  },

  news: {
    getAll: async (): Promise<NewsItem[]> => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching news:', error);
          return [];
        }

        return data.map(newsItem => ({
          id: newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          image: newsItem.image,
          date: newsItem.date,
          category: newsItem.category,
        }));
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<NewsItem | null> => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching news item:', error);
          return null;
        }

        return {
          id: data.id,
          title: data.title,
          content: data.content,
          image: data.image,
          date: data.date,
          category: data.category,
        };
      } catch (error) {
        console.error('Error fetching news item:', error);
        return null;
      }
    },

    getLatest: async (limit: number = 5): Promise<NewsItem[]> => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .order('date', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching latest news:', error);
          return [];
        }

        return data.map(newsItem => ({
          id: newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          image: newsItem.image,
          date: newsItem.date,
          category: newsItem.category,
        }));
      } catch (error) {
        console.error('Error fetching latest news:', error);
        return [];
      }
    },
  },

  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('end_date', { ascending: false });

        if (error) {
          console.error('Error fetching promotions:', error);
          return [];
        }

        return data.map(promotion => ({
          id: promotion.id,
          salonId: promotion.salon_id,
          title: promotion.title,
          description: promotion.description,
          image: promotion.image,
          startDate: promotion.start_date,
          endDate: promotion.end_date,
          discount: promotion.discount,
          isActive: promotion.is_active,
          createdAt: promotion.created_at,
        }));
      } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
      }
    },

    getActive: async (): Promise<Promotion[]> => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .order('end_date', { ascending: false });

        if (error) {
          console.error('Error fetching active promotions:', error);
          return [];
        }

        return data.map(promotion => ({
          id: promotion.id,
          salonId: promotion.salon_id,
          title: promotion.title,
          description: promotion.description,
          image: promotion.image,
          startDate: promotion.start_date,
          endDate: promotion.end_date,
          discount: promotion.discount,
          isActive: promotion.is_active,
          createdAt: promotion.created_at,
        }));
      } catch (error) {
        console.error('Error fetching active promotions:', error);
        return [];
      }
    },

    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('salon_id', salonId)
          .order('end_date', { ascending: false });

        if (error) {
          console.error('Error fetching salon promotions:', error);
          return [];
        }

        return data.map(promotion => ({
          id: promotion.id,
          salonId: promotion.salon_id,
          title: promotion.title,
          description: promotion.description,
          image: promotion.image,
          startDate: promotion.start_date,
          endDate: promotion.end_date,
          discount: promotion.discount,
          isActive: promotion.is_active,
          createdAt: promotion.created_at,
        }));
      } catch (error) {
        console.error('Error fetching salon promotions:', error);
        return [];
      }
    },
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          return [];
        }

        return data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },

    deleteUser: async (userId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },

    resetUserPassword: async (userId: string): Promise<void> => {
      // In a real implementation, you would trigger a password reset flow
      // For Supabase, you might use the `supabase.auth.resetPasswordForEmail` method
      console.log(`Password reset initiated for user ${userId}`);
    },

    getAllSalons: async (): Promise<Salon[]> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching salons:', error);
          return [];
        }

        return data.map(salon => ({
          id: salon.id,
          name: salon.name,
          description: salon.description,
          address: salon.address,
          city: salon.city,
          coverImage: salon.cover_image,
          rating: salon.rating,
          reviewCount: salon.review_count,
          ownerId: salon.owner_id,
          services: [],
          status: salon.status,
          createdAt: salon.created_at,
          socialMedia: salon.social_media,
        }));
      } catch (error) {
        console.error('Error fetching salons:', error);
        return [];
      }
    },

    getSalonById: async (salonId: string): Promise<Salon | null> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('id', salonId)
          .single();

        if (error) {
          console.error('Error fetching salon:', error);
          return null;
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          coverImage: data.cover_image,
          rating: data.rating,
          reviewCount: data.review_count,
          ownerId: data.owner_id,
          services: [],
          status: data.status,
          createdAt: data.created_at,
          socialMedia: data.social_media,
        };
      } catch (error) {
        console.error('Error fetching salon:', error);
        return null;
      }
    },

    updateSalon: async (salonId: string, salonData: Partial<Salon>): Promise<Salon> => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .update({
            name: salonData.name,
            description: salonData.description,
            address: salonData.address,
            city: salonData.city,
            cover_image: salonData.coverImage,
            rating: salonData.rating,
            review_count: salonData.reviewCount,
            owner_id: salonData.ownerId,
            status: salonData.status,
            social_media: salonData.socialMedia,
          })
          .eq('id', salonId)
          .select()
          .single();

        if (error) {
          console.error('Error updating salon:', error);
          throw error;
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          coverImage: data.cover_image,
          rating: data.rating,
          reviewCount: data.review_count,
          ownerId: data.owner_id,
          services: [],
          status: data.status,
          createdAt: data.created_at,
          socialMedia: data.social_media,
        };
      } catch (error) {
        console.error('Error updating salon:', error);
        throw error;
      }
    },

    deleteSalon: async (salonId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('salons')
          .delete()
          .eq('id', salonId);

        if (error) {
          console.error('Error deleting salon:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error deleting salon:', error);
        throw error;
      }
    },

    getSalonRequests: async (): Promise<SalonRequest[]> => {
      try {
        const { data, error } = await supabase
          .from('salon_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching salon requests:', error);
          return [];
        }

        return data.map(request => ({
          id: request.id,
          name: request.name,
          description: request.description,
          address: request.address,
          city: request.city,
          ownerEmail: request.owner_email,
          ownerName: request.owner_name,
          ownerPhone: request.owner_phone,
          status: request.status,
          createdAt: request.created_at,
          socialMedia: request.social_media,
        }));
      } catch (error) {
        console.error('Error fetching salon requests:', error);
        return [];
      }
    },

    approveSalonRequest: async (requestId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('salon_requests')
          .update({ status: 'approved' })
          .eq('id', requestId);

        if (error) {
          console.error('Error approving salon request:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error approving salon request:', error);
        throw error;
      }
    },

    rejectSalonRequest: async (requestId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('salon_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);

        if (error) {
          console.error('Error rejecting salon request:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error rejecting salon request:', error);
        throw error;
      }
    },
  },

  profiles: {
    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            phone: profileData.phone,
            avatar: profileData.avatar,
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }

        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: data.avatar,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },

    getProfile: async (userId: string): Promise<User | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }

        if (!data) {
          return null;
        }

        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: data.avatar,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    },
  }
};

// Helper function to get demo user names based on email
function getDemoUserName(email: string): string {
  switch (email) {
    case 'admin@beautyspot.com':
      return 'Admin User';
    case 'salon1@example.com':
      return 'Salon Owner';
    case 'user@example.com':
      return 'Regular User';
    default:
      return email.split('@')[0];
  }
}

// Helper function to get demo user roles based on email
function getDemoUserRole(email: string): UserRole {
  switch (email) {
    case 'admin@beautyspot.com':
      return 'admin';
    case 'salon1@example.com':
      return 'salon_owner';
    case 'user@example.com':
      return 'customer';
    default:
      return 'customer';
  }
}

export default firebaseApi;
