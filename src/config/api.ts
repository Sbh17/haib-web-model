
// API Configuration for Backend Migration
// This file centralizes all API endpoints and configuration

export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: {
    development: 'http://localhost:3000/api',
    production: 'https://your-production-api.com/api',
    gcp: 'https://your-gcp-backend.com/api',
    firebase: 'https://your-firebase-functions.com/api'
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    
    // Salons
    SALONS: {
      LIST: '/salons',
      DETAIL: '/salons/:id',
      NEARBY: '/salons/nearby',
      CREATE: '/salons',
      UPDATE: '/salons/:id',
      DELETE: '/salons/:id',
      SEARCH: '/salons/search'
    },
    
    // Services
    SERVICES: {
      LIST: '/services',
      BY_SALON: '/salons/:salonId/services',
      CREATE: '/services',
      UPDATE: '/services/:id',
      DELETE: '/services/:id'
    },
    
    // Appointments
    APPOINTMENTS: {
      LIST: '/appointments',
      CREATE: '/appointments',
      UPDATE: '/appointments/:id',
      CANCEL: '/appointments/:id/cancel',
      USER_APPOINTMENTS: '/users/:userId/appointments'
    },
    
    // Reviews
    REVIEWS: {
      LIST: '/reviews',
      BY_SALON: '/salons/:salonId/reviews',
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      DELETE: '/reviews/:id'
    },
    
    // Promotions
    PROMOTIONS: {
      LIST: '/promotions',
      ACTIVE: '/promotions/active',
      BY_SALON: '/salons/:salonId/promotions',
      CREATE: '/promotions',
      UPDATE: '/promotions/:id',
      DELETE: '/promotions/:id'
    },
    
    // News
    NEWS: {
      LIST: '/news',
      DETAIL: '/news/:id',
      LATEST: '/news/latest',
      CREATE: '/news',
      UPDATE: '/news/:id',
      DELETE: '/news/:id'
    },
    
    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      SALON_REQUESTS: '/admin/salon-requests',
      ANALYTICS: '/admin/analytics'
    },
    
    // File Upload
    UPLOAD: {
      IMAGE: '/upload/image',
      AVATAR: '/upload/avatar',
      SALON_IMAGES: '/upload/salon-images'
    }
  },
  
  // Request configurations
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get the current API base URL
export const getApiBaseUrl = (): string => {
  const environment = process.env.NODE_ENV || 'development';
  return process.env.VITE_API_URL || API_CONFIG.BASE_URL[environment as keyof typeof API_CONFIG.BASE_URL];
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};

// Helper function to replace URL parameters
export const replaceUrlParams = (url: string, params: Record<string, string | number>): string => {
  let replacedUrl = url;
  Object.entries(params).forEach(([key, value]) => {
    replacedUrl = replacedUrl.replace(`:${key}`, String(value));
  });
  return replacedUrl;
};
