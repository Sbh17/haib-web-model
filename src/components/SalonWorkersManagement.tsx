
import React, { useState, useEffect } from 'react';
import { SalonWorker } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusIcon, EditIcon, TrashIcon, UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const workerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

interface SalonWorkersManagementProps {
  salonId: string;
  workers: SalonWorker[];
  onWorkersChange: (workers: SalonWorker[]) => void;
}

const SalonWorkersManagement: React.FC<SalonWorkersManagementProps> = ({
  salonId,
  workers,
  onWorkersChange
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<SalonWorker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      specialty: '',
      bio: '',
      phone: '',
      email: '',
    },
  });

  const handleAddWorker = () => {
    setEditingWorker(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEditWorker = (worker: SalonWorker) => {
    setEditingWorker(worker);
    form.reset({
      name: worker.name,
      specialty: worker.specialty || '',
      bio: worker.bio || '',
      phone: worker.phone || '',
      email: worker.email || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteWorker = (workerId: string) => {
    const updatedWorkers = workers.filter(w => w.id !== workerId);
    onWorkersChange(updatedWorkers);
    
    toast({
      title: "Worker removed",
      description: "The worker has been removed from your salon.",
    });
  };

  const onSubmit = async (data: z.infer<typeof workerSchema>) => {
    setIsSubmitting(true);
    try {
      if (editingWorker) {
        // Update existing worker
        const updatedWorkers = workers.map(w => 
          w.id === editingWorker.id 
            ? { ...w, ...data, updatedAt: new Date().toISOString() }
            : w
        );
        onWorkersChange(updatedWorkers);
        
        toast({
          title: "Worker updated",
          description: "Worker information has been updated successfully.",
        });
      } else {
        // Add new worker
        const newWorker: SalonWorker = {
          id: `worker-${Date.now()}`,
          salonId,
          ...data,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        onWorkersChange([...workers, newWorker]);
        
        toast({
          title: "Worker added",
          description: "New worker has been added to your salon.",
        });
      }
      
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save worker information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Salon Workers</h2>
          <p className="text-muted-foreground">Manage your salon staff members</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddWorker}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorker ? 'Edit Worker' : 'Add New Worker'}
              </DialogTitle>
              <DialogDescription>
                {editingWorker 
                  ? 'Update worker information below.' 
                  : 'Add a new staff member to your salon.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Worker's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hair Stylist, Nail Technician" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description about the worker..." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingWorker ? 'Update' : 'Add Worker')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <Card key={worker.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={worker.avatar} />
                  <AvatarFallback className="bg-beauty-primary text-white">
                    {getInitials(worker.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                  {worker.specialty && (
                    <Badge variant="secondary" className="mt-1">
                      {worker.specialty}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {worker.bio && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {worker.bio}
                </p>
              )}
              
              <div className="space-y-1 text-sm">
                {worker.phone && (
                  <p className="text-muted-foreground">📞 {worker.phone}</p>
                )}
                {worker.email && (
                  <p className="text-muted-foreground">✉️ {worker.email}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditWorker(worker)}
                >
                  <EditIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteWorker(worker.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {workers.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No workers added yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first staff member to start managing your salon team.
              </p>
              <Button onClick={handleAddWorker}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Worker
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalonWorkersManagement;
