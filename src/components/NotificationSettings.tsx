import React, { useEffect, useState } from 'react';
import { PushNotificationService } from '@/services/pushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are already enabled
    const token = PushNotificationService.getStoredToken();
    if (token) {
      setNotificationsEnabled(true);
      setPushToken(token);
    }
  }, []);

  const handleEnableNotifications = async () => {
    try {
      const success = await PushNotificationService.requestPermissions();
      if (success) {
        setNotificationsEnabled(true);
        const token = PushNotificationService.getStoredToken();
        setPushToken(token);
        toast({
          title: "Notifications Enabled",
          description: "You'll receive appointment reminders 30 minutes before your scheduled time.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your device settings to receive appointment reminders.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          Appointment Reminders
        </CardTitle>
        <CardDescription>
          Get notified 30 minutes before your appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationsEnabled ? (
          <div className="space-y-2">
            <p className="text-sm text-green-600">✅ Notifications are enabled</p>
            {pushToken && (
              <p className="text-xs text-muted-foreground">
                Token: {pushToken.substring(0, 20)}...
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable push notifications to receive appointment reminders on your mobile device.
            </p>
            <Button onClick={handleEnableNotifications} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};