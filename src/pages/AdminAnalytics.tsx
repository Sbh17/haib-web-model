
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeftIcon, ChartBarIcon, Users, Boxes, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/services/api';
import { Appointment } from '@/types';

// Recharts components
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch appointments when component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const allAppointments = await api.appointments.getAll();
        setAppointments(allAppointments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load appointment data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [toast]);
  
  // Calculate statistics from appointment data
  const totalAppointments = appointments.length;
  const canceledAppointments = appointments.filter(app => app.status === 'cancelled').length;
  const cancelRate = totalAppointments > 0 
    ? Math.round((canceledAppointments / totalAppointments) * 100) 
    : 0;
    
  // Group cancellations by user
  const cancellationsByUser = appointments.reduce((acc: Record<string, number>, appointment) => {
    if (appointment.status === 'cancelled') {
      acc[appointment.userId] = (acc[appointment.userId] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Group cancellations by salon
  const cancellationsBySalon = appointments.reduce((acc: Record<string, number>, appointment) => {
    if (appointment.status === 'cancelled') {
      acc[appointment.salonId] = (acc[appointment.salonId] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Format data for charts
  const statusData = [
    { name: 'Confirmed', value: appointments.filter(app => app.status === 'confirmed').length },
    { name: 'Cancelled', value: canceledAppointments },
    { name: 'Completed', value: appointments.filter(app => app.status === 'completed').length },
    { name: 'Pending', value: appointments.filter(app => app.status === 'pending').length }
  ];
  
  // Mock data for revenue and appointments trends (in a real app, this would come from your API)
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5000 },
    { name: 'Mar', revenue: 6000 },
    { name: 'Apr', revenue: 8000 },
    { name: 'May', revenue: 7500 },
    { name: 'Jun', revenue: 9000 }
  ];

  const appointmentsData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 19 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 22 },
    { name: 'Fri', appointments: 30 },
    { name: 'Sat', appointments: 41 },
    { name: 'Sun', appointments: 26 }
  ];
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];
  
  // In a real app, these would be calculated from your data
  const totalRevenue = "$42,500";
  const totalCustomers = "89";
  const conversionRate = "68%";
  
  return (
    <div className="pb-6">
      <div className="bg-white p-6 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/admin/dashboard')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Date selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Business Performance</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Appointments
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canceled Appointments
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{canceledAppointments}</div>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> {cancelRate}% cancellation rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 5% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="revenue">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="cancellations">Cancellations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue generated over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#9b87f5" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Appointments</CardTitle>
                <CardDescription>
                  Number of appointments per day this week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#9b87f5" 
                      name="Appointments" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancellations">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status Distribution</CardTitle>
                <CardDescription>
                  Overview of appointment statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cancellations by Salon</CardTitle>
                  <CardDescription>
                    Number of canceled appointments per salon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p>Loading data...</p>
                  ) : Object.keys(cancellationsBySalon).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salon ID</TableHead>
                          <TableHead className="text-right">Cancellations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(cancellationsBySalon)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([salonId, count]) => (
                            <TableRow key={salonId}>
                              <TableCell>{salonId}</TableCell>
                              <TableCell className="text-right">{count}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No cancellation data available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cancellations by User</CardTitle>
                  <CardDescription>
                    Users with the most canceled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p>Loading data...</p>
                  ) : Object.keys(cancellationsByUser).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead className="text-right">Cancellations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(cancellationsByUser)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([userId, count]) => (
                            <TableRow key={userId}>
                              <TableCell>{userId}</TableCell>
                              <TableCell className="text-right">{count}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No cancellation data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;
