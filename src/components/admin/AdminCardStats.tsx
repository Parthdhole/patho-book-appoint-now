
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book, User, TestTube } from "lucide-react";

const AdminCardStats = () => {
  const [labCount, setLabCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch real lab count
      const { count: labsCount } = await supabase
        .from("labs")
        .select("id", { count: "exact", head: true });
      setLabCount(labsCount || 0);

      // Fetch real test count
      const { count: testsCount } = await supabase
        .from("tests")
        .select("id", { count: "exact", head: true });
      setTestCount(testsCount || 0);

      // Fetch real booking count
      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true });
      setBookingCount(bookingsCount || 0);
    };

    fetchStats();

    // Set up real-time subscriptions for stats updates
    const channel = supabase
      .channel("admin-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "labs" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "tests" }, fetchStats)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
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
