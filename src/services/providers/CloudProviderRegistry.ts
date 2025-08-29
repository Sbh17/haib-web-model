// Cloud Provider Registry
// Manages registration and initialization of different cloud providers

import { ICloudProvider, IProviderConfig } from '@/interfaces/ICloudProvider';

export class CloudProviderRegistry {
  private static instance: CloudProviderRegistry;
  private providers: Map<string, () => Promise<ICloudProvider>> = new Map();
  private activeProvider: ICloudProvider | null = null;
  private fallbackProvider: ICloudProvider | null = null;

  private constructor() {}

  static getInstance(): CloudProviderRegistry {
    if (!CloudProviderRegistry.instance) {
      CloudProviderRegistry.instance = new CloudProviderRegistry();
    }
    return CloudProviderRegistry.instance;
  }

  // Register a provider factory
  registerProvider(name: string, factory: () => Promise<ICloudProvider>): void {
    this.providers.set(name, factory);
  }

  // Initialize and set the active provider
  async setActiveProvider(config: IProviderConfig): Promise<ICloudProvider> {
    const factory = this.providers.get(config.name);
    if (!factory) {
      throw new Error(`Provider ${config.name} not registered`);
    }

    try {
      const provider = await factory();
      await provider.initialize(config.credentials);
      this.activeProvider = provider;
      return provider;
    } catch (error) {
      console.error(`Failed to initialize provider ${config.name}:`, error);
      throw error;
    }
  }

  // Set fallback provider for resilience
  async setFallbackProvider(config: IProviderConfig): Promise<void> {
    const factory = this.providers.get(config.name);
    if (!factory) {
      console.warn(`Fallback provider ${config.name} not registered`);
      return;
    }

    try {
      const provider = await factory();
      await provider.initialize(config.credentials);
      this.fallbackProvider = provider;
    } catch (error) {
      console.warn(`Failed to initialize fallback provider ${config.name}:`, error);
    }
  }

  // Get active provider with fallback
  getProvider(): ICloudProvider {
    if (!this.activeProvider) {
      throw new Error('No active cloud provider initialized');
    }

    // Check if active provider is connected
    if (!this.activeProvider.isConnected() && this.fallbackProvider) {
      console.warn('Active provider disconnected, switching to fallback');
      return this.fallbackProvider;
    }

    return this.activeProvider;
  }

  // Get provider status
  getStatus(): { primary: boolean; fallback: boolean; active: string } {
    return {
      primary: this.activeProvider?.isConnected() || false,
      fallback: this.fallbackProvider?.isConnected() || false,
      active: this.activeProvider?.name || 'none'
    };
  }

  // Switch providers at runtime
  async switchProvider(config: IProviderConfig): Promise<void> {
    console.log(`Switching to provider: ${config.name}`);
    await this.setActiveProvider(config);
  }

  // Get list of available providers
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  // Migrate data between providers
  async migrateData(fromProvider: ICloudProvider, toProvider: ICloudProvider): Promise<void> {
    if (!fromProvider.exportData || !toProvider.importData) {
      throw new Error('Migration not supported by one or both providers');
    }

    console.log('Starting data migration...');
    const data = await fromProvider.exportData();
    await toProvider.importData(data);
    console.log('Data migration completed');
  }
}

// Singleton instance
export const cloudProviderRegistry = CloudProviderRegistry.getInstance();