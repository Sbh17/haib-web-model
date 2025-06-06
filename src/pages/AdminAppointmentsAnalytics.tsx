
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  DollarSignIcon,
  StarIcon,
  DownloadIcon
} from 'lucide-react';
import { AppointmentAnalytics } from '@/types';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const COLORS = ['#000000', '#404040', '#808080', '#C0C0C0', '#F5F5F5'];

const AdminAppointmentsAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AppointmentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (user && !isRole('admin')) {
      navigate('/');
      return;
    }

    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Mock analytics data - in real app, this would come from API
        const mockAnalytics: AppointmentAnalytics = {
          totalAppointments: 1250,
          completedAppointments: 987,
          cancelledAppointments: 125,
          pendingAppointments: 138,
          revenue: 45670,
          averageRating: 4.6,
          topSalons: [
            { salonName: "Glamour Studio", appointmentCount: 245, revenue: 12300 },
            { salonName: "Style Haven", appointmentCount: 198, revenue: 9870 },
            { salonName: "Beauty Palace", appointmentCount: 167, revenue: 8450 },
            { salonName: "Trendy Cuts", appointmentCount: 143, revenue: 7200 },
            { salonName: "Elegance Spa", appointmentCount: 112, revenue: 5600 }
          ],
          monthlyData: [
            { month: 'Jan', appointments: 156, revenue: 7800 },
            { month: 'Feb', appointments: 189, revenue: 9450 },
            { month: 'Mar', appointments: 234, revenue: 11700 },
            { month: 'Apr', appointments: 198, revenue: 9900 },
            { month: 'May', appointments: 267, revenue: 13350 },
            { month: 'Jun', appointments: 245, revenue: 12250 }
          ]
        };
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, isRole, navigate, toast, timeRange]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being prepared for download.",
    });
  };

  if (!user || !isRole('admin')) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" className="mx-auto" />
      </div>
    );
  }

  const statusData = analytics ? [
    { name: 'Completed', value: analytics.completedAppointments, color: '#000000' },
    { name: 'Pending', value: analytics.pendingAppointments, color: '#404040' },
    { name: 'Cancelled', value: analytics.cancelledAppointments, color: '#808080' }
  ] : [];

  return (
    <div className="pb-6">
      <div className="bg-white p-6 shadow-sm flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Appointments Analytics</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="p-6">
        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((analytics.completedAppointments / analytics.totalAppointments) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">+3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <StarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageRating}</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="salons">Top Salons</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments vs Revenue Trend</CardTitle>
                    <CardDescription>Monthly comparison of appointment volume and revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analytics.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="appointments" fill="#000000" name="Appointments" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#404040" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Salons</CardTitle>
                    <CardDescription>Ranked by appointment volume and revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topSalons.map((salon, index) => (
                        <div key={salon.salonName} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-beauty-primary text-white flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{salon.salonName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {salon.appointmentCount} appointments
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${salon.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsAnalytics;
