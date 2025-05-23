
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types/booking";

// Map supabase row to Booking type
function mapBookingRow(row: any): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    testId: row.test_id,
    testName: row.test_name,
    labId: row.lab_id ?? undefined,
    labName: row.lab_name ?? undefined,
    appointmentDate: new Date(row.appointment_date),
    appointmentTime: row.appointment_time,
    patientName: row.patient_name,
    patientAge: row.patient_age,
    patientGender: row.patient_gender,
    patientPhone: row.patient_phone,
    patientEmail: row.patient_email,
    sampleType: row.sample_type,
    address: row.address ?? undefined,
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: new Date(row.created_at),
  }
}

/**
 * Real-time user bookings for "My Bookings" page.
 * Loads bookings for the logged-in user and keeps them up to date.
 */
export function useRealtimeBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Initial load
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order('created_at', { ascending: false });

      setBookings((data as any[] || []).map(mapBookingRow));
      setLoading(false);
    })();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("bookings:realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings"
        },
        (payload) => {
          setBookings((prev) => {
            let next = [...prev];
            if (payload.eventType === "INSERT") {
              next = [mapBookingRow(payload.new), ...next];
            }
            if (payload.eventType === "UPDATE") {
              next = next.map((b) =>
                b.id === payload.new.id ? mapBookingRow(payload.new) : b
              );
            }
            if (payload.eventType === "DELETE") {
              next = next.filter((b) => b.id !== payload.old.id);
            }
            // Only show bookings for this user
            return next.filter(
              (b) =>
                b.userId === userId
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { bookings, loading };
}
