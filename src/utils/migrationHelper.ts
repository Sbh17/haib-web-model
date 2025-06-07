
// Migration Helper for Backend Transition
// This utility helps with the transition from current setup to GCP/Firebase

export interface MigrationStatus {
  isBackendMigrated: boolean;
  currentProvider: 'supabase' | 'firebase' | 'gcp' | 'custom';
  apiEndpoint: string;
  features: {
    auth: boolean;
    database: boolean;
    storage: boolean;
    realtime: boolean;
  };
}

// Check migration status based on environment variables
export const getMigrationStatus = (): MigrationStatus => {
  const hasFirebaseConfig = !!(
    process.env.VITE_FIREBASE_API_KEY ||
    process.env.VITE_FIREBASE_PROJECT_ID
  );
  
  const hasGCPConfig = !!(
    process.env.VITE_GCP_PROJECT_ID ||
    process.env.VITE_GCP_ENDPOINT
  );
  
  const hasSupabaseConfig = !!(
    process.env.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_ANON_KEY
  );
  
  const hasCustomAPI = !!process.env.VITE_API_URL;
  
  let currentProvider: MigrationStatus['currentProvider'] = 'custom';
  let isBackendMigrated = false;
  
  if (hasFirebaseConfig) {
    currentProvider = 'firebase';
    isBackendMigrated = true;
  } else if (hasGCPConfig) {
    currentProvider = 'gcp';
    isBackendMigrated = true;
  } else if (hasSupabaseConfig) {
    currentProvider = 'supabase';
    isBackendMigrated = false; // Current setup
  }
  
  return {
    isBackendMigrated,
    currentProvider,
    apiEndpoint: process.env.VITE_API_URL || 'http://localhost:3000/api',
    features: {
      auth: true,
      database: true,
      storage: hasFirebaseConfig || hasGCPConfig || hasSupabaseConfig,
      realtime: hasFirebaseConfig || hasSupabaseConfig
    }
  };
};

// API adapter for different backends
export class APIAdapter {
  private migrationStatus: MigrationStatus;
  
  constructor() {
    this.migrationStatus = getMigrationStatus();
  }
  
  // Get the appropriate API client based on current backend
  getApiClient() {
    switch (this.migrationStatus.currentProvider) {
      case 'firebase':
        return this.getFirebaseClient();
      case 'gcp':
        return this.getGCPClient();
      case 'supabase':
        return this.getSupabaseClient();
      default:
        return this.getCustomClient();
    }
  }
  
  private getFirebaseClient() {
    // Firebase-specific API client logic
    return {
      baseURL: process.env.VITE_FIREBASE_FUNCTIONS_URL || 'https://us-central1-your-project.cloudfunctions.net',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getFirebaseToken()}`
      }
    };
  }
  
  private getGCPClient() {
    // GCP-specific API client logic
    return {
      baseURL: process.env.VITE_GCP_ENDPOINT || 'https://your-service.run.app',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getGCPToken()}`
      }
    };
  }
  
  private getSupabaseClient() {
    // Supabase-specific API client logic (current)
    return {
      baseURL: process.env.VITE_SUPABASE_URL || '',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${this.getSupabaseToken()}`
      }
    };
  }
  
  private getCustomClient() {
    // Custom API client logic
    return {
      baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getCustomToken()}`
      }
    };
  }
  
  private getFirebaseToken(): string {
    // Get Firebase auth token
    return localStorage.getItem('firebase_token') || '';
  }
  
  private getGCPToken(): string {
    // Get GCP auth token
    return localStorage.getItem('gcp_token') || '';
  }
  
  private getSupabaseToken(): string {
    // Get Supabase auth token
    return localStorage.getItem('supabase_token') || '';
  }
  
  private getCustomToken(): string {
    // Get custom auth token
    return localStorage.getItem('auth_token') || '';
  }
}

// Export singleton instance
export const apiAdapter = new APIAdapter();
