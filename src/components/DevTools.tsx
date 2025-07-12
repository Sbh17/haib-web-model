
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, CrownIcon, ShieldCheckIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import { UserRole } from '@/types';

const DevTools: React.FC = () => {
  const { user, profile } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  // Role switching temporarily disabled
  const handleRoleSwitch = (role: UserRole) => {
    console.log('Role switching disabled in new auth system');
  };

  const roles = [
    {
      key: 'admin' as UserRole,
      label: 'Admin',
      icon: CrownIcon,
      color: 'text-purple-500',
    },
    {
      key: 'salon_owner' as UserRole,
      label: 'Salon Owner',
      icon: ShieldCheckIcon,
      color: 'text-blue-500',
    },
    {
      key: 'user' as UserRole,
      label: 'Customer',
      icon: UserIcon,
      color: 'text-green-500',
    },
  ];

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🛠️ Role Switcher</span>
          {profile && (
            <Badge variant="outline" className="text-xs">
              {profile.role}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {profile && (
          <div className="text-xs text-muted-foreground mb-3">
            Current user: <span className="font-medium">{profile.full_name}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Switch Role:</p>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = profile?.role === role.key;
            
            return (
              <Button
                key={role.key}
                onClick={() => handleRoleSwitch(role.key)}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Icon className={`h-3 w-3 mr-2 ${role.color}`} />
                {role.label}
                {isActive && <ToggleRightIcon className="h-3 w-3 ml-auto" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevTools;
