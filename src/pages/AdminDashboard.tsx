import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { SalonRequest, Salon, User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp, 
  ArrowLeft,
  Check,
  X,
  Eye
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import SalonRequestCard from '@/components/SalonRequestCard';
import UserRow from '@/components/UserRow';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [salonRequests, setSalonRequests] = useState<SalonRequest[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSalons: 0,
    pendingRequests: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!user || !isRole(['admin'])) {
      navigate('/profile');
      return;
    }
  }, [user, isRole, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || !isRole(['admin'])) return;
      
      setIsLoading(true);
      try {
        const [requestsData, salonsData, usersData] = await Promise.all([
          api.admin.getSalonRequests(),
          api.salons.getAll(),
          api.admin.getAllUsers ? api.admin.getAllUsers() : Promise.resolve([])
        ]);
        
        setSalonRequests(requestsData);
        setSalons(salonsData);
        setUsers(usersData);
        
        // Calculate stats
        setStats({
          totalUsers: usersData.length,
          totalSalons: salonsData.length,
          pendingRequests: requestsData.filter(req => req.status === 'pending').length,
          totalRevenue: 0 // This would come from appointments/payments data
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [user, isRole, toast]);

  const handleApproveSalonRequest = async (requestId: string) => {
    try {
      await api.admin.approveSalonRequest(requestId);
      setSalonRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        )
      );
      toast({
        title: "Success",
        description: "Salon request approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve salon request",
        variant: "destructive",
      });
    }
  };

  const handleRejectSalonRequest = async (requestId: string) => {
    try {
      await api.admin.rejectSalonRequest(requestId, 'Rejected by admin');
      setSalonRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      );
      toast({
        title: "Success",
        description: "Salon request rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject salon request",
        variant: "destructive",
      });
    }
  };

  if (!user || !isRole(['admin'])) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingSalonRequests = salonRequests.filter(req => req.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground mb-4 hover:bg-white/10 -ml-2"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-light tracking-tight">Admin Dashboard</h1>
          <p className="opacity-90 font-light">Manage HAIB platform operations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Salons</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSalons}</div>
              <p className="text-xs text-muted-foreground">Active partners</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="salon-requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="salon-requests">
              Salon Requests
              {pendingSalonRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingSalonRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="salons">Salons</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Salon Requests Tab */}
          <TabsContent value="salon-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Salon Partnership Requests</CardTitle>
                <CardDescription>
                  Review and manage new salon applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingSalonRequests.length > 0 ? (
                  pendingSalonRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{request.name}</h3>
                          <p className="text-muted-foreground">{request.city}</p>
                          <p className="text-sm text-muted-foreground">
                            by {request.ownerName} • {request.ownerEmail}
                          </p>
                        </div>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                      
                      <p className="text-sm mb-4 text-muted-foreground">
                        {request.description}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveSalonRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectSalonRequest(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/salon-request/${request.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending salon requests
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salons Tab */}
          <TabsContent value="salons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Salons</CardTitle>
                <CardDescription>
                  Manage partner salons and their information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {salons.map((salon) => (
                    <div key={salon.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{salon.name}</h3>
                      <p className="text-sm text-muted-foreground">{salon.city}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm">⭐ {salon.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({salon.reviewCount} reviews)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-full"
                        onClick={() => navigate(`/salon/${salon.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Users</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <UserRow 
                        key={user.id} 
                        user={user}
                        onResetPassword={() => console.log('Reset password for:', user.id)}
                        onDelete={() => console.log('Delete user:', user.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AdminDashboard;