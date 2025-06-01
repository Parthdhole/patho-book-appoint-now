
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingAdmin {
  id: string;
  testName: string;
  labName?: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientPhone: string;
  status: string;
  paymentStatus: string;
}

const BookingsTableAdmin = () => {
  const [bookings, setBookings] = useState<BookingAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, test_name, lab_name, appointment_date, appointment_time, patient_name, patient_phone, status, payment_status")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setBookings(data.map((b: any) => ({
        id: b.id,
        testName: b.test_name,
        labName: b.lab_name,
        appointmentDate: b.appointment_date,
        appointmentTime: b.appointment_time,
        patientName: b.patient_name,
        patientPhone: b.patient_phone,
        status: b.status,
        paymentStatus: b.payment_status,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
    const channel = supabase
      .channel("admin-bookings-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        loadBookings();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: "confirmed" | "cancelled") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) {
      toast.success(`Booking ${newStatus === "confirmed" ? "confirmed" : "cancelled"} successfully`);
    } else {
      toast.error(`Failed to ${newStatus === "confirmed" ? "confirm" : "cancel"} booking`);
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (!bookings.length) return <div>No bookings found.</div>;

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Test Name</th>
            <th className="p-2 text-left">Lab</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Patient</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Payment</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.testName}</td>
              <td className="p-2">{b.labName || "N/A"}</td>
              <td className="p-2">{new Date(b.appointmentDate).toLocaleDateString()}</td>
              <td className="p-2">{b.appointmentTime}</td>
              <td className="p-2">{b.patientName}</td>
              <td className="p-2">{b.patientPhone}</td>
              <td className="p-2 text-xs">
                <span className={"px-2 py-1 rounded " +
                  (b.status === "pending" ? "bg-yellow-100 text-yellow-800"
                  : b.status === "confirmed" ? "bg-blue-100 text-blue-800"
                  : b.status === "completed" ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800")}>
                  {b.status}
                </span>
              </td>
              <td className="p-2 text-xs">
                <span className={"px-2 py-1 rounded " +
                  (b.paymentStatus === "pending" ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800")}>
                  {b.paymentStatus}
                </span>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  {b.status === "pending" && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                      className="text-xs"
                    >
                      Confirm
                    </Button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleStatusChange(b.id, "cancelled")}
                      className="text-xs"
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

export default BookingsTableAdmin;
