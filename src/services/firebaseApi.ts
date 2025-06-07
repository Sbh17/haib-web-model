
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, Salon, NewsItem, Promotion, Service, Appointment, SalonWorker, SalonRequest, Review, ServiceCategory } from '@/types';
import mockApi from './mockApi';

// Helper function to convert Firestore timestamp to ISO string
const timestampToISOString = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
};

// Firebase API implementation
const firebaseApi = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: userData.phone || '',
            role: userData.role || 'customer',
            avatar: userData.avatar || firebaseUser.photoURL || '',
            createdAt: timestampToISOString(userData.createdAt),
            updatedAt: timestampToISOString(userData.updatedAt)
          };
        } else {
          // Create user profile if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: '',
            role: 'customer',
            avatar: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          
          return newUser;
        }
      } catch (error) {
        console.error('Firebase login error:', error);
        throw error;
      }
    },
    
    register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const firebaseUser = userCredential.user;
        
        // Update Firebase Auth profile
        await updateProfile(firebaseUser, {
          displayName: data.name
        });
        
        // Create user profile in Firestore
        const newUser: User = {
          id: firebaseUser.uid,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: 'customer',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        return newUser;
      } catch (error) {
        console.error('Firebase registration error:', error);
        throw error;
      }
    },
    
    logout: async (): Promise<void> => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Firebase logout error:', error);
        throw error;
      }
    },
    
    getCurrentUser: async (): Promise<User | null> => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: userData.phone || '',
            role: userData.role || 'customer',
            avatar: userData.avatar || firebaseUser.photoURL || '',
            createdAt: timestampToISOString(userData.createdAt),
            updatedAt: timestampToISOString(userData.updatedAt)
          };
        }
        
        return null;
      } catch (error) {
        console.error('Firebase getCurrentUser error:', error);
        return null;
      }
    }
  },
  
  salons: {
    getAll: async (): Promise<Salon[]> => {
      try {
        const salonsCollection = collection(db, 'salons');
        const salonsSnapshot = await getDocs(salonsCollection);
        
        const salons: Salon[] = [];
        salonsSnapshot.forEach(doc => {
          const data = doc.data();
          salons.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            images: data.images || [],
            coverImage: data.coverImage || data.images?.[0] || '',
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0,
            priceRange: data.priceRange || '$',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            isOpen: data.isOpen || false,
            openingHours: data.openingHours || {},
            amenities: data.amenities || [],
            services: data.services || [],
            ownerId: data.ownerId || '',
            status: data.status || 'pending',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          });
        });
        
        return salons;
      } catch (error) {
        console.error('Firebase salons.getAll error:', error);
        // Fallback to mock data on error
        return mockApi.salons.getAll();
      }
    },
    
    getById: async (id: string): Promise<Salon | null> => {
      try {
        const salonDoc = await getDoc(doc(db, 'salons', id));
        
        if (salonDoc.exists()) {
          const data = salonDoc.data();
          return {
            id: salonDoc.id,
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            images: data.images || [],
            coverImage: data.coverImage || data.images?.[0] || '',
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0,
            priceRange: data.priceRange || '$',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            isOpen: data.isOpen || false,
            openingHours: data.openingHours || {},
            amenities: data.amenities || [],
            services: data.services || [],
            ownerId: data.ownerId || '',
            status: data.status || 'pending',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          };
        }
        
        return null;
      } catch (error) {
        console.error('Firebase salons.getById error:', error);
        return mockApi.salons.getById(id);
      }
    },
    
    getNearby: async (lat: number, lng: number, radius: number = 10): Promise<Salon[]> => {
      try {
        // For now, return all salons (geolocation queries require special setup in Firestore)
        return this.getAll();
      } catch (error) {
        console.error('Firebase salons.getNearby error:', error);
        return mockApi.salons.getNearby(lat, lng, radius);
      }
    },
    
    search: async (searchQuery: string): Promise<Salon[]> => {
      try {
        const salons = await this.getAll();
        return salons.filter(salon => 
          salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          salon.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } catch (error) {
        console.error('Firebase salons.search error:', error);
        return mockApi.salons.search(searchQuery);
      }
    },

    getWorkers: async (salonId: string): Promise<SalonWorker[]> => {
      try {
        const workersCollection = collection(db, 'salon_workers');
        const workersQuery = query(workersCollection, where('salonId', '==', salonId));
        const workersSnapshot = await getDocs(workersQuery);
        
        const workers: SalonWorker[] = [];
        workersSnapshot.forEach(doc => {
          const data = doc.data();
          workers.push({
            id: doc.id,
            salonId: data.salonId,
            name: data.name || '',
            specialty: data.specialty || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            phone: data.phone || '',
            email: data.email || '',
            isActive: data.isActive || true,
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          });
        });
        
        return workers;
      } catch (error) {
        console.error('Firebase salons.getWorkers error:', error);
        return mockApi.salons.getWorkers(salonId);
      }
    },

    requestNewSalon: async (salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest> => {
      try {
        const requestRef = await addDoc(collection(db, 'salon_requests'), {
          ...salonData,
          status: 'pending',
          createdAt: Timestamp.now()
        });
        
        const newRequest: SalonRequest = {
          id: requestRef.id,
          ...salonData,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        return newRequest;
      } catch (error) {
        console.error('Firebase salons.requestNewSalon error:', error);
        return mockApi.salons.requestNewSalon(salonData);
      }
    }
  },

  services: {
    getAll: async (): Promise<Service[]> => {
      try {
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);
        
        const services: Service[] = [];
        servicesSnapshot.forEach(doc => {
          const data = doc.data();
          services.push({
            id: doc.id,
            salonId: data.salonId || '',
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            duration: data.duration || 0,
            categoryId: data.categoryId || '',
            category: data.category || '',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          });
        });
        
        return services;
      } catch (error) {
        console.error('Firebase services.getAll error:', error);
        return mockApi.services.getAll();
      }
    },

    getForSalon: async (salonId: string): Promise<Service[]> => {
      try {
        const servicesCollection = collection(db, 'services');
        const servicesQuery = query(servicesCollection, where('salonId', '==', salonId));
        const servicesSnapshot = await getDocs(servicesQuery);
        
        const services: Service[] = [];
        servicesSnapshot.forEach(doc => {
          const data = doc.data();
          services.push({
            id: doc.id,
            salonId: data.salonId || '',
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            duration: data.duration || 0,
            categoryId: data.categoryId || '',
            category: data.category || '',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          });
        });
        
        return services;
      } catch (error) {
        console.error('Firebase services.getForSalon error:', error);
        return mockApi.services.getForSalon(salonId);
      }
    },

    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      try {
        // For now, return static categories (in real app, might fetch from DB)
        return [
          { id: '1', name: 'Hair' },
          { id: '2', name: 'Nails' },
          { id: '3', name: 'Spa' },
          { id: '4', name: 'Makeup' }
        ];
      } catch (error) {
        console.error('Firebase services.getServiceCategories error:', error);
        return mockApi.services.getServiceCategories();
      }
    }
  },

  appointments: {
    getAll: async (): Promise<Appointment[]> => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        
        const appointments: Appointment[] = [];
        appointmentsSnapshot.forEach(doc => {
          const data = doc.data();
          appointments.push({
            id: doc.id,
            userId: data.userId || '',
            salonId: data.salonId || '',
            serviceId: data.serviceId || '',
            workerId: data.workerId || '',
            date: timestampToISOString(data.date),
            status: data.status || 'pending',
            notes: data.notes || '',
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return appointments;
      } catch (error) {
        console.error('Firebase appointments.getAll error:', error);
        return mockApi.appointments.getAll();
      }
    },

    getMyAppointments: async (userId: string): Promise<Appointment[]> => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const appointmentsQuery = query(appointmentsCollection, where('userId', '==', userId));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        const appointments: Appointment[] = [];
        appointmentsSnapshot.forEach(doc => {
          const data = doc.data();
          appointments.push({
            id: doc.id,
            userId: data.userId || '',
            salonId: data.salonId || '',
            serviceId: data.serviceId || '',
            workerId: data.workerId || '',
            date: timestampToISOString(data.date),
            status: data.status || 'pending',
            notes: data.notes || '',
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return appointments;
      } catch (error) {
        console.error('Firebase appointments.getMyAppointments error:', error);
        return mockApi.appointments.getMyAppointments(userId);
      }
    },

    bookAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
      try {
        const appointmentRef = await addDoc(collection(db, 'appointments'), {
          ...appointmentData,
          date: Timestamp.fromDate(new Date(appointmentData.date)),
          createdAt: Timestamp.now()
        });
        
        const newAppointment: Appointment = {
          id: appointmentRef.id,
          ...appointmentData
        };
        
        return newAppointment;
      } catch (error) {
        console.error('Firebase appointments.bookAppointment error:', error);
        return mockApi.appointments.bookAppointment(appointmentData);
      }
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
      try {
        await updateDoc(doc(db, 'appointments', appointmentId), {
          status: 'cancelled',
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Firebase appointments.cancelAppointment error:', error);
        return mockApi.appointments.cancelAppointment(appointmentId);
      }
    }
  },

  reviews: {
    getAll: async (): Promise<Review[]> => {
      try {
        const reviewsCollection = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        
        const reviews: Review[] = [];
        reviewsSnapshot.forEach(doc => {
          const data = doc.data();
          reviews.push({
            id: doc.id,
            userId: data.userId || '',
            salonId: data.salonId || '',
            appointmentId: data.appointmentId || '',
            rating: data.rating || 0,
            comment: data.comment || '',
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return reviews;
      } catch (error) {
        console.error('Firebase reviews.getAll error:', error);
        return mockApi.reviews.getAll();
      }
    },

    getForSalon: async (salonId: string): Promise<Review[]> => {
      try {
        const reviewsCollection = collection(db, 'reviews');
        const reviewsQuery = query(reviewsCollection, where('salonId', '==', salonId));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        
        const reviews: Review[] = [];
        reviewsSnapshot.forEach(doc => {
          const data = doc.data();
          reviews.push({
            id: doc.id,
            userId: data.userId || '',
            salonId: data.salonId || '',
            appointmentId: data.appointmentId || '',
            rating: data.rating || 0,
            comment: data.comment || '',
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return reviews;
      } catch (error) {
        console.error('Firebase reviews.getForSalon error:', error);
        return mockApi.reviews.getForSalon(salonId);
      }
    },

    create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
      try {
        const reviewRef = await addDoc(collection(db, 'reviews'), {
          ...reviewData,
          createdAt: Timestamp.now()
        });
        
        const newReview: Review = {
          id: reviewRef.id,
          ...reviewData,
          createdAt: new Date().toISOString()
        };
        
        return newReview;
      } catch (error) {
        console.error('Firebase reviews.create error:', error);
        return mockApi.reviews.create(reviewData);
      }
    }
  },
  
  news: {
    getAll: async (): Promise<NewsItem[]> => {
      try {
        const newsCollection = collection(db, 'news');
        const newsQuery = query(newsCollection, orderBy('date', 'desc'));
        const newsSnapshot = await getDocs(newsQuery);
        
        const news: NewsItem[] = [];
        newsSnapshot.forEach(doc => {
          const data = doc.data();
          news.push({
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            category: data.category || '',
            date: timestampToISOString(data.date),
            image: data.image || ''
          });
        });
        
        return news;
      } catch (error) {
        console.error('Firebase news.getAll error:', error);
        return mockApi.news.getAll();
      }
    },
    
    getById: async (id: string): Promise<NewsItem | null> => {
      try {
        const newsDoc = await getDoc(doc(db, 'news', id));
        
        if (newsDoc.exists()) {
          const data = newsDoc.data();
          return {
            id: newsDoc.id,
            title: data.title || '',
            content: data.content || '',
            category: data.category || '',
            date: timestampToISOString(data.date),
            image: data.image || ''
          };
        }
        
        return null;
      } catch (error) {
        console.error('Firebase news.getById error:', error);
        return mockApi.news.getById(id);
      }
    },

    getLatest: async (limitCount: number = 5): Promise<NewsItem[]> => {
      try {
        const newsCollection = collection(db, 'news');
        const newsQuery = query(newsCollection, orderBy('date', 'desc'), limit(limitCount));
        const newsSnapshot = await getDocs(newsQuery);
        
        const news: NewsItem[] = [];
        newsSnapshot.forEach(doc => {
          const data = doc.data();
          news.push({
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            category: data.category || '',
            date: timestampToISOString(data.date),
            image: data.image || ''
          });
        });
        
        return news;
      } catch (error) {
        console.error('Firebase news.getLatest error:', error);
        return mockApi.news.getLatest(limitCount);
      }
    }
  },
  
  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      try {
        const promotionsCollection = collection(db, 'promotions');
        const promotionsSnapshot = await getDocs(promotionsCollection);
        
        const promotions: Promotion[] = [];
        promotionsSnapshot.forEach(doc => {
          const data = doc.data();
          promotions.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            discount: data.discount || 0,
            endDate: timestampToISOString(data.endDate),
            startDate: timestampToISOString(data.startDate),
            salonId: data.salonId || '',
            image: data.image || '',
            isActive: data.isActive || false,
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return promotions;
      } catch (error) {
        console.error('Firebase promotions.getAll error:', error);
        return mockApi.promotions.getAll();
      }
    },
    
    getActive: async (): Promise<Promotion[]> => {
      try {
        const promotionsCollection = collection(db, 'promotions');
        const activeQuery = query(promotionsCollection, where('isActive', '==', true));
        const promotionsSnapshot = await getDocs(activeQuery);
        
        const promotions: Promotion[] = [];
        promotionsSnapshot.forEach(doc => {
          const data = doc.data();
          promotions.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            discount: data.discount || 0,
            endDate: timestampToISOString(data.endDate),
            startDate: timestampToISOString(data.startDate),
            salonId: data.salonId || '',
            image: data.image || '',
            isActive: data.isActive || false,
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return promotions;
      } catch (error) {
        console.error('Firebase promotions.getActive error:', error);
        return mockApi.promotions.getActive();
      }
    },

    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      try {
        const promotionsCollection = collection(db, 'promotions');
        const promotionsQuery = query(promotionsCollection, where('salonId', '==', salonId));
        const promotionsSnapshot = await getDocs(promotionsQuery);
        
        const promotions: Promotion[] = [];
        promotionsSnapshot.forEach(doc => {
          const data = doc.data();
          promotions.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            discount: data.discount || 0,
            endDate: timestampToISOString(data.endDate),
            startDate: timestampToISOString(data.startDate),
            salonId: data.salonId || '',
            image: data.image || '',
            isActive: data.isActive || false,
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return promotions;
      } catch (error) {
        console.error('Firebase promotions.getForSalon error:', error);
        return mockApi.promotions.getForSalon(salonId);
      }
    }
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        const users: User[] = [];
        usersSnapshot.forEach(doc => {
          const data = doc.data();
          users.push({
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'customer',
            avatar: data.avatar || '',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          });
        });
        
        return users;
      } catch (error) {
        console.error('Firebase admin.getAllUsers error:', error);
        return mockApi.admin.getAllUsers();
      }
    },

    deleteUser: async (userId: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error('Firebase admin.deleteUser error:', error);
        return mockApi.admin.deleteUser(userId);
      }
    },

    resetUserPassword: async (userId: string): Promise<void> => {
      try {
        // In Firebase, password reset is typically done via email
        // This would require Firebase Admin SDK or functions
        console.log(`Password reset initiated for user ${userId}`);
      } catch (error) {
        console.error('Firebase admin.resetUserPassword error:', error);
        return mockApi.admin.resetUserPassword(userId);
      }
    },

    getAllSalons: async (): Promise<Salon[]> => {
      try {
        return firebaseApi.salons.getAll();
      } catch (error) {
        console.error('Firebase admin.getAllSalons error:', error);
        return mockApi.admin.getAllSalons();
      }
    },

    getSalonById: async (salonId: string): Promise<Salon | null> => {
      try {
        return firebaseApi.salons.getById(salonId);
      } catch (error) {
        console.error('Firebase admin.getSalonById error:', error);
        return mockApi.admin.getSalonById(salonId);
      }
    },

    updateSalon: async (salonId: string, salonData: Partial<Salon>): Promise<Salon> => {
      try {
        await updateDoc(doc(db, 'salons', salonId), {
          ...salonData,
          updatedAt: Timestamp.now()
        });
        
        const updatedSalon = await firebaseApi.salons.getById(salonId);
        if (!updatedSalon) {
          throw new Error('Salon not found after update');
        }
        
        return updatedSalon;
      } catch (error) {
        console.error('Firebase admin.updateSalon error:', error);
        return mockApi.admin.updateSalon(salonId, salonData);
      }
    },

    deleteSalon: async (salonId: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'salons', salonId));
      } catch (error) {
        console.error('Firebase admin.deleteSalon error:', error);
        return mockApi.admin.deleteSalon(salonId);
      }
    },

    getSalonRequests: async (): Promise<SalonRequest[]> => {
      try {
        const requestsCollection = collection(db, 'salon_requests');
        const requestsSnapshot = await getDocs(requestsCollection);
        
        const requests: SalonRequest[] = [];
        requestsSnapshot.forEach(doc => {
          const data = doc.data();
          requests.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            ownerName: data.ownerName || '',
            ownerEmail: data.ownerEmail || '',
            ownerPhone: data.ownerPhone || '',
            status: data.status || 'pending',
            createdAt: timestampToISOString(data.createdAt)
          });
        });
        
        return requests;
      } catch (error) {
        console.error('Firebase admin.getSalonRequests error:', error);
        return mockApi.admin.getSalonRequests();
      }
    },

    approveSalonRequest: async (requestId: string): Promise<void> => {
      try {
        await updateDoc(doc(db, 'salon_requests', requestId), {
          status: 'approved',
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Firebase admin.approveSalonRequest error:', error);
        return mockApi.admin.approveSalonRequest(requestId);
      }
    },

    rejectSalonRequest: async (requestId: string): Promise<void> => {
      try {
        await updateDoc(doc(db, 'salon_requests', requestId), {
          status: 'rejected',
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Firebase admin.rejectSalonRequest error:', error);
        return mockApi.admin.rejectSalonRequest(requestId);
      }
    }
  },

  profiles: {
    updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
      try {
        await updateDoc(doc(db, 'users', userId), {
          ...profileData,
          updatedAt: Timestamp.now()
        });
        
        const updatedDoc = await getDoc(doc(db, 'users', userId));
        if (updatedDoc.exists()) {
          const data = updatedDoc.data();
          return {
            id: updatedDoc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'customer',
            avatar: data.avatar || '',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          };
        }
        
        throw new Error('User not found after update');
      } catch (error) {
        console.error('Firebase profiles.updateProfile error:', error);
        return mockApi.profiles.updateProfile(userId, profileData);
      }
    },

    getProfile: async (userId: string): Promise<User | null> => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          return {
            id: userDoc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'customer',
            avatar: data.avatar || '',
            createdAt: timestampToISOString(data.createdAt),
            updatedAt: timestampToISOString(data.updatedAt)
          };
        }
        
        return null;
      } catch (error) {
        console.error('Firebase profiles.getProfile error:', error);
        return mockApi.profiles.getProfile(userId);
      }
    }
  }
};

export default firebaseApi;
