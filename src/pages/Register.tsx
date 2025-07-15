import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, ArrowLeft, Chrome, Facebook } from 'lucide-react';

const signUpSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, apostrophes, and hyphens')
    .refine(val => val.trim().split(' ').length >= 2, 'Please enter your first and last name'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const Register: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName.trim());
      if (!error) {
        // Success is handled by the auth context with toast
        // User will be redirected after email verification
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        console.error('Social sign in error:', error);
      }
    } catch (error) {
      console.error('Social sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-3 group">
            <ArrowLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="dior-label tracking-widest">Back</span>
          </Link>
          <div className="dior-heading-sm">HAIB</div>
          <Link to="/auth" className="dior-label tracking-widest hover:text-primary transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <Card className="luxury-card border-none shadow-xl">
            <CardHeader className="text-center pb-8">
              <h1 className="dior-heading-lg text-foreground mb-4">
                Create Your Account
              </h1>
              <p className="dior-body text-muted-foreground">
                Join HAIB and discover exceptional beauty experiences
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {/* Social Sign Up Options */}
              <div className="space-y-4 mb-8">
                <div className="text-center">
                  <p className="dior-label text-muted-foreground mb-4">Sign up with</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 hover:bg-accent/50"
                    onClick={() => handleSocialSignIn('google')}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    <span className="dior-label">Google</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 hover:bg-accent/50"
                    onClick={() => handleSocialSignIn('facebook')}
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    <span className="dior-label">Facebook</span>
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground dior-label">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dior-label text-foreground">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter your first and last name" 
                              className="beauty-input pl-12 h-12 text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dior-label text-foreground">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="email"
                              placeholder="Enter your email address" 
                              className="beauty-input pl-12 h-12 text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dior-label text-foreground">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Create a strong password" 
                              className="beauty-input pl-12 h-12 text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dior-label text-foreground">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Confirm your password" 
                              className="beauty-input pl-12 h-12 text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="dior-body-sm text-muted-foreground cursor-pointer">
                            I agree to the{' '}
                            <Link to="/terms" className="text-foreground underline hover:no-underline">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-foreground underline hover:no-underline">
                              Privacy Policy
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    variant="luxury" 
                    size="xl"
                    className="w-full h-12" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <LoadingSpinner />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </Form>

              {/* Sign In Link */}
              <div className="text-center mt-8 pt-6 border-t border-border">
                <p className="dior-body-sm text-muted-foreground mb-2">
                  Already have an account?
                </p>
                <Link to="/auth">
                  <Button variant="minimal" size="sm" className="tracking-wider">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;