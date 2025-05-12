import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Appointment, Service, Salon } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import AppointmentCard from '@/components/AppointmentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from '@/components/ui/use-toast';

interface FullAppointment {
  appointment: Appointment;
  service: Service;
  salon: Salon;
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<FullAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        navigate('/login', { state: { redirectTo: '/appointments' } });
        return;
      }
      
      setIsLoading(true);
      try {
        // Get user appointments - pass user ID
        const userAppointments = await api.appointments.getMyAppointments(user.id);
        
        // Get salon and service details for each appointment
        const fullAppointments = await Promise.all(
          userAppointments.map(async (appointment) => {
            const salon = await api.salons.getById(appointment.salonId);
            const services = await api.services.getForSalon(appointment.salonId);
            const service = services.find(s => s.id === appointment.serviceId);
            
            if (!service) {
              throw new Error(`Service not found for appointment: ${appointment.id}`);
            }
            
            return {
              appointment,
              service,
              salon
            };
          })
        );
        
        setAppointments(fullAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user, navigate, toast]);
  
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    try {
      await api.appointments.cancelAppointment(appointmentToCancel);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(item => 
          item.appointment.id === appointmentToCancel
            ? {
                ...item,
                appointment: {
                  ...item.appointment,
                  status: 'cancelled'
                }
              }
            : item
        )
      );
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setAppointmentToCancel(null);
    }
  };
  
  // Group appointments by status
  const upcomingAppointments = appointments.filter(
    item => ['pending', 'confirmed'].includes(item.appointment.status)
  );
  
  const pastAppointments = appointments.filter(
    item => ['completed', 'cancelled'].includes(item.appointment.status)
  );
  
  if (!user) {
    // This will be handled by the useEffect redirect
    return null;
  }
  
  return (
    <div className="pb-20">
      <header className="bg-white p-6 pt-12 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">My Appointments</h1>
        <p className="text-gray-500">View and manage your bookings</p>
      </header>
      
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-6 text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any appointments yet</p>
          <button
            onClick={() => navigate('/search')}
            className="text-beauty-primary font-medium"
          >
            Explore salons and book a service
          </button>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="p-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(({ appointment, service, salon }) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    service={service}
                    salonName={salon.name}
                    onCancel={() => setAppointmentToCancel(appointment.id)}
                  />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No upcoming appointments
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(({ appointment, service, salon }) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    service={service}
                    salonName={salon.name}
                  />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No past appointments
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <AlertDialog open={!!appointmentToCancel} onOpenChange={() => setAppointmentToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelAppointment}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Appointments;
