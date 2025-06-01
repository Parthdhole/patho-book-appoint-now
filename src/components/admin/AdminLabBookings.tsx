
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Lab {
  id: string;
  name: string;
  address?: string;
  phone?: string;
}

interface BookingWithLab {
  id: string;
  testName: string;
  labName?: string;
  labId?: number;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const AdminLabBookings = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [bookings, setBookings] = useState<BookingWithLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");

  const loadData = async () => {
    setLoading(true);
    
    // Load all labs
    const { data: labsData, error: labsError } = await supabase
      .from("labs")
      .select("id, name, address, phone")
      .order("name");

    if (labsError) {
      console.error("Error loading labs:", labsError);
    } else {
      setLabs(labsData || []);
    }

    // Load all bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Error loading bookings:", bookingsError);
    } else {
      const mappedBookings = (bookingsData || []).map((b: any) => ({
        id: b.id,
        testName: b.test_name,
        labName: b.lab_name,
        labId: b.lab_id,
        appointmentDate: b.appointment_date,
        appointmentTime: b.appointment_time,
        patientName: b.patient_name,
        patientPhone: b.patient_phone,
        patientEmail: b.patient_email,
        status: b.status,
        paymentStatus: b.payment_status,
        createdAt: b.created_at,
      }));
      setBookings(mappedBookings);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel("admin-lab-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "labs" }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "cancelled") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);
    
    if (!error) {
      toast.success(`Booking ${newStatus === "confirmed" ? "confirmed" : "cancelled"} successfully`);
    } else {
      toast.error(`Failed to ${newStatus === "confirmed" ? "confirm" : "cancel"} booking`);
    }
  };

  const getBookingsForLab = (labName?: string) => {
    if (!labName) return bookings.filter(b => !b.labName);
    return bookings.filter(b => b.labName === labName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === "pending" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800";
  };

  if (loading) return <div className="p-4">Loading labs and bookings...</div>;

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="labs">By Lab</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings ({bookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable 
                bookings={bookings} 
                onStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Bookings ({bookings.filter(b => b.status === "pending").length})</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable 
                bookings={bookings.filter(b => b.status === "pending")} 
                onStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Bookings ({bookings.filter(b => b.status === "confirmed").length})</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable 
                bookings={bookings.filter(b => b.status === "confirmed")} 
                onStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          {labs.map((lab) => {
            const labBookings = getBookingsForLab(lab.name);
            return (
              <Card key={lab.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{lab.name}</span>
                    <span className="text-sm font-normal text-gray-500">
                      {labBookings.length} bookings
                    </span>
                  </CardTitle>
                  {lab.address && (
                    <p className="text-sm text-gray-600">{lab.address}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <BookingTable 
                    bookings={labBookings} 
                    onStatusChange={handleStatusChange}
                    getStatusColor={getStatusColor}
                    getPaymentStatusColor={getPaymentStatusColor}
                  />
                </CardContent>
              </Card>
            );
          })}
          
          {/* Home collection bookings */}
          {getBookingsForLab().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Home Collection</span>
                  <span className="text-sm font-normal text-gray-500">
                    {getBookingsForLab().length} bookings
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable 
                  bookings={getBookingsForLab()} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getPaymentStatusColor={getPaymentStatusColor}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BookingTableProps {
  bookings: BookingWithLab[];
  onStatusChange: (id: string, status: "confirmed" | "cancelled") => void;
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
}

const BookingTable: React.FC<BookingTableProps> = ({ 
  bookings, 
  onStatusChange, 
  getStatusColor, 
  getPaymentStatusColor 
}) => {
  if (bookings.length === 0) {
    return <div className="text-center py-4 text-gray-500">No bookings found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Test</th>
            <th className="p-2 text-left">Lab</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Patient</th>
            <th className="p-2 text-left">Contact</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Payment</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{booking.testName}</td>
              <td className="p-2">{booking.labName || "Home Collection"}</td>
              <td className="p-2">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
              <td className="p-2">{booking.appointmentTime}</td>
              <td className="p-2">{booking.patientName}</td>
              <td className="p-2">
                <div className="text-xs">
                  <div>{booking.patientPhone}</div>
                  <div className="text-gray-500">{booking.patientEmail}</div>
                </div>
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </span>
              </td>
              <td className="p-2">
                <div className="flex gap-1 justify-center">
                  {booking.status === "pending" && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => onStatusChange(booking.id, "confirmed")}
                      className="text-xs px-2"
                    >
                      Confirm
                    </Button>
                  )}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => onStatusChange(booking.id, "cancelled")}
                      className="text-xs px-2"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLabBookings;
