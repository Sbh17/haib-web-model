
import { config } from '@/config/environment';
import mockApi from './mockApi';
import firebaseApi from './firebaseApi';
import gcpApi from './gcpApi';

// Simple API service that switches between different backends
let apiService: any;

try {
  // Check for Google Cloud configuration first
  if (config.integrations.gcp?.projectId && config.integrations.gcp?.apiEndpoint) {
    console.log('Using Google Cloud API');
    apiService = gcpApi;
  } else if (config.useFirebase) {
    console.log('Using Firebase API');
    apiService = {
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
    apiService = mockApi;
  }
} catch (error) {
  console.error('Error initializing API service, falling back to mock API:', error);
  apiService = mockApi;
}

export default apiService;
