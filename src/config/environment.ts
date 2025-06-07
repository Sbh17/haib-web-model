
// Environment Configuration for Frontend
// This helps with deployment and environment-specific settings

export interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  useFirebase: boolean;
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
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId?: string;
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
  useFirebase: true, // Enable Firebase by default
  features: {
    enableAnalytics: false,
    enablePushNotifications: false,
    enableRealTimeUpdates: false,
    enablePayments: false,
  },
  integrations: {
    firebase: {
      apiKey: "AIzaSyB0SwQnaMwmqX-Gwg1HdlGpMv7LmpOjajc",
      authDomain: "haib-command-center.firebaseapp.com",
      projectId: "haib-command-center",
      storageBucket: "haib-command-center.firebasestorage.app",
      messagingSenderId: "865630549304",
      appId: "1:865630549304:web:9d9b78538e5bdd1977bdcd",
      measurementId: "G-BWFV6TJXPE"
    }
  }
};

// Environment-specific configurations
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    environment: 'development',
    useFirebase: true,
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
    useFirebase: true,
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
    useFirebase: true,
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
      firebase: envConfig.integrations?.firebase || defaultConfig.integrations?.firebase,
      gcp: process.env.VITE_GCP_PROJECT_ID ? {
        projectId: process.env.VITE_GCP_PROJECT_ID,
        region: process.env.VITE_GCP_REGION || 'us-central1'
      } : envConfig.integrations?.gcp
    }
  };
};

// Export current config
export const config = getEnvironmentConfig();
