
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { User, SalonRequest } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeftIcon, SearchIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import UserRow from '@/components/UserRow';
import SalonRequestCard from '@/components/SalonRequestCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [salonRequests, setSalonRequests] = useState<SalonRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>('');
  const [requestSearch, setRequestSearch] = useState<string>('');
  
  // Dialog states
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [requestToApprove, setRequestToApprove] = useState<SalonRequest | null>(null);
  const [requestToReject, setRequestToReject] = useState<SalonRequest | null>(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/admin/dashboard' } });
        return;
      }
      
      setIsLoading(true);
      try {
        const [usersData, requestsData] = await Promise.all([
          api.admin.getAllUsers(),
          api.admin.getSalonRequests()
        ]);
        
        setUsers(usersData);
        setSalonRequests(requestsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load administrative data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, isRole, navigate, toast]);
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await api.admin.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      
      toast({
        title: "Success",
        description: `User ${userToDelete.name} has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };
  
  const handleResetPassword = async () => {
    if (!userToReset) return;
    
    try {
      await api.admin.resetUserPassword(userToReset.id);
      
      toast({
        title: "Success",
        description: `Password reset link sent to ${userToReset.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setUserToReset(null);
    }
  };
  
  const handleApproveRequest = async () => {
    if (!requestToApprove) return;
    
    try {
      await api.admin.approveSalonRequest(requestToApprove.id);
      
      // Update local state
      setSalonRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestToApprove.id
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      toast({
        title: "Success",
        description: `Salon request for ${requestToApprove.name} has been approved`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve request",
        variant: "destructive",
      });
    } finally {
      setRequestToApprove(null);
    }
  };
  
  const handleRejectRequest = async () => {
    if (!requestToReject) return;
    
    try {
      await api.admin.rejectSalonRequest(requestToReject.id);
      
      // Update local state
      setSalonRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestToReject.id
            ? { ...req, status: 'rejected' }
            : req
        )
      );
      
      toast({
        title: "Success",
        description: `Salon request for ${requestToReject.name} has been rejected`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setRequestToReject(null);
    }
  };
  
  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  
  // Filter salon requests based on search and status
  const filteredRequests = salonRequests.filter(r => 
    r.name.toLowerCase().includes(requestSearch.toLowerCase()) ||
    r.ownerName.toLowerCase().includes(requestSearch.toLowerCase()) ||
    r.ownerEmail.toLowerCase().includes(requestSearch.toLowerCase())
  );
  
  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const processedRequests = filteredRequests.filter(r => r.status !== 'pending');
  
  if (!user || !isRole('admin')) {
    // This will be handled by the useEffect redirect
    return null;
  }
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/profile')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : (
        <Tabs defaultValue="users" className="p-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="requests">Salon Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="mb-4 relative">
              <Input
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pr-10"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="bg-white rounded-lg border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onResetPassword={() => setUserToReset(user)}
                    onDelete={() => setUserToDelete(user)}
                  />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No users found</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="requests">
            <div className="mb-4 relative">
              <Input
                placeholder="Search salon requests..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="pr-10"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <Tabs defaultValue="pending">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processed">Processed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map(request => (
                      <SalonRequestCard
                        key={request.id}
                        request={request}
                        onApprove={() => setRequestToApprove(request)}
                        onReject={() => setRequestToReject(request)}
                      />
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-500">No pending requests</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="processed">
                <div className="space-y-4">
                  {processedRequests.length > 0 ? (
                    processedRequests.map(request => (
                      <SalonRequestCard
                        key={request.id}
                        request={request}
                      />
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-500">No processed requests</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Delete User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reset Password Dialog */}
      <AlertDialog open={!!userToReset} onOpenChange={() => setUserToReset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for {userToReset?.name}?
              A password reset link will be sent to their email address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Approve Request Dialog */}
      <AlertDialog open={!!requestToApprove} onOpenChange={() => setRequestToApprove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Salon Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the salon request for {requestToApprove?.name}?
              This will create a salon owner account and list the salon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApproveRequest}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Request Dialog */}
      <AlertDialog open={!!requestToReject} onOpenChange={() => setRequestToReject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Salon Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the salon request for {requestToReject?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectRequest}
              className="bg-red-500 hover:bg-red-600"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
