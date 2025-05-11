
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CheckIcon, StarIcon, ShieldIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PlanFeature {
  included: boolean;
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    description: 'Essential features for casual users',
    features: [
      { included: true, text: 'Book appointments' },
      { included: true, text: 'View salon profiles' },
      { included: true, text: 'Read reviews' },
      { included: false, text: 'Priority bookings' },
      { included: false, text: 'Exclusive discounts' },
      { included: false, text: 'Loyalty rewards' }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99/month',
    description: 'Enhanced features for regular clients',
    features: [
      { included: true, text: 'Book appointments' },
      { included: true, text: 'View salon profiles' },
      { included: true, text: 'Read reviews' },
      { included: true, text: 'Priority bookings' },
      { included: true, text: 'Exclusive discounts' },
      { included: false, text: 'Loyalty rewards' }
    ],
    highlighted: true
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '$19.99/month',
    description: 'Premium experience for dedicated clients',
    features: [
      { included: true, text: 'Book appointments' },
      { included: true, text: 'View salon profiles' },
      { included: true, text: 'Read reviews' },
      { included: true, text: 'Priority bookings' },
      { included: true, text: 'Exclusive discounts' },
      { included: true, text: 'Loyalty rewards' }
    ]
  }
];

const Subscriptions: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscribing, setSubscribing] = useState<string | null>(null);
  
  // Mock current subscription data - in a real app, this would come from your API
  const currentSubscription = {
    planId: 'basic',
    status: 'active',
    nextBillingDate: new Date('2025-06-11').toISOString()
  };
  
  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to subscribe to a plan",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectTo: '/subscriptions' } });
      return;
    }
    
    if (planId === currentSubscription.planId) {
      toast({
        title: "Already subscribed",
        description: "You are already subscribed to this plan",
      });
      return;
    }
    
    setSubscribing(planId);
    
    // Mock subscription process - in a real app, this would call your API
    setTimeout(() => {
      setSubscribing(null);
      
      toast({
        title: "Subscription updated",
        description: `You are now subscribed to the ${plans.find(p => p.id === planId)?.name} plan`,
      });
      
      // In a real app, you'd redirect to a payment page or confirmation page
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="pb-20">
      <header className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/profile')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Subscription Plans</h1>
      </header>
      
      <div className="p-6">
        {currentSubscription && (
          <Card className="mb-6 border-beauty-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-beauty-primary" />
                Current Plan: {plans.find(p => p.id === currentSubscription.planId)?.name}
              </CardTitle>
              <CardDescription>
                Status: <span className="text-green-600 font-medium">Active</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentSubscription.planId !== 'basic' && (
                <p className="text-sm text-gray-600">
                  Next billing date: {formatDate(currentSubscription.nextBillingDate)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "flex flex-col",
                plan.highlighted && "border-beauty-primary shadow-md"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted && (
                    <span className="bg-beauty-primary text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2 font-bold text-2xl">{plan.price}</div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 mr-2" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full",
                    currentSubscription.planId === plan.id
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-beauty-primary hover:bg-beauty-primary/90"
                  )}
                  disabled={subscribing !== null}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {subscribing === plan.id ? (
                    <LoadingSpinner size="sm" />
                  ) : currentSubscription.planId === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start">
            <ShieldIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Subscription Benefits</h3>
              <p className="text-sm text-gray-600">
                Premium and VIP members enjoy benefits like priority booking slots,
                exclusive discounts, and special promotions. Cancel anytime from your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Subscriptions;
