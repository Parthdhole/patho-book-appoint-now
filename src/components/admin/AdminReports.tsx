
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  topTests: Array<{ name: string; count: number; revenue: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
}

const AdminReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadReportData = async () => {
    setLoading(true);
    
    try {
      // Get all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*");

      // Get all tests for pricing info
      const { data: tests, error: testsError } = await supabase
        .from("tests")
        .select("*");

      if (bookingsError || testsError) {
        console.error("Error loading report data");
        return;
      }

      // Calculate metrics
      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;

      // Calculate revenue (assuming completed bookings)
      const totalRevenue = bookings?.reduce((sum, booking) => {
        if (booking.status === 'completed') {
          const test = tests?.find(t => t.id === booking.test_id);
          return sum + (test?.cost || 0);
        }
        return sum;
      }, 0) || 0;

      const averageBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0;

      // Top tests
      const testCounts: { [key: string]: { count: number; revenue: number; name: string } } = {};
      bookings?.forEach(booking => {
        if (booking.status === 'completed') {
          const test = tests?.find(t => t.id === booking.test_id);
          if (test) {
            if (!testCounts[test.id]) {
              testCounts[test.id] = { count: 0, revenue: 0, name: test.name };
            }
            testCounts[test.id].count++;
            testCounts[test.id].revenue += test.cost;
          }
        }
      });

      const topTests = Object.values(testCounts)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Monthly revenue (last 6 months)
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const monthBookings = bookings?.filter(b => {
          if (b.status !== 'completed') return false;
          const bookingDate = new Date(b.created_at);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }) || [];
        
        const monthRevenue = monthBookings.reduce((sum, booking) => {
          const test = tests?.find(t => t.id === booking.test_id);
          return sum + (test?.cost || 0);
        }, 0);
        
        monthlyRevenue.push({ 
          month, 
          revenue: monthRevenue, 
          bookings: monthBookings.length 
        });
      }

      setReportData({
        totalRevenue,
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        averageBookingValue,
        topTests,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error loading report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const exportReport = () => {
    if (!reportData) return;
    
    const reportContent = `
Lab Management System - Report
Generated on: ${new Date().toLocaleDateString()}

SUMMARY METRICS:
- Total Revenue: ₹${reportData.totalRevenue.toLocaleString()}
- Total Bookings: ${reportData.totalBookings}
- Completed Bookings: ${reportData.completedBookings}
- Pending Bookings: ${reportData.pendingBookings}
- Cancelled Bookings: ${reportData.cancelledBookings}
- Average Booking Value: ₹${reportData.averageBookingValue.toFixed(2)}

TOP PERFORMING TESTS:
${reportData.topTests.map(test => 
  `- ${test.name}: ${test.count} bookings, ₹${test.revenue} revenue`
).join('\n')}

MONTHLY PERFORMANCE:
${reportData.monthlyRevenue.map(month => 
  `- ${month.month}: ₹${month.revenue} revenue, ${month.bookings} bookings`
).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report exported successfully");
  };

  if (loading || !reportData) {
    return <div className="p-4">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Admin Reports & Analytics
        </h2>
        <Button onClick={exportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{reportData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {reportData.completedBookings} completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{reportData.averageBookingValue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per completed booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reportData.pendingBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((reportData.completedBookings / reportData.totalBookings) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.topTests.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-gray-500">{test.count} bookings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{test.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.monthlyRevenue.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium">{month.month}</div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">{month.bookings}</span> bookings
                  </div>
                  <div className="font-bold text-green-600">
                    ₹{month.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
