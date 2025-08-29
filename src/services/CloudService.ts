// Unified Cloud Service
// This is the main service that your application will use
// It provides a consistent interface regardless of the underlying cloud provider

import { ICloudProvider, ICloudServiceConfig } from '@/interfaces/ICloudProvider';
import { cloudProviderRegistry } from './providers/CloudProviderRegistry';
import { SupabaseProvider } from './providers/SupabaseProvider';
import { AzureProvider } from './providers/AzureProvider';
import { GCPProvider } from './providers/GCPProvider';
import { config } from '@/config/environment';

class CloudService {
  private static instance: CloudService;
  private currentProvider: ICloudProvider | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): CloudService {
    if (!CloudService.instance) {
      CloudService.instance = new CloudService();
    }
    return CloudService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Register available providers
    this.registerProviders();

    // Initialize with current configuration
    await this.setupProvider();
    
    this.isInitialized = true;
    console.log('CloudService initialized successfully');
  }

  private registerProviders(): void {
    // Register all available providers
    cloudProviderRegistry.registerProvider('supabase', async () => new SupabaseProvider());
    cloudProviderRegistry.registerProvider('azure', async () => new AzureProvider());
    cloudProviderRegistry.registerProvider('gcp', async () => new GCPProvider());
    
    console.log('Cloud providers registered:', cloudProviderRegistry.getAvailableProviders());
  }

  private async setupProvider(): Promise<void> {
    // Determine which provider to use based on configuration
    const providerConfig = this.getProviderConfig();
    
    try {
      this.currentProvider = await cloudProviderRegistry.setActiveProvider(providerConfig);
      console.log(`Successfully initialized ${providerConfig.name} provider`);
    } catch (error) {
      console.error('Failed to initialize primary provider:', error);
      
      // Try fallback providers
      const fallbackProviders = this.getFallbackProviders();
      for (const fallback of fallbackProviders) {
        try {
          console.log(`Trying fallback provider: ${fallback.name}`);
          this.currentProvider = await cloudProviderRegistry.setActiveProvider(fallback);
          console.log(`Successfully initialized fallback provider: ${fallback.name}`);
          break;
        } catch (fallbackError) {
          console.warn(`Fallback provider ${fallback.name} failed:`, fallbackError);
        }
      }
      
      if (!this.currentProvider) {
        throw new Error('All cloud providers failed to initialize');
      }
    }
  }

  private getProviderConfig() {
    // Check environment configuration to determine provider
    const envConfig = config;
    
    // Priority: Supabase (current) -> GCP -> Azure
    if (envConfig.supabaseUrl && envConfig.supabaseKey) {
      return {
        name: 'supabase' as const,
        credentials: {
          url: envConfig.supabaseUrl,
          key: envConfig.supabaseKey,
        },
      };
    }
    
    if (envConfig.integrations.gcp?.projectId) {
      return {
        name: 'gcp' as const,
        credentials: {
          projectId: envConfig.integrations.gcp.projectId,
          apiEndpoint: envConfig.integrations.gcp.apiEndpoint,
          region: envConfig.integrations.gcp.region,
        },
      };
    }
    
    if (envConfig.integrations.azure?.subscriptionId) {
      return {
        name: 'azure' as const,
        credentials: {
          subscriptionId: envConfig.integrations.azure.subscriptionId,
          resourceGroup: envConfig.integrations.azure.resourceGroup,
          endpoint: envConfig.integrations.azure.endpoint,
        },
      };
    }
    
    // Default to Supabase with current values
    return {
      name: 'supabase' as const,
      credentials: {
        url: 'https://pruhplqrmepvrbkzdomx.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydWhwbHFybWVwdnJia3pkb214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjE2MzMsImV4cCI6MjA2NjUzNzYzM30.kO5iTnYmDiPfrPFkpr3Bt8KBB0fbrM9DW1aIR_9X_WQ',
      },
    };
  }

  private getFallbackProviders() {
    // Return array of fallback providers in order of preference
    return [
      {
        name: 'supabase' as const,
        credentials: {
          url: 'https://pruhplqrmepvrbkzdomx.supabase.co',
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydWhwbHFybWVwdnJia3pkb214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjE2MzMsImV4cCI6MjA2NjUzNzYzM30.kO5iTnYmDiPfrPFkpr3Bt8KBB0fbrM9DW1aIR_9X_WQ',
        },
      },
    ];
  }

  // Provider management methods
  async switchProvider(providerName: 'supabase' | 'azure' | 'gcp', credentials: Record<string, string>): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('CloudService not initialized');
    }

    console.log(`Switching to ${providerName} provider...`);
    
    const providerConfig = {
      name: providerName,
      credentials,
    };

    try {
      this.currentProvider = await cloudProviderRegistry.setActiveProvider(providerConfig);
      console.log(`Successfully switched to ${providerName} provider`);
    } catch (error) {
      console.error(`Failed to switch to ${providerName}:`, error);
      throw error;
    }
  }

  getProviderStatus() {
    return {
      current: this.currentProvider?.name || 'none',
      connected: this.currentProvider?.isConnected() || false,
      available: cloudProviderRegistry.getAvailableProviders(),
      registry: cloudProviderRegistry.getStatus(),
    };
  }

  // Migration methods
  async migrateToProvider(targetProviderName: 'supabase' | 'azure' | 'gcp', credentials: Record<string, string>): Promise<void> {
    if (!this.currentProvider) {
      throw new Error('No current provider to migrate from');
    }

    console.log(`Starting migration from ${this.currentProvider.name} to ${targetProviderName}...`);

    // Initialize target provider
    const targetConfig = {
      name: targetProviderName,
      credentials,
    };
    
    const targetProvider = await cloudProviderRegistry.setActiveProvider(targetConfig);
    
    // Perform migration
    await cloudProviderRegistry.migrateData(this.currentProvider, targetProvider);
    
    // Switch to new provider
    this.currentProvider = targetProvider;
    
    console.log(`Migration to ${targetProviderName} completed successfully`);
  }

  // Proxy methods to current provider
  // These methods ensure your application code doesn't need to know about the provider

  get auth() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.auth;
  }

  get database() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.database;
  }

  get storage() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.storage;
  }

  get salons() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.salons;
  }

  get services() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.services;
  }

  get appointments() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.appointments;
  }

  get reviews() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.reviews;
  }

  get news() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.news;
  }

  get promotions() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.promotions;
  }

  get admin() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.admin;
  }

  get profiles() {
    if (!this.currentProvider) throw new Error('No provider initialized');
    return this.currentProvider.profiles;
  }
}

// Export singleton instance
export const cloudService = CloudService.getInstance();

// Initialize on module load
cloudService.initialize().catch(error => {
  console.error('Failed to initialize CloudService:', error);
});

// Export for direct use in components
export default cloudService;