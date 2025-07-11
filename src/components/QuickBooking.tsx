
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Appointment, Salon, Service } from '@/types';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const QuickBooking: React.FC = () => {
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentAppointments();
    }
  }, [user]);

  const fetchRecentAppointments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [appointments, allSalons, allServices] = await Promise.all([
        api.appointments.getMyAppointments(user.id),
        api.salons.getAll(),
        api.services.getServiceCategories()
      ]);
      
      // Get last 3 completed appointments
      const completed = appointments
        .filter(apt => apt.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      
      setRecentAppointments(completed);
      setSalons(allSalons);
    } catch (error) {
      console.error('Error fetching recent appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSalonName = (salonId: string) => {
    const salon = salons.find(s => s.id === salonId);
    return salon?.name || 'Unknown Salon';
  };

  const handleQuickBook = (appointment: Appointment) => {
    // Store the appointment details for quick booking
    const quickBookData = {
      salonId: appointment.salonId,
      serviceId: appointment.serviceId,
      workerId: appointment.workerId,
      fromQuickBook: true
    };
    localStorage.setItem('quickBookData', JSON.stringify(quickBookData));
  };

  if (!user || recentAppointments.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center mb-4">
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <Repeat className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Quick Booking</h3>
          <p className="text-sm text-gray-600">Book your usual appointments quickly</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {recentAppointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-sm">{getSalonName(appointment.salonId)}</h4>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Last visit: {new Date(appointment.date).toLocaleDateString()}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Same service & time preference</span>
                </div>
              </div>
              
              <Link 
                to={`/book/${appointment.salonId}/${appointment.serviceId}`}
                state={{ quickBookData: appointment }}
                onClick={() => handleQuickBook(appointment)}
              >
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  Book Again
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <Link to="/search">
          <Button variant="ghost" size="sm" className="w-full">
            Browse All Salons
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default QuickBooking;
