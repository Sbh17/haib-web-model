
import { config } from '@/config/environment';
import mockApi from './api';
import firebaseApi from './firebaseApi';

// Create a unified API service that can switch between mock and Firebase
const createApiService = () => {
  if (config.useFirebase) {
    console.log('Using Firebase API');
    return {
      ...mockApi, // Keep mock API for features not yet migrated
      // Override with Firebase implementations
      auth: firebaseApi.auth,
      salons: firebaseApi.salons,
      news: firebaseApi.news,
      promotions: firebaseApi.promotions,
    };
  } else {
    console.log('Using Mock API');
    return mockApi;
  }
};

export default createApiService();
