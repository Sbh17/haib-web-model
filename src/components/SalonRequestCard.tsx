
import React from 'react';
import { SalonRequest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPinIcon, UserIcon, PhoneIcon, MailIcon, CalendarIcon, ScissorsIcon } from 'lucide-react';
import { format } from 'date-fns';

interface SalonRequestCardProps {
  request: SalonRequest;
  onApprove?: () => void;
  onReject?: () => void;
}

const SalonRequestCard: React.FC<SalonRequestCardProps> = ({
  request,
  onApprove,
  onReject
}) => {
  const requestDate = new Date(request.createdAt);
  
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{request.name}</h3>
          <Badge 
            className={
              request.status === 'pending' ? 'bg-yellow-500' : 
              request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
            }
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">{request.description}</p>
        
        {request.images && request.images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Salon Images</p>
            <div className="grid grid-cols-3 gap-2">
              {request.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Salon ${index + 1}`} 
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
        
        {request.services && request.services.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Services Offered</p>
            <div className="space-y-2">
              {request.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <ScissorsIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{service.name} ({service.duration} min)</span>
                  </div>
                  <span className="font-medium">${service.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{request.address}, {request.city}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{request.ownerName}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MailIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{request.ownerEmail}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{request.ownerPhone}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Submitted on {format(requestDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex gap-3 mt-5">
            <Button 
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-red-500 border-red-500 hover:bg-red-50"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalonRequestCard;
