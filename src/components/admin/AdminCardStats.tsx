
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book, User, TestTube } from "lucide-react";

const AdminCardStats = () => {
  const [labCount, setLabCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    // Labs mock: labs table doesn't exist, demo count
    setLabCount(6); // Update logic if you add a labs table!

    // Tests mock: tests table doesn't exist, demo count
    setTestCount(14); // Update logic if you add a tests table!

    // Real-time bookings count
    const fetchBookings = async () => {
      const { count } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true });
      setBookingCount(count || 0);
    };
    fetchBookings();

    // Optional: Add real-time count using channels if wanted
    const channel = supabase
      .channel("admin-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchBookings)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const statCards = [
    {
      label: "Labs",
      count: labCount,
      icon: <Book className="h-6 w-6 text-blue-600" />
    },
    {
      label: "Tests",
      count: testCount,
      icon: <TestTube className="h-6 w-6 text-indigo-600" />
    },
    {
      label: "Bookings",
      count: bookingCount,
      icon: <User className="h-6 w-6 text-green-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((c) => (
        <div key={c.label} className="bg-white rounded shadow flex p-4 gap-4 items-center">
          <div>{c.icon}</div>
          <div>
            <div className="text-2xl font-bold">{c.count}</div>
            <div className="text-gray-600">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCardStats;
