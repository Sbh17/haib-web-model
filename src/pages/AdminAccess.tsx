import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAccess: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin access is being updated for the new authentication system.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;