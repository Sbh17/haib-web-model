
// Environment Configuration for Frontend
// This helps with deployment and environment-specific settings

export interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  useFirebase: boolean;
  supabaseUrl: string;
  supabaseKey: string;
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
      apiEndpoint: string;
      databaseUrl: string;
    };
  };
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000/api',
  environment: 'development',
  useFirebase: false, // Use mock data instead of Firebase
  supabaseUrl: 'https://jxqdslpzqcavzchpsrrp.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cWRzbHB6cWNhdnpjaHBzcnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDMyNDksImV4cCI6MjA2MjYxOTI0OX0.39qm9lMU8SROxAD2zQbGTZP11WDBtXjuIqkOMC1zTeE',
  features: {
    enableAnalytics: false,
    enablePushNotifications: false,
    enableRealTimeUpdates: false,
    enablePayments: false,
  },
  integrations: {
    supabase: {
      url: 'https://jxqdslpzqcavzchpsrrp.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cWRzbHB6cWNhdnpjaHBzcnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDMyNDksImV4cCI6MjA2MjYxOTI0OX0.39qm9lMU8SROxAD2zQbGTZP11WDBtXjuIqkOMC1zTeE'
    },
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
    useFirebase: false,
    features: {
      enableAnalytics: false,
      enablePushNotifications: false,
      enableRealTimeUpdates: false,
      enablePayments: false,
    }
  },
  
  staging: {
    apiUrl: import.meta.env.VITE_STAGING_API_URL || 'https://staging-api.beautyspot.com/api',
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
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.beautyspot.com/api',
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
  const env = import.meta.env.MODE || 'development';
  const envConfig = environmentConfigs[env] || {};
  
  return {
    ...defaultConfig,
    ...envConfig,
    // Override with environment variables if available
    apiUrl: import.meta.env.VITE_API_URL || envConfig.apiUrl || defaultConfig.apiUrl,
    integrations: {
      ...defaultConfig.integrations,
      ...envConfig.integrations,
      supabase: import.meta.env.VITE_SUPABASE_URL ? {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      } : envConfig.integrations?.supabase || defaultConfig.integrations?.supabase,
      firebase: envConfig.integrations?.firebase || defaultConfig.integrations?.firebase,
      gcp: import.meta.env.VITE_GCP_PROJECT_ID ? {
        projectId: import.meta.env.VITE_GCP_PROJECT_ID,
        region: import.meta.env.VITE_GCP_REGION || 'us-central1',
        apiEndpoint: import.meta.env.VITE_GCP_API_ENDPOINT || '',
        databaseUrl: import.meta.env.VITE_GCP_DATABASE_URL || ''
      } : envConfig.integrations?.gcp
    }
  };
};

// Export current config
export const config = getEnvironmentConfig();
