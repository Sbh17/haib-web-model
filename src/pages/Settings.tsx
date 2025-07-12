import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftIcon, BellIcon, Monitor } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ThemeToggle from '@/components/ThemeToggle';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useTheme } from '@/context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="pb-20 max-w-5xl mx-auto min-h-screen bg-background">
      <header className="bg-beauty-primary dark:bg-beauty-dark text-white p-6">
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="opacity-90">Customize your app experience</p>
          </div>
          <ThemeToggle className="text-white hover:bg-white/20" />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">Appearance</CardTitle>
            <CardDescription>Customize how HAIB looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Theme Preference</h4>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                  <span className="text-sm">Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-600"></div>
                  <span className="text-sm">Dark</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Monitor className="w-6 h-6" />
                  <span className="text-sm">System</span>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quick Theme Toggle</p>
                <p className="text-sm text-muted-foreground">
                  Current theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <NotificationSettings />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About HAIB</CardTitle>
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
