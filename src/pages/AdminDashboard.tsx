
import React from "react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import AdminCardStats from "@/components/admin/AdminCardStats";
import PartnerApplications from "@/components/admin/PartnerApplications";
import AdminLabBookings from "@/components/admin/AdminLabBookings";
import AdminLabsManager from "@/components/admin/AdminLabsManager";
import AdminTestsManager from "@/components/admin/AdminTestsManager";

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
    <div className="max-w-7xl mx-auto mt-8 pb-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminCardStats />
      
      <div className="mt-8 space-y-8">
        {/* Comprehensive Booking Management */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
          <AdminLabBookings />
        </div>

        {/* Two column layout for other admin functions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Partner Applications</h2>
              <PartnerApplications />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Manage Labs</h2>
              <AdminLabsManager />
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Manage Tests</h2>
              <AdminTestsManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
