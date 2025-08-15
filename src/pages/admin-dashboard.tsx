import { useState } from "react";
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data - would come from Supabase in real implementation
  const stats = [
    { title: "Total Bookings", value: "156", change: "+12%", icon: Calendar },
    { title: "Revenue", value: "$45,230", change: "+8%", icon: DollarSign },
    { title: "Occupancy Rate", value: "87%", change: "+5%", icon: Bed },
    { title: "Guest Satisfaction", value: "4.8/5", change: "+0.2", icon: Users }
  ];

  const recentBookings = [
    { id: "BK001", guest: "John Smith", room: "Deluxe Suite", checkin: "2024-01-15", status: "confirmed" },
    { id: "BK002", guest: "Sarah Johnson", room: "Standard Room", checkin: "2024-01-16", status: "pending" },
    { id: "BK003", guest: "Mike Davis", room: "Executive Suite", checkin: "2024-01-17", status: "confirmed" },
    { id: "BK004", guest: "Emily Wilson", room: "Deluxe Room", checkin: "2024-01-18", status: "cancelled" }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show login message if not authenticated (this would be handled by Supabase auth)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              This dashboard requires Supabase authentication with admin role verification.
            </p>
            <Button onClick={() => setIsAuthenticated(true)} className="w-full">
              Simulate Admin Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-green-600">{stat.change}</span>
                    <span className="text-sm text-muted-foreground"> from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{booking.guest}</h4>
                        <p className="text-sm text-muted-foreground">{booking.room} • Check-in: {booking.checkin}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'default' : 
                            booking.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Room availability and maintenance tracking would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle>Guest Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Guest profiles and preferences would be managed here.</p>
              </CardContent>
            </Card>
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
  );
}