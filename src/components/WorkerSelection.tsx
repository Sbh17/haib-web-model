
import React from 'react';
import { SalonWorker } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';

interface WorkerSelectionProps {
  workers: SalonWorker[];
  selectedWorkerId?: string;
  onWorkerSelect: (workerId: string | undefined) => void;
}

const WorkerSelection: React.FC<WorkerSelectionProps> = ({
  workers,
  selectedWorkerId,
  onWorkerSelect
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const activeWorkers = workers.filter(worker => worker.isActive);

  if (activeWorkers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Choose Your Preferred Worker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWorkerSelect(undefined)}
          className={!selectedWorkerId ? 'bg-beauty-primary text-white' : ''}
        >
          Any Available
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeWorkers.map((worker) => (
          <Card 
            key={worker.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedWorkerId === worker.id 
                ? 'ring-2 ring-beauty-primary bg-beauty-primary/5' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onWorkerSelect(worker.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={worker.avatar} />
                  <AvatarFallback className="bg-beauty-secondary text-white">
                    {getInitials(worker.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h4 className="font-medium">{worker.name}</h4>
                  {worker.specialty && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {worker.specialty}
                    </Badge>
                  )}
                  {worker.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {worker.bio}
                    </p>
                  )}
                </div>
                
                {selectedWorkerId === worker.id && (
                  <div className="w-6 h-6 rounded-full bg-beauty-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Select "Any Available" if you don't have a preference, or choose a specific worker you'd like to work with.
      </p>
    </div>
  );
};

export default WorkerSelection;
