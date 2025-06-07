
// Environment Configuration for Frontend
// This helps with deployment and environment-specific settings

export interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    enableAnalytics: boolean;
    enablePushNotifications: boolean;
    enableRealTimeUpdates: boolean;
    enablePayments: boolean;
  };
  integrations: {
    supabase?: {
      url: string;
      anonKey: string;
    };
    firebase?: {
      apiKey: string;
      authDomain: string;
      projectId: string;
    };
    gcp?: {
      projectId: string;
      region: string;
    };
  };
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000/api',
  environment: 'development',
  features: {
    enableAnalytics: false,
    enablePushNotifications: false,
    enableRealTimeUpdates: false,
    enablePayments: false,
  },
  integrations: {}
};

// Environment-specific configurations
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    environment: 'development',
    features: {
      enableAnalytics: false,
      enablePushNotifications: false,
      enableRealTimeUpdates: false,
      enablePayments: false,
    }
  },
  
  staging: {
    apiUrl: process.env.VITE_STAGING_API_URL || 'https://staging-api.beautyspot.com/api',
    environment: 'staging',
    features: {
      enableAnalytics: true,
      enablePushNotifications: false,
      enableRealTimeUpdates: true,
      enablePayments: false,
    }
  },
  
  production: {
    apiUrl: process.env.VITE_API_URL || 'https://api.beautyspot.com/api',
    environment: 'production',
    features: {
      enableAnalytics: true,
      enablePushNotifications: true,
      enableRealTimeUpdates: true,
      enablePayments: true,
    }
  }
};

// Get current environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = environmentConfigs[env] || {};
  
  return {
    ...defaultConfig,
    ...envConfig,
    // Override with environment variables if available
    apiUrl: process.env.VITE_API_URL || envConfig.apiUrl || defaultConfig.apiUrl,
    integrations: {
      ...defaultConfig.integrations,
      ...envConfig.integrations,
      supabase: process.env.VITE_SUPABASE_URL ? {
        url: process.env.VITE_SUPABASE_URL,
        anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
      } : envConfig.integrations?.supabase,
      firebase: process.env.VITE_FIREBASE_API_KEY ? {
        apiKey: process.env.VITE_FIREBASE_API_KEY,
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || ''
      } : envConfig.integrations?.firebase,
      gcp: process.env.VITE_GCP_PROJECT_ID ? {
        projectId: process.env.VITE_GCP_PROJECT_ID,
        region: process.env.VITE_GCP_REGION || 'us-central1'
      } : envConfig.integrations?.gcp
    }
  };
};

// Export current config
export const config = getEnvironmentConfig();
