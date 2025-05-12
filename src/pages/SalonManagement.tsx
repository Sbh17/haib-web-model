
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeftIcon, SearchIcon, Building } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SalonRow from '@/components/SalonRow';

const SalonManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [salonToDelete, setSalonToDelete] = useState<Salon | null>(null);
  const [salonToEdit, setSalonToEdit] = useState<Salon | null>(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }
    
    const fetchSalons = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/admin/salons' } });
        return;
      }
      
      setIsLoading(true);
      try {
        const salonsData = await api.admin.getAllSalons();
        setSalons(salonsData);
      } catch (error) {
        console.error('Error fetching salons:', error);
        toast({
          title: "Error",
          description: "Failed to load salons data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalons();
  }, [user, isRole, navigate, toast]);
  
  const handleDeleteSalon = async () => {
    if (!salonToDelete) return;
    
    try {
      await api.admin.deleteSalon(salonToDelete.id);
      setSalons(salons.filter(s => s.id !== salonToDelete.id));
      
      toast({
        title: "Success",
        description: `Salon ${salonToDelete.name} has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete salon",
        variant: "destructive",
      });
    } finally {
      setSalonToDelete(null);
    }
  };
  
  // Filter salons based on search
  const filteredSalons = salons.filter(salon => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!user || !isRole('admin')) {
    // This will be handled by the useEffect redirect
    return null;
  }
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Salon Management</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search salons by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow">
            {filteredSalons.length > 0 ? (
              filteredSalons.map(salon => (
                <SalonRow
                  key={salon.id}
                  salon={salon}
                  onEdit={() => navigate(`/admin/salons/${salon.id}`)}
                  onDelete={() => setSalonToDelete(salon)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Building className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-center text-gray-500">No salons found</p>
                <p className="text-center text-gray-400 text-sm">
                  {searchQuery ? "Try a different search term" : "No salons available"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Salon Dialog */}
      <AlertDialog open={!!salonToDelete} onOpenChange={() => setSalonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Salon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {salonToDelete?.name}? This action cannot be undone
              and will remove all associated services, appointments, and reviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSalon}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalonManagement;
