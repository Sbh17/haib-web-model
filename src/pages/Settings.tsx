
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftIcon, BellIcon, MoonIcon, SunIcon } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useTheme } from '@/context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      <header className="bg-beauty-primary text-white p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-4 hover:bg-white/10 -ml-2"
          asChild
        >
          <Link to="/profile">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="opacity-90">Customize your app experience</p>
      </header>

      <main className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Appearance</CardTitle>
            <CardDescription>Customize how BeautySpot looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <SunIcon className="h-5 w-5 text-orange-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-blue-400" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-beauty-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your appointments
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-beauty-primary" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about promotions and news
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About BeautySpot</CardTitle>
            <CardDescription>App information and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Version: 1.0.0</p>
            <p className="text-sm">
              <Link to="#" className="text-beauty-primary hover:underline">
                Terms of Service
              </Link>
            </p>
            <p className="text-sm">
              <Link to="#" className="text-beauty-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="text-sm">
              <Link to="#" className="text-beauty-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
