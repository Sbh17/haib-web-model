
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
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, Salon, NewsItem, Promotion } from '@/types';
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
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0,
            priceRange: data.priceRange || '$',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            isOpen: data.isOpen || false,
            openingHours: data.openingHours || {},
            amenities: data.amenities || [],
            services: data.services || [],
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
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0,
            priceRange: data.priceRange || '$',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            isOpen: data.isOpen || false,
            openingHours: data.openingHours || {},
            amenities: data.amenities || [],
            services: data.services || [],
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
            validUntil: timestampToISOString(data.validUntil),
            salonId: data.salonId || '',
            image: data.image || '',
            isActive: data.isActive || false
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
            validUntil: timestampToISOString(data.validUntil),
            salonId: data.salonId || '',
            image: data.image || '',
            isActive: data.isActive || false
          });
        });
        
        return promotions;
      } catch (error) {
        console.error('Firebase promotions.getActive error:', error);
        return mockApi.promotions.getActive();
      }
    }
  }
};

export default firebaseApi;
