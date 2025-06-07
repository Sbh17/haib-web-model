
import React, { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Appointment } from '@/types';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const AppointmentReminder: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUpcomingAppointments();
    }
  }, [user]);

  const fetchUpcomingAppointments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const appointments = await api.appointments.getMyAppointments(user.id);
      const now = new Date();
      const upcoming = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 24 && appointment.status === 'confirmed';
      });
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeUntil = (date: string) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    const hoursDiff = Math.round((appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursDiff < 1) {
      const minutesDiff = Math.round((appointmentDate.getTime() - now.getTime()) / (1000 * 60));
      return `in ${minutesDiff} minutes`;
    }
    return `in ${hoursDiff} hours`;
  };

  if (!user || upcomingAppointments.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center mb-3">
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Bell className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900">Upcoming Appointments</h3>
          <p className="text-sm text-blue-700">Don't forget about your appointments!</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-3 rounded-lg border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="text-xs mr-2">
                    {formatTimeUntil(appointment.date)}
                  </Badge>
                  <span className="text-sm font-medium">
                    {new Date(appointment.date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>Salon appointment</span>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{appointment.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Link to="/appointments">
                <Button size="sm" variant="outline" className="text-xs">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-100">
        <Link to="/appointments">
          <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-800">
            View All Appointments
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default AppointmentReminder;
