import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnhancedProfileSettings: React.FC = () => {
  return (
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
  );
};

export default EnhancedProfileSettings;