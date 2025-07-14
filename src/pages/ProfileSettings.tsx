import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen">
      {/* Pinned Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Logo width={100} height={32} />
      </div>

      {/* Content */}
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