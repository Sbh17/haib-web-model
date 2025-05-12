
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const handleAdminLogin = async () => {
    try {
      // Since this is a mock system, we're using hardcoded credentials
      await login('admin@beautyspot.com', 'admin123');
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Could not log in as admin",
        variant: "destructive",
      });
      console.error('Admin login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Log in with admin privileges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm">Admin credentials:</p>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p><span className="font-semibold">Email:</span> admin@beautyspot.com</p>
              <p><span className="font-semibold">Password:</span> admin123</p>
            </div>
          </div>
          
          <Button 
            onClick={handleAdminLogin} 
            className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
            style={{ backgroundColor: "#9b87f5" }}
          >
            Sign In as Admin
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            This is a development feature. In production, you would set up proper authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;
