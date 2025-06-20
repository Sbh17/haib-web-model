
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, UserIcon, ShieldCheckIcon, CrownIcon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate('/home');
    } catch (error) {
      // Error is handled in the AuthContext
      console.error('Login error:', error);
    }
  };

  const quickLogin = async (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-beauty-primary">BeautySpot</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        {/* Quick Login Buttons for Development */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 text-center">Quick Login (Development)</p>
          <div className="space-y-2">
            <Button
              onClick={() => quickLogin('admin@beautyspot.com', 'admin123')}
              variant="outline"
              className="w-full justify-start text-left"
              disabled={isLoading}
            >
              <CrownIcon className="h-4 w-4 mr-2 text-purple-500" />
              Sign in as Admin
            </Button>
            <Button
              onClick={() => quickLogin('salon1@example.com', 'owner123')}
              variant="outline"
              className="w-full justify-start text-left"
              disabled={isLoading}
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2 text-blue-500" />
              Sign in as Salon Owner
            </Button>
            <Button
              onClick={() => quickLogin('user@example.com', 'user123')}
              variant="outline"
              className="w-full justify-start text-left"
              disabled={isLoading}
            >
              <UserIcon className="h-4 w-4 mr-2 text-green-500" />
              Sign in as Customer
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>
        
        <Alert className="mb-6 bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800">
          <InfoIcon className="h-4 w-4 text-beauty-primary" />
          <AlertDescription>
            <p className="text-sm mb-2 font-semibold">Demo Accounts:</p>
            <ul className="text-xs space-y-1">
              <li><span className="font-medium">Admin:</span> admin@beautyspot.com / admin123</li>
              <li><span className="font-medium">Salon Owner:</span> salon1@example.com / owner123</li>
              <li><span className="font-medium">User:</span> user@example.com / user123</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      type="email" 
                      className="beauty-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      className="beauty-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-beauty-primary hover:bg-beauty-primary/90 text-white font-medium shadow-md"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </Button>
          </form>
        </Form>
        
        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-beauty-primary font-medium">
            Sign up
          </Link>
        </p>
        
        <div className="mt-8 text-center">
          <Link to="/salon-request" className="text-beauty-secondary font-medium text-sm">
            Request to list your salon
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
