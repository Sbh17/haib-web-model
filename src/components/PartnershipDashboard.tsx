import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gift,
  Sparkles,
  Building2,
  MessageCircle,
  Phone
} from 'lucide-react';

interface PartnershipStatus {
  status: 'pending' | 'under_review' | 'approved' | 'active';
  submittedAt: string;
  reviewProgress: number;
  estimatedApproval?: string;
}

interface PartnershipDashboardProps {
  partnershipStatus?: PartnershipStatus;
}

const PartnershipDashboard: React.FC<PartnershipDashboardProps> = ({ 
  partnershipStatus = {
    status: 'under_review',
    submittedAt: '2024-01-15',
    reviewProgress: 75,
    estimatedApproval: '2024-01-25'
  }
}) => {
  const [activeTab, setActiveTab] = useState('status');

  const statusConfig = {
    pending: {
      title: 'Application Pending',
      description: 'Your application is in queue for review',
      color: 'bg-beauty-warning',
      icon: Clock
    },
    under_review: {
      title: 'Under Premium Review',
      description: 'Our partnership team is evaluating your salon',
      color: 'bg-beauty-info',
      icon: Star
    },
    approved: {
      title: 'Partnership Approved!',
      description: 'Welcome to our VIP network',
      color: 'bg-beauty-success',
      icon: CheckCircle2
    },
    active: {
      title: 'Active VIP Partner',
      description: 'Your salon is live on our platform',
      color: 'bg-beauty-success',
      icon: Crown
    }
  };

  const currentStatus = statusConfig[partnershipStatus.status];
  const StatusIcon = currentStatus.icon;

  const reviewSteps = [
    { step: 'Application Received', completed: true, description: 'Initial submission reviewed' },
    { step: 'Salon Verification', completed: partnershipStatus.reviewProgress >= 25, description: 'Business credentials validated' },
    { step: 'Quality Assessment', completed: partnershipStatus.reviewProgress >= 50, description: 'Service standards evaluation' },
    { step: 'Partnership Approval', completed: partnershipStatus.reviewProgress >= 75, description: 'Final review and approval' },
    { step: 'VIP Onboarding', completed: partnershipStatus.status === 'active', description: 'Welcome to the network' }
  ];

  const vipBenefits = [
    { 
      title: 'Premium Listing Priority', 
      description: 'Top placement in search results',
      value: 'Active',
      active: partnershipStatus.status === 'active'
    },
    { 
      title: 'Professional Photography', 
      description: 'Complimentary salon photoshoot',
      value: 'Scheduled',
      active: partnershipStatus.status === 'active'
    },
    { 
      title: 'Marketing Campaign Features', 
      description: 'Featured in promotional materials',
      value: 'Included',
      active: partnershipStatus.status === 'active'
    },
    { 
      title: 'Dedicated Success Manager', 
      description: '24/7 priority support channel',
      value: 'Sarah M.',
      active: partnershipStatus.status === 'active'
    }
  ];

  const upcomingPerks = [
    {
      title: 'Exclusive Industry Event Invitation',
      description: 'Annual Beauty Excellence Gala - Premium networking event',
      date: 'March 15, 2024',
      type: 'event'
    },
    {
      title: 'Business Growth Workshop',
      description: 'Advanced marketing strategies for beauty businesses',
      date: 'February 20, 2024',
      type: 'workshop'
    },
    {
      title: 'VIP Partner Rewards Program',
      description: 'Earn rewards for client satisfaction and bookings',
      date: 'Available Now',
      type: 'program'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beauty-cream to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-beauty-primary" />
            <h1 className="dior-heading-lg text-beauty-primary">VIP Partnership Hub</h1>
          </div>
          <p className="dior-body text-beauty-secondary">
            Track your partnership status and access exclusive benefits
          </p>
        </div>

        {/* Status Card */}
        <Card className="luxury-card mb-8 p-8">
          <CardContent className="p-0">
            <div className="flex items-start gap-6">
              <div className={`${currentStatus.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                <StatusIcon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="dior-heading-md text-beauty-primary mb-2">
                  {currentStatus.title}
                </h2>
                <p className="dior-body text-beauty-secondary mb-4">
                  {currentStatus.description}
                </p>
                
                {partnershipStatus.status !== 'active' && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="dior-body-sm text-beauty-secondary">Review Progress</span>
                      <span className="dior-body-sm text-beauty-primary font-medium">
                        {partnershipStatus.reviewProgress}%
                      </span>
                    </div>
                    <Progress value={partnershipStatus.reviewProgress} className="h-3" />
                  </div>
                )}
                
                {partnershipStatus.estimatedApproval && (
                  <div className="flex items-center gap-2 text-beauty-secondary">
                    <Calendar className="w-4 h-4" />
                    <span className="dior-body-sm">
                      Estimated completion: {partnershipStatus.estimatedApproval}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Support
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  VIP Line
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-beauty-cream/50">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="perks">Exclusive Perks</TabsTrigger>
            <TabsTrigger value="support">VIP Support</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            {/* Review Steps */}
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="dior-heading-sm text-beauty-primary flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Partnership Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviewSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-beauty-success text-white' : 'bg-beauty-secondary/20 text-beauty-secondary'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`dior-heading-sm mb-1 ${
                          step.completed ? 'text-beauty-primary' : 'text-beauty-secondary'
                        }`}>
                          {step.step}
                        </h4>
                        <p className={`dior-body-sm ${
                          step.completed ? 'text-beauty-secondary' : 'text-beauty-secondary/60'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {step.completed && (
                        <Badge variant="secondary" className="bg-beauty-success/10 text-beauty-success border-beauty-success/20">
                          Complete
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vipBenefits.map((benefit, index) => (
                <Card key={index} className={`luxury-card ${benefit.active ? 'border-beauty-success/30' : 'opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="dior-heading-sm text-beauty-primary mb-2">
                          {benefit.title}
                        </h3>
                        <p className="dior-body-sm text-beauty-secondary">
                          {benefit.description}
                        </p>
                      </div>
                      <Badge 
                        variant={benefit.active ? 'default' : 'secondary'}
                        className={benefit.active ? 'bg-beauty-success text-white' : ''}
                      >
                        {benefit.active ? benefit.value : 'Pending'}
                      </Badge>
                    </div>
                    {benefit.active && (
                      <div className="flex items-center gap-2 text-beauty-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="dior-body-sm">Active & Available</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="perks" className="space-y-6">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="dior-heading-sm text-beauty-primary flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Exclusive VIP Perks & Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingPerks.map((perk, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-beauty-cream/30 rounded-lg">
                      <div className="bg-gradient-dior w-10 h-10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="dior-heading-sm text-beauty-primary mb-1">
                          {perk.title}
                        </h4>
                        <p className="dior-body-sm text-beauty-secondary mb-2">
                          {perk.description}
                        </p>
                        <div className="flex items-center gap-2 text-beauty-secondary">
                          <Calendar className="w-4 h-4" />
                          <span className="dior-body-sm">{perk.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="dior-heading-sm text-beauty-primary">
                    VIP Support Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-beauty-cream/30 rounded">
                    <Phone className="w-5 h-5 text-beauty-primary" />
                    <div>
                      <p className="dior-body-sm font-medium">VIP Priority Line</p>
                      <p className="dior-body-sm text-beauty-secondary">+1 (555) VIP-SALON</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-beauty-cream/30 rounded">
                    <MessageCircle className="w-5 h-5 text-beauty-primary" />
                    <div>
                      <p className="dior-body-sm font-medium">Live Chat Support</p>
                      <p className="dior-body-sm text-beauty-secondary">24/7 Premium Support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="luxury-card bg-gradient-dior text-white">
                <CardHeader>
                  <CardTitle className="dior-heading-sm text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Success Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="dior-heading-sm text-white mb-2">Sarah Martinez</h3>
                    <p className="dior-body-sm text-white/80 mb-4">Your Dedicated Success Manager</p>
                    <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnershipDashboard;