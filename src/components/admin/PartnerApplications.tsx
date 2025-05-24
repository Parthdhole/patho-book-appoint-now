
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface PartnerApplication {
  id: string;
  lab_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  certifications?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

const PartnerApplications = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        // Filter out rows that do not match the expected shape
        setApplications(
          (data as PartnerApplication[] | null)?.filter((row): row is PartnerApplication =>
            !!row &&
            typeof row.id === "string" &&
            typeof row.lab_name === "string" &&
            typeof row.owner_name === "string" &&
            typeof row.email === "string" &&
            typeof row.phone === "string" &&
            typeof row.address === "string" &&
            typeof row.city === "string" &&
            typeof row.status === "string" &&
            typeof row.created_at === "string"
          ) ?? []
        );
        setLoading(false);
      });

    // Real-time subscription — fix for async cleanup
    const channel = supabase
      .channel("partner-apps-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "partner_applications" }, (payload) => {
        setApplications((prev) => {
          let arr: PartnerApplication[] = [...prev];
          if (payload.eventType === "INSERT") arr = [payload.new as PartnerApplication, ...arr];
          else if (payload.eventType === "UPDATE")
            arr = arr.map((a) => (a.id === payload.new.id ? payload.new as PartnerApplication : a));
          else if (payload.eventType === "DELETE")
            arr = arr.filter((a) => a.id !== payload.old.id);
          return arr;
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChangeStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("partner_applications")
      .update({ status })
      .eq("id", id);
    if (!error) {
      toast.success(`Application ${status === "approved" ? "approved" : "rejected"} successfully`);
    } else {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!applications.length) return <div>No partner applications yet.</div>;

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-4 flex flex-col gap-2">
          <div>
            <div className="font-bold">{app.lab_name}</div>
            <div className="text-gray-500 text-sm">Owner: {app.owner_name}</div>
            <div className="text-xs mt-1">Email: {app.email}</div>
            <div className="text-xs">Phone: {app.phone}</div>
            <div className="text-xs">City: {app.city}</div>
            {!!app.certifications && <div className="text-xs">Certifications: {app.certifications}</div>}
            {!!app.message && <div className="text-xs">Message: {app.message}</div>}
            <div className={"inline-block text-xs px-2 py-1 rounded " + (app.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : app.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            )}>
              Status: {app.status}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {app.status === "pending" && (
              <>
                <Button size="sm" onClick={() => handleChangeStatus(app.id, "approved")}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => handleChangeStatus(app.id, "rejected")}>Reject</Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PartnerApplications;
