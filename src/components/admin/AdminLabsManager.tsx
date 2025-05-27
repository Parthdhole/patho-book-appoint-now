
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Lab {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  rating?: number;
  hours?: string;
}

const AdminLabsManager = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    rating: "",
    hours: "",
  });

  useEffect(() => {
    setLoading(true);
    supabase
      .from("labs")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLabs(data || []);
        setLoading(false);
      });
    // Realtime updates
    const channel = supabase
      .channel("labs-admin-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "labs" },
        (payload) => {
          setLabs(prev => {
            let arr: Lab[] = [...prev];
            if (payload.eventType === "INSERT")
              arr = [payload.new as Lab, ...arr];
            else if (payload.eventType === "UPDATE")
              arr = arr.map(l => l.id === payload.new.id ? payload.new as Lab : l);
            else if (payload.eventType === "DELETE")
              arr = arr.filter(l => l.id !== payload.old.id);
            return arr;
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const { error } = await supabase.from("labs").insert({
      name: form.name,
      address: form.address || null,
      phone: form.phone || null,
      rating: form.rating ? Number(form.rating) : null,
      hours: form.hours || null,
    });
    if (!error) {
      setForm({ name: "", address: "", phone: "", rating: "", hours: "" });
    } else {
      alert("Error adding lab: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Add New Lab</h3>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            placeholder="Rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            type="number"
            min={0}
            max={5}
            step={0.1}
          />
          <Input
            placeholder="Hours"
            name="hours"
            value={form.hours}
            onChange={handleChange}
          />
          <Button type="submit">Add Lab</Button>
        </form>
      </Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">All Labs</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {labs.map(lab => (
              <Card key={lab.id} className="p-2">
                <div className="font-bold">{lab.name}</div>
                <div className="text-xs text-muted-foreground">{lab.address}</div>
                <div className="text-xs">{lab.phone}</div>
                <div className="text-xs">Rating: {lab.rating ?? "—"} / 5</div>
                <div className="text-xs">Hours: {lab.hours ?? "—"}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLabsManager;
