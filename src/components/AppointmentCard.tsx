
import React from 'react';
import { Appointment, Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentCardProps {
  appointment: Appointment;
  service: Service;
  salonName: string;
  onCancel?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  service, 
  salonName, 
  onCancel 
}) => {
  const appointmentDate = new Date(appointment.date);
  
  const statusColor = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
    completed: "bg-blue-500",
  };
  
  return (
    <Card className="hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{service.name}</h3>
          <Badge className={statusColor[appointment.status]}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">{salonName}</p>
        
        <div className="flex items-center mt-3 text-sm">
          <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
          <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center mt-1 text-sm">
          <ClockIcon className="w-4 h-4 mr-1 text-gray-500" />
          <span>{format(appointmentDate, 'h:mm a')}</span>
          <span className="mx-1">•</span>
          <span>{service.duration} min</span>
        </div>
        
        {appointment.notes && (
          <p className="text-sm mt-2 italic text-gray-500">{appointment.notes}</p>
        )}
        
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel?.();
              }}
            >
              Cancel Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
