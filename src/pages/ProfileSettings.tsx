import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileSettings: React.FC = () => {
  return (
    <div className="min-h-screen pt-4">
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Profile settings are being updated for the new authentication system.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;