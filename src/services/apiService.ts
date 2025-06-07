
import { config } from '@/config/environment';
import mockApi from './mockApi';
import firebaseApi from './firebaseApi';

// Create a unified API service that can switch between mock and Firebase
const createApiService = () => {
  if (config.useFirebase) {
    console.log('Using Firebase API');
    return {
      // Include all API methods from both services
      auth: firebaseApi.auth,
      salons: firebaseApi.salons,
      services: firebaseApi.services,
      appointments: firebaseApi.appointments,
      reviews: firebaseApi.reviews,
      news: firebaseApi.news,
      promotions: firebaseApi.promotions,
      admin: firebaseApi.admin,
      profiles: firebaseApi.profiles,
    };
  } else {
    console.log('Using Mock API');
    return mockApi;
  }
};

export default createApiService();
