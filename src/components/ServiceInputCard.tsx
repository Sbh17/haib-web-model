
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { SalonRequestService } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Update to use the interface from our types file
export type ServiceInput = SalonRequestService;

interface ServiceInputCardProps {
  service: ServiceInput;
  index: number;
  control: Control<any>;
  onRemove: () => void;
}

const ServiceInputCard: React.FC<ServiceInputCardProps> = ({
  service,
  index,
  control,
  onRemove
}) => {
  const { isRole } = useAuth();
  const isAdmin = isRole('admin');

  return (
    <Card className="relative mt-4">
      <Button 
        type="button"
        variant="ghost" 
        size="icon"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`services.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Haircut" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={control}
              name={`services.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Price ($)
                    {!isAdmin && <Lock className="h-3 w-3 ml-1 text-gray-400" />}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="25.00" 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      readOnly={!isAdmin}
                      className={!isAdmin ? "bg-gray-100 cursor-not-allowed" : ""}
                    />
                  </FormControl>
                  {!isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      Only administrators can set prices
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name={`services.${index}.duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (min)</FormLabel>
                  <FormControl>
                    <Input placeholder="30" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={control}
          name={`services.${index}.description`}
          render={({ field }) => (
            <FormItem className="mt-3">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this service..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceInputCard;
