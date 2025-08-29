import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Salon, Appointment, Service, SalonWorker } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  MapPin,
  Star
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppointmentCard from '@/components/AppointmentCard';
import ServiceCard from '@/components/ServiceCard';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  
  const [mySalons, setMySalons] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<SalonWorker[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    monthlyRevenue: 0,
    totalServices: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not salon owner
  useEffect(() => {
    if (!user || !isRole(['salon_owner'])) {
      navigate('/profile');
      return;
    }
  }, [user, isRole, navigate]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!user || !isRole(['salon_owner'])) return;
      
      setIsLoading(true);
      try {
        // Get all salons and filter by owner (this would be API filtered in real app)
        const allSalons = await api.salons.getAll();
        const ownedSalons = allSalons.filter(salon => salon.ownerId === user.id);
        setMySalons(ownedSalons);
        
        if (ownedSalons.length > 0) {
          const firstSalon = ownedSalons[0];
          setSelectedSalon(firstSalon);
          
          // Fetch data for the first salon
          const [salonServices, salonWorkers] = await Promise.all([
            api.services.getForSalon(firstSalon.id),
            api.salons.getWorkers(firstSalon.id)
          ]);
          
          setServices(salonServices);
          setWorkers(salonWorkers);
          
          // Calculate stats
          setStats({
            totalAppointments: 0, // Would come from appointments API
            monthlyRevenue: 0, // Would come from payments API
            totalServices: salonServices.length,
            averageRating: firstSalon.rating
          });
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
        toast({
          title: "Error",
          description: "Failed to load salon dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerData();
  }, [user, isRole, toast]);

  const handleSalonSelect = async (salon: Salon) => {
    setSelectedSalon(salon);
    
    try {
      const [salonServices, salonWorkers] = await Promise.all([
        api.services.getForSalon(salon.id),
        api.salons.getWorkers(salon.id)
      ]);
      
      setServices(salonServices);
      setWorkers(salonWorkers);
      
      setStats({
        totalAppointments: 0,
        monthlyRevenue: 0,
        totalServices: salonServices.length,
        averageRating: salon.rating
      });
    } catch (error) {
      console.error('Error fetching salon data:', error);
    }
  };

  if (!user || !isRole(['salon_owner'])) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (mySalons.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground mb-4 hover:bg-white/10 -ml-2"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-3xl font-light tracking-tight">Salon Owner Dashboard</h1>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-6 text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No Salons Found</h2>
          <p className="text-muted-foreground mb-8">
            You don't have any salons registered yet. Submit a salon request to get started.
          </p>
          <Button
            onClick={() => navigate('/salon-request')}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Request to Add Salon
          </Button>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground mb-4 hover:bg-white/10 -ml-2"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-light tracking-tight">Salon Owner Dashboard</h1>
          <p className="opacity-90 font-light">Manage your beauty business</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Salon Selector */}
        {mySalons.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Salon</CardTitle>
              <CardDescription>Choose which salon to manage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mySalons.map((salon) => (
                  <div
                    key={salon.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSalon?.id === salon.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSalonSelect(salon)}
                  >
                    <h3 className="font-semibold">{salon.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {salon.city}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {salon.rating.toFixed(1)} ({salon.reviewCount} reviews)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedSalon && (
          <>
            {/* Current Salon Info */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedSalon.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedSalon.address}, {selectedSalon.city}
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/salon/${selectedSalon.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Salon
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalServices}</div>
                  <p className="text-xs text-muted-foreground">Active services</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="workers">Staff</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Services</CardTitle>
                      <CardDescription>
                        Manage your salon's service offerings
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <ServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No services available. Add some services to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Appointments</CardTitle>
                    <CardDescription>
                      View and manage your salon's appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div key={appointment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">Service Appointment</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.date}
                                </p>
                                <Badge variant="outline" className="mt-2">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No appointments scheduled
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Workers Tab */}
              <TabsContent value="workers" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Staff Members</CardTitle>
                      <CardDescription>
                        Manage your salon's team
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {workers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workers.map((worker) => (
                          <div key={worker.id} className="border rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium">
                                  {worker.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm">{worker.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {worker.specialty}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              Edit Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No staff members added yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default OwnerDashboard;