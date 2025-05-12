
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { User } from '@/types';
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
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>('');
  
  // Dialog states
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/admin/users' } });
        return;
      }
      
      setIsLoading(true);
      try {
        const usersData = await api.admin.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load users data",
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
  
  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  
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
          onClick={() => navigate('/admin/dashboard')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">User Management</h1>
      </div>
      
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : (
        <div className="p-6">
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
        </div>
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
    </div>
  );
};

export default AdminUsers;
