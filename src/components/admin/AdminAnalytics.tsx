
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Calendar, TestTube, Lab } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalBookings: number;
  totalLabs: number;
  totalTests: number;
  bookingsByStatus: Array<{ name: string; value: number }>;
  bookingsByMonth: Array<{ month: string; bookings: number }>;
  popularTests: Array<{ name: string; count: number }>;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    
    try {
      // Get user count
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id", { count: 'exact' });

      // Get booking count
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*");

      // Get lab count
      const { data: labs, error: labsError } = await supabase
        .from("labs")
        .select("id", { count: 'exact' });

      // Get test count
      const { data: tests, error: testsError } = await supabase
        .from("tests")
        .select("id", { count: 'exact' });

      if (profilesError || bookingsError || labsError || testsError) {
        console.error("Error loading analytics data");
        return;
      }

      // Process booking data
      const bookingsByStatus = [
        { name: 'Pending', value: bookings?.filter(b => b.status === 'pending').length || 0 },
        { name: 'Confirmed', value: bookings?.filter(b => b.status === 'confirmed').length || 0 },
        { name: 'Completed', value: bookings?.filter(b => b.status === 'completed').length || 0 },
        { name: 'Cancelled', value: bookings?.filter(b => b.status === 'cancelled').length || 0 },
      ];

      // Bookings by month (last 6 months)
      const bookingsByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const monthBookings = bookings?.filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }).length || 0;
        
        bookingsByMonth.push({ month, bookings: monthBookings });
      }

      // Popular tests
      const testCounts: { [key: string]: number } = {};
      bookings?.forEach(booking => {
        testCounts[booking.test_name] = (testCounts[booking.test_name] || 0) + 1;
      });
      
      const popularTests = Object.entries(testCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalUsers: profiles?.length || 0,
        totalBookings: bookings?.length || 0,
        totalLabs: labs?.length || 0,
        totalTests: tests?.length || 0,
        bookingsByStatus,
        bookingsByMonth,
        popularTests,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return <div className="p-4">Loading analytics...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labs</CardTitle>
            <Lab className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLabs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTests}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.popularTests} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
