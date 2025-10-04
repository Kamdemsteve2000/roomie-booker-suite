import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Bed, 
  Settings,
  LogOut,
  Bell,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import RoomsManager from "@/components/admin/RoomsManager";
import BookingsManager from "@/components/admin/BookingsManager";
import GuestsManager from "@/components/admin/GuestsManager";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchMetrics();
      fetchBookings();
    }
  }, [userRole]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const formattedMetrics = data.map(metric => ({
          title: metric.metric_label || metric.metric_type,
          value: metric.metric_type === 'revenue' ? `$${metric.metric_value.toLocaleString()}` : 
                 metric.metric_type === 'occupancy' ? `${metric.metric_value}%` : 
                 metric.metric_type === 'satisfaction' ? `${metric.metric_value}/5` : 
                 metric.metric_value.toString(),
          change: "+12%", // Placeholder for now
          icon: metric.metric_type === 'bookings' ? Calendar : 
                metric.metric_type === 'revenue' ? DollarSign :
                metric.metric_type === 'occupancy' ? Bed : Users
        }));
        setMetrics(formattedMetrics);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms(name, type),
          profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Grand Luxe Hotel</h1>
              <p className="text-sm text-muted-foreground">Administrator Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.title}</p>
                          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-green-600">{metric.change}</span>
                        <span className="text-sm text-muted-foreground"> from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingsManager />
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <RoomsManager />
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <GuestsManager />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-subtle rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Revenue Trends</h4>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">15% increase this quarter</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-subtle rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Occupancy Rate</h4>
                    <div className="flex items-center text-blue-600">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">87% average this month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}