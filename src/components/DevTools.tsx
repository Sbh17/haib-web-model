
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, CrownIcon, ShieldCheckIcon, LogOutIcon } from 'lucide-react';

const DevTools: React.FC = () => {
  const { login, logout, user, isLoading } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const quickLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🛠️ Dev Tools</span>
          {user && (
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {user ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Signed in as: <span className="font-medium">{user.name}</span>
            </p>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isLoading}
            >
              <LogOutIcon className="h-3 w-3 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Quick Login:</p>
            <Button
              onClick={() => quickLogin('admin@beautyspot.com', 'admin123')}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              disabled={isLoading}
            >
              <CrownIcon className="h-3 w-3 mr-2 text-purple-500" />
              Admin
            </Button>
            <Button
              onClick={() => quickLogin('salon1@example.com', 'owner123')}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              disabled={isLoading}
            >
              <ShieldCheckIcon className="h-3 w-3 mr-2 text-blue-500" />
              Salon Owner
            </Button>
            <Button
              onClick={() => quickLogin('user@example.com', 'user123')}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              disabled={isLoading}
            >
              <UserIcon className="h-3 w-3 mr-2 text-green-500" />
              Customer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DevTools;
