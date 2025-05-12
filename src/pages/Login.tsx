
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
import { InfoIcon } from 'lucide-react';

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
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-beauty-primary">BeautySpot</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-500" />
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
              style={{ backgroundColor: "#9b87f5" }}
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
