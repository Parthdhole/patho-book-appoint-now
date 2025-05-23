
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types/booking";

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

      setBookings((data as Booking[]) || []);
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
              // Add new booking on top
              next = [payload.new as Booking, ...next];
            }
            if (payload.eventType === "UPDATE") {
              next = next.map((b) =>
                b.id === payload.new.id ? (payload.new as Booking) : b
              );
            }
            if (payload.eventType === "DELETE") {
              next = next.filter((b) => b.id !== payload.old.id);
            }
            // Only show bookings for this user
            return next.filter((b) => b.userId === userId || b.user_id === userId);
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
