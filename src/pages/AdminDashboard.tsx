
import React from "react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminRole();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Checking admin permissions...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-semibold text-red-600">
        Access denied: Admins only
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Manage labs, tests, and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button className="w-full" onClick={() => navigate("/admin/tests")}>
              View Tests
            </Button>
            <Button className="w-full" onClick={() => navigate("/admin/labs")}>
              View Labs
            </Button>
            <Button className="w-full" onClick={() => navigate("/admin/bookings")}>
              View Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
