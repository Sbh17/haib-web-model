import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Crown, Users, Shield, Code } from 'lucide-react';

const DevMockSignIn: React.FC = () => {
  const { mockSignIn } = useAuth();
  
  // Mock salon owners from mock data
  const salonOwners = [
    { name: "John Owner", email: "salon1@example.com", salon: "Elegant Beauty" },
    { name: "Sarah Thompson", email: "sarah.owner@example.com", salon: "Glamour Studio" },
    { name: "Alex Rodriguez", email: "alex.owner@example.com", salon: "Beauty Haven" }
  ];

  return (
    <section className="py-8 px-6 bg-muted/10 border-t border-b border-orange-200">
      <div className="max-w-4xl mx-auto">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Code className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-800">Development Tools</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              Quick mock sign-in for testing different user roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Admin */}
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-2">Admin User</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => mockSignIn('admin')}
                  className="w-full"
                >
                  Sign in as Admin
                </Button>
              </div>

              {/* Regular User */}
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-2">Regular User</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => mockSignIn('user')}
                  className="w-full"
                >
                  Sign in as User
                </Button>
              </div>

              {/* Salon Owners */}
              {salonOwners.slice(0, 2).map((owner, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-background border border-border">
                  <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-sm mb-1">{owner.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{owner.salon}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => mockSignIn('salon_owner')}
                    className="w-full"
                  >
                    Sign in as Owner
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                These mock sign-ins are for development and testing purposes only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DevMockSignIn;