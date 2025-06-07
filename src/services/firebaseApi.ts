
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { User, Salon, Appointment, Review, NewsItem, Promotion } from '@/types';

// Helper function to convert Firestore timestamps to ISO strings
const convertTimestamp = (timestamp: any): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return timestamp || new Date().toISOString();
};

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
            email: firebaseUser.email!,
            name: userData.name || firebaseUser.displayName || '',
            phone: userData.phone || '',
            role: userData.role || 'user',
            createdAt: convertTimestamp(userData.createdAt),
            avatar: userData.avatar || firebaseUser.photoURL || undefined
          } as User;
        } else {
          throw new Error('User profile not found');
        }
      } catch (error: any) {
        throw new Error(error.message || 'Login failed');
      }
    },

    register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const firebaseUser = userCredential.user;
        
        // Create user profile in Firestore
        const userProfile = {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: 'user' as const,
          createdAt: serverTimestamp(),
          avatar: firebaseUser.photoURL || undefined
        };
        
        await addDoc(collection(db, 'users'), {
          ...userProfile,
          uid: firebaseUser.uid
        });
        
        return {
          id: firebaseUser.uid,
          ...userProfile,
          createdAt: new Date().toISOString()
        } as User;
      } catch (error: any) {
        throw new Error(error.message || 'Registration failed');
      }
    },

    getCurrentUser: async (): Promise<User | null> => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          unsubscribe();
          
          if (!firebaseUser) {
            resolve(null);
            return;
          }
          
          try {
            const userQuery = query(
              collection(db, 'users'),
              where('uid', '==', firebaseUser.uid)
            );
            const userSnapshot = await getDocs(userQuery);
            
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              resolve({
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                name: userData.name || firebaseUser.displayName || '',
                phone: userData.phone || '',
                role: userData.role || 'user',
                createdAt: convertTimestamp(userData.createdAt),
                avatar: userData.avatar || firebaseUser.photoURL || undefined
              } as User);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            resolve(null);
          }
        });
      });
    },

    logout: async (): Promise<void> => {
      await signOut(auth);
    }
  },

  salons: {
    getAll: async (): Promise<Salon[]> => {
      try {
        const salonsSnapshot = await getDocs(collection(db, 'salons'));
        return salonsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
          updatedAt: convertTimestamp(doc.data().updatedAt)
        })) as Salon[];
      } catch (error) {
        console.error('Error fetching salons:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<Salon | undefined> => {
      try {
        const salonDoc = await getDoc(doc(db, 'salons', id));
        if (salonDoc.exists()) {
          return {
            id: salonDoc.id,
            ...salonDoc.data(),
            createdAt: convertTimestamp(salonDoc.data().createdAt),
            updatedAt: convertTimestamp(salonDoc.data().updatedAt)
          } as Salon;
        }
        return undefined;
      } catch (error) {
        console.error('Error fetching salon:', error);
        return undefined;
      }
    },

    getNearby: async (lat: number, lng: number, radius: number = 5): Promise<Salon[]> => {
      // For now, return all salons since Firestore doesn't have built-in geo queries
      // In production, you'd use a geo library like GeoFire
      return this.getAll();
    },

    search: async (query: string): Promise<Salon[]> => {
      try {
        const salonsSnapshot = await getDocs(collection(db, 'salons'));
        const allSalons = salonsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
          updatedAt: convertTimestamp(doc.data().updatedAt)
        })) as Salon[];
        
        if (!query) return allSalons;
        
        return allSalons.filter(salon => 
          salon.name.toLowerCase().includes(query.toLowerCase()) ||
          salon.description.toLowerCase().includes(query.toLowerCase()) ||
          salon.address.toLowerCase().includes(query.toLowerCase())
        );
      } catch (error) {
        console.error('Error searching salons:', error);
        return [];
      }
    }
  },

  news: {
    getAll: async (): Promise<NewsItem[]> => {
      try {
        const newsQuery = query(
          collection(db, 'news'),
          orderBy('date', 'desc')
        );
        const newsSnapshot = await getDocs(newsQuery);
        return newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: convertTimestamp(doc.data().date),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as NewsItem[];
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<NewsItem | undefined> => {
      try {
        const newsDoc = await getDoc(doc(db, 'news', id));
        if (newsDoc.exists()) {
          return {
            id: newsDoc.id,
            ...newsDoc.data(),
            date: convertTimestamp(newsDoc.data().date),
            createdAt: convertTimestamp(newsDoc.data().createdAt)
          } as NewsItem;
        }
        return undefined;
      } catch (error) {
        console.error('Error fetching news item:', error);
        return undefined;
      }
    },

    getLatest: async (limitCount: number = 3): Promise<NewsItem[]> => {
      try {
        const newsQuery = query(
          collection(db, 'news'),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
        const newsSnapshot = await getDocs(newsQuery);
        return newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: convertTimestamp(doc.data().date),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as NewsItem[];
      } catch (error) {
        console.error('Error fetching latest news:', error);
        return [];
      }
    }
  },

  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      try {
        const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
        return promotionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: convertTimestamp(doc.data().startDate),
          endDate: convertTimestamp(doc.data().endDate),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Promotion[];
      } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
      }
    },

    getActive: async (): Promise<Promotion[]> => {
      try {
        const now = new Date();
        const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
        const allPromotions = promotionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: convertTimestamp(doc.data().startDate),
          endDate: convertTimestamp(doc.data().endDate),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Promotion[];
        
        return allPromotions.filter(
          promo => new Date(promo.startDate) <= now && new Date(promo.endDate) >= now
        );
      } catch (error) {
        console.error('Error fetching active promotions:', error);
        return [];
      }
    },

    getBySalonId: async (salonId: string): Promise<Promotion[]> => {
      try {
        const promotionsQuery = query(
          collection(db, 'promotions'),
          where('salonId', '==', salonId)
        );
        const promotionsSnapshot = await getDocs(promotionsQuery);
        return promotionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: convertTimestamp(doc.data().startDate),
          endDate: convertTimestamp(doc.data().endDate),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Promotion[];
      } catch (error) {
        console.error('Error fetching salon promotions:', error);
        return [];
      }
    }
  }
};

export default firebaseApi;
