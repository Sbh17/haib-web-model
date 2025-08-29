// Cloud Provider Management Component
// Allows runtime switching between different cloud providers

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cloudService } from '@/services/CloudService';
import { Cloud, Database, Shield, Zap, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProviderStatus {
  current: string;
  connected: boolean;
  available: string[];
  registry: {
    primary: boolean;
    fallback: boolean;
    active: string;
  };
}

interface ProviderCredentials {
  supabase: {
    url: string;
    key: string;
  };
  azure: {
    subscriptionId: string;
    resourceGroup: string;
    endpoint: string;
    functionKey: string;
  };
  gcp: {
    projectId: string;
    apiEndpoint: string;
    region: string;
  };
}

export const CloudProviderManager: React.FC = () => {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [credentials, setCredentials] = useState<ProviderCredentials>({
    supabase: { url: '', key: '' },
    azure: { subscriptionId: '', resourceGroup: '', endpoint: '', functionKey: '' },
    gcp: { projectId: '', apiEndpoint: '', region: 'us-central1' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProviderStatus();
    // Set up interval to check connection status
    const interval = setInterval(loadProviderStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadProviderStatus = () => {
    try {
      const providerStatus = cloudService.getProviderStatus();
      setStatus(providerStatus);
    } catch (error) {
      console.error('Failed to load provider status:', error);
    }
  };

  const handleSwitchProvider = async (providerName: 'supabase' | 'azure' | 'gcp') => {
    setIsLoading(true);
    try {
      const creds = credentials[providerName];
      
      // Validate required fields
      const requiredFields = {
        supabase: ['url', 'key'],
        azure: ['subscriptionId', 'resourceGroup', 'endpoint', 'functionKey'],
        gcp: ['projectId', 'apiEndpoint', 'region'],
      };

      for (const field of requiredFields[providerName]) {
        if (!(creds as any)[field]) {
          throw new Error(`${field} is required for ${providerName} provider`);
        }
      }

      await cloudService.switchProvider(providerName, creds as any);
      loadProviderStatus();
      
      toast({
        title: 'Provider Switched',
        description: `Successfully switched to ${providerName.toUpperCase()} provider`,
      });
    } catch (error) {
      console.error('Failed to switch provider:', error);
      toast({
        title: 'Switch Failed',
        description: error instanceof Error ? error.message : 'Failed to switch provider',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateData = async (targetProvider: 'supabase' | 'azure' | 'gcp') => {
    if (!confirm(`Are you sure you want to migrate all data to ${targetProvider.toUpperCase()}? This process cannot be undone.`)) {
      return;
    }

    setIsMigrating(true);
    try {
      const creds = credentials[targetProvider];
      await cloudService.migrateToProvider(targetProvider, creds as any);
      loadProviderStatus();
      
      toast({
        title: 'Migration Complete',
        description: `Successfully migrated data to ${targetProvider.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: 'Migration Failed',
        description: error instanceof Error ? error.message : 'Failed to migrate data',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'supabase': return <Database className="h-4 w-4" />;
      case 'azure': return <Cloud className="h-4 w-4" />;
      case 'gcp': return <Zap className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading provider status...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Provider Status
          </CardTitle>
          <CardDescription>
            Current provider configuration and connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getProviderIcon(status.current)}
              <div>
                <p className="font-medium capitalize">{status.current} Provider</p>
                <p className="text-sm text-muted-foreground">
                  {status.connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.connected)}
              <Badge variant={status.connected ? 'default' : 'destructive'}>
                {status.connected ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Available Providers</p>
              <p className="text-muted-foreground">{status.available.length} registered</p>
            </div>
            <div>
              <p className="font-medium">Primary Status</p>
              <p className="text-muted-foreground">
                {status.registry.primary ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <div>
              <p className="font-medium">Fallback Status</p>
              <p className="text-muted-foreground">
                {status.registry.fallback ? 'Available' : 'Not configured'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Configuration</CardTitle>
          <CardDescription>
            Configure and switch between different cloud providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supabase" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supabase" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Supabase
              </TabsTrigger>
              <TabsTrigger value="azure" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Azure
              </TabsTrigger>
              <TabsTrigger value="gcp" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Google Cloud
              </TabsTrigger>
            </TabsList>

            {/* Supabase Configuration */}
            <TabsContent value="supabase" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="supabase-url">Project URL</Label>
                  <Input
                    id="supabase-url"
                    value={credentials.supabase.url}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      supabase: { ...prev.supabase, url: e.target.value }
                    }))}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div>
                  <Label htmlFor="supabase-key">Anon Key</Label>
                  <Input
                    id="supabase-key"
                    type="password"
                    value={credentials.supabase.key}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      supabase: { ...prev.supabase, key: e.target.value }
                    }))}
                    placeholder="eyJ..."
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSwitchProvider('supabase')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Switching...' : 'Switch to Supabase'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleMigrateData('supabase')}
                  disabled={isMigrating || status.current === 'supabase'}
                >
                  {isMigrating ? 'Migrating...' : 'Migrate Data'}
                </Button>
              </div>
            </TabsContent>

            {/* Azure Configuration */}
            <TabsContent value="azure" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="azure-subscription">Subscription ID</Label>
                  <Input
                    id="azure-subscription"
                    value={credentials.azure.subscriptionId}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      azure: { ...prev.azure, subscriptionId: e.target.value }
                    }))}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="azure-resource-group">Resource Group</Label>
                  <Input
                    id="azure-resource-group"
                    value={credentials.azure.resourceGroup}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      azure: { ...prev.azure, resourceGroup: e.target.value }
                    }))}
                    placeholder="haib-beauty-rg"
                  />
                </div>
                <div>
                  <Label htmlFor="azure-endpoint">Function App Endpoint</Label>
                  <Input
                    id="azure-endpoint"
                    value={credentials.azure.endpoint}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      azure: { ...prev.azure, endpoint: e.target.value }
                    }))}
                    placeholder="https://your-app.azurewebsites.net"
                  />
                </div>
                <div>
                  <Label htmlFor="azure-function-key">Function Key</Label>
                  <Input
                    id="azure-function-key"
                    type="password"
                    value={credentials.azure.functionKey}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      azure: { ...prev.azure, functionKey: e.target.value }
                    }))}
                    placeholder="function-key-here"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSwitchProvider('azure')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Switching...' : 'Switch to Azure'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleMigrateData('azure')}
                  disabled={isMigrating || status.current === 'azure'}
                >
                  {isMigrating ? 'Migrating...' : 'Migrate Data'}
                </Button>
              </div>
            </TabsContent>

            {/* GCP Configuration */}
            <TabsContent value="gcp" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gcp-project-id">Project ID</Label>
                  <Input
                    id="gcp-project-id"
                    value={credentials.gcp.projectId}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      gcp: { ...prev.gcp, projectId: e.target.value }
                    }))}
                    placeholder="haib-beauty-platform"
                  />
                </div>
                <div>
                  <Label htmlFor="gcp-region">Region</Label>
                  <Input
                    id="gcp-region"
                    value={credentials.gcp.region}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      gcp: { ...prev.gcp, region: e.target.value }
                    }))}
                    placeholder="us-central1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="gcp-endpoint">API Endpoint</Label>
                  <Input
                    id="gcp-endpoint"
                    value={credentials.gcp.apiEndpoint}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      gcp: { ...prev.gcp, apiEndpoint: e.target.value }
                    }))}
                    placeholder="https://your-service.run.app"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSwitchProvider('gcp')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Switching...' : 'Switch to Google Cloud'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleMigrateData('gcp')}
                  disabled={isMigrating || status.current === 'gcp'}
                >
                  {isMigrating ? 'Migrating...' : 'Migrate Data'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Cloud-Agnostic Architecture:</strong> This platform can dynamically switch between 
          different cloud providers without code changes. Data migration tools ensure smooth transitions 
          between Supabase, Azure, and Google Cloud Platform.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CloudProviderManager;