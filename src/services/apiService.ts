
import { config } from '@/config/environment';
import mockApi from './mockApi';
import firebaseApi from './firebaseApi';
import gcpApi from './gcpApi';

// Create a unified API service that can switch between different backends
const createApiService = () => {
  // Check for Google Cloud configuration first
  if (config.integrations.gcp?.projectId && config.integrations.gcp?.apiEndpoint) {
    console.log('Using Google Cloud API');
    return gcpApi;
  } else if (config.useFirebase) {
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
