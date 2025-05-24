
import React from "react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import AdminCardStats from "@/components/admin/AdminCardStats";
import PartnerApplications from "@/components/admin/PartnerApplications";
import BookingsTableAdmin from "@/components/admin/BookingsTableAdmin";

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
    <div className="max-w-5xl mx-auto mt-8 pb-16 px-4">
      <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
      <AdminCardStats />
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Partner Applications</h2>
          <PartnerApplications />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Bookings</h2>
          <BookingsTableAdmin />
        </div>
      </div>
    </div>
  );
}
