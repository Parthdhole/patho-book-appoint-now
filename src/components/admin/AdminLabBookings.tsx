
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookingWithLab {
  id: string;
  testName: string;
  labName?: string;
  labId?: number;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientAge?: number;
  patientPhone: string;
  patientEmail: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  userId: string;
}

const AdminLabBookings = () => {
  const [bookings, setBookings] = useState<BookingWithLab[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const loadData = async () => {
    console.log("Loading admin bookings data...");
    setLoading(true);

    // Load ALL bookings (not filtered by user)
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Error loading bookings:", bookingsError);
    } else {
      console.log("Loaded bookings:", bookingsData?.length);
      const mappedBookings = (bookingsData || []).map((b: any) => ({
        id: b.id,
        testName: b.test_name,
        labName: b.lab_name,
        labId: b.lab_id,
        appointmentDate: b.appointment_date,
        appointmentTime: b.appointment_time,
        patientName: b.patient_name,
        patientAge: b.patient_age,
        patientPhone: b.patient_phone,
        patientEmail: b.patient_email,
        status: b.status,
        paymentStatus: b.payment_status,
        createdAt: b.created_at,
        userId: b.user_id,
      }));
      setBookings(mappedBookings);
      setFilteredBookings(mappedBookings);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Set up real-time subscriptions for immediate updates
    const channel = supabase
      .channel("admin-all-bookings-realtime")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bookings"
      }, (payload) => {
        console.log("Real-time booking update:", payload);
        loadData(); // Reload all data when any booking changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Filter bookings based on search query and selected tab
    let filtered = bookings;

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter(b => b.status === selectedTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.patientPhone.includes(searchQuery) ||
        (b.labName && b.labName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, selectedTab]);

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "cancelled" | "completed") => {
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);

    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (!error) {
      toast.success(`Booking ${newStatus === "confirmed" ? "confirmed" : newStatus === "completed" ? "completed" : "cancelled"} successfully`);
      // Data will be automatically updated via real-time subscription
    } else {
      console.error("Error updating booking:", error);
      toast.error(`Failed to ${newStatus} booking`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    return (
      <Badge variant={status === "pending" ? "outline" : "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) return <div className="p-4">Loading all bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All User Bookings</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredBookings.length} of {bookings.length} bookings
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by patient name, test, email, phone, or lab..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bookings.filter(b => b.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({bookings.filter(b => b.status === "confirmed").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({bookings.filter(b => b.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({bookings.filter(b => b.status === "cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTab === "all" ? "All Bookings" : `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Bookings`} 
                ({filteredBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No bookings match your search" : "No bookings found"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test & Lab</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.testName}</div>
                              <div className="text-sm text-gray-500">
                                {booking.labName || "Home Collection"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.patientName}</div>
                              <div className="text-sm text-gray-500">
                                Age: {booking.patientAge || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.patientPhone}</div>
                              <div className="text-gray-500">{booking.patientEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {new Date(booking.appointmentDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">{booking.appointmentTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(booking.id, "confirmed")}
                                  className="text-xs"
                                >
                                  Confirm
                                </Button>
                              )}
                              {(booking.status === "pending" || booking.status === "confirmed") && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusChange(booking.id, "cancelled")}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              )}
                              {booking.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(booking.id, "completed")}
                                  className="text-xs"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLabBookings;
