import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeftIcon, Shield, Eye, Download, Trash2, Bell, MapPin, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

const PrivacySettings: React.FC = () => {
  const { toast } = useToast();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    locationSharing: false,
    activityStatus: true,
    marketingEmails: false,
    dataCollection: true,
    thirdPartySharing: false,
  });

  const handleSettingChange = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Setting updated",
      description: "Your privacy preference has been saved.",
    });
  };

  const handleDataDownload = () => {
    toast({
      title: "Feature coming soon",
      description: "Data download will be available in a future update.",
    });
  };

  const handleDataDeletion = () => {
    toast({
      title: "Feature coming soon",
      description: "Data deletion request will be available in a future update.",
    });
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto min-h-screen bg-background">
      <header className="bg-beauty-primary dark:bg-beauty-dark text-white p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-4 hover:bg-white/10 -ml-2"
          asChild
        >
          <Link to="/profile-settings">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Profile Settings
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Privacy Settings</h1>
          <p className="opacity-90">Control your privacy and data preferences</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Profile Privacy */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Profile Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your profile information
                </p>
              </div>
              <Switch
                checked={privacySettings.profileVisibility}
                onCheckedChange={() => handleSettingChange('profileVisibility')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Activity Status</p>
                <p className="text-sm text-muted-foreground">
                  Show when you're active or last seen
                </p>
              </div>
              <Switch
                checked={privacySettings.activityStatus}
                onCheckedChange={() => handleSettingChange('activityStatus')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Services */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Share your location for better salon recommendations
                </p>
              </div>
              <Switch
                checked={privacySettings.locationSharing}
                onCheckedChange={() => handleSettingChange('locationSharing')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communications */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Receive promotional offers and updates
                </p>
              </div>
              <Switch
                checked={privacySettings.marketingEmails}
                onCheckedChange={() => handleSettingChange('marketingEmails')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics & Personalization</p>
                <p className="text-sm text-muted-foreground">
                  Help us improve your experience with usage data
                </p>
              </div>
              <Switch
                checked={privacySettings.dataCollection}
                onCheckedChange={() => handleSettingChange('dataCollection')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Third-party Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Share data with partner services for enhanced features
                </p>
              </div>
              <Switch
                checked={privacySettings.thirdPartySharing}
                onCheckedChange={() => handleSettingChange('thirdPartySharing')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Rights */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Your Data Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleDataDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download My Data
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Your Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your personal data from our servers. 
                      This action cannot be undone and you will lose access to your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDataDeletion}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete My Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Download includes all your profile data, appointments, and preferences</p>
              <p>• Data deletion requests are processed within 30 days</p>
              <p>• Some data may be retained for legal or security purposes</p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Information */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>Privacy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <Link to="#" className="text-beauty-primary hover:underline">
                Privacy Policy
              </Link>
              {' • '}
              <Link to="#" className="text-beauty-primary hover:underline">
                Cookie Policy
              </Link>
              {' • '}
              <Link to="#" className="text-beauty-primary hover:underline">
                Data Processing Agreement
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: December 2024. We're committed to protecting your privacy and 
              giving you control over your personal information.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default PrivacySettings;