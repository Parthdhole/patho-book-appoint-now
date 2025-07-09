
import React from "react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import AdminCardStats from "@/components/admin/AdminCardStats";
import PartnerApplications from "@/components/admin/PartnerApplications";
import AdminLabBookings from "@/components/admin/AdminLabBookings";
import AdminLabsManager from "@/components/admin/AdminLabsManager";
import AdminTestsManager from "@/components/admin/AdminTestsManager";
import AdminUsersManager from "@/components/admin/AdminUsersManager";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminCardStats />
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="bookings">
          <AdminLabBookings />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersManager />
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <AdminLabsManager />
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <AdminTestsManager />
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <PartnerApplications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
