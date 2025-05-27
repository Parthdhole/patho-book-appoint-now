
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Lab {
  id: string;
  name: string;
}
interface Test {
  id: string;
  name: string;
  description?: string;
  cost: number;
  lab_id?: string;
  created_at?: string;
}

const AdminTestsManager = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    cost: "",
    lab_id: "",
  });

  useEffect(() => {
    // Fetch labs for dropdown
    supabase.from("labs").select("id, name").then(({ data }) => {
      setLabs(data || []);
    });
    setLoading(true);
    supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTests(data || []);
        setLoading(false);
      });
    // Real-time updates
    const channel = supabase
      .channel("tests-admin-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tests" },
        (payload) => {
          setTests((prev) => {
            let arr: Test[] = [...prev];
            if (payload.eventType === "INSERT")
              arr = [payload.new as Test, ...arr];
            else if (payload.eventType === "UPDATE")
              arr = arr.map((t) => (t.id === payload.new.id ? payload.new as Test : t));
            else if (payload.eventType === "DELETE")
              arr = arr.filter((t) => t.id !== payload.old.id);
            return arr;
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const { error } = await supabase.from("tests").insert({
      name: form.name,
      description: form.description || null,
      cost: form.cost ? Number(form.cost) : 0,
      lab_id: form.lab_id || null,
    });
    if (!error) {
      setForm({ name: "", description: "", cost: "", lab_id: "" });
      toast.success("Test added successfully!");
    } else {
      toast.error("Error adding test: " + error.message);
    }
  };

  const handleDelete = async (testId: string, testName: string) => {
    if (!window.confirm(`Are you sure you want to delete test "${testName}"?`)) return;
    const { error } = await supabase.from("tests").delete().eq("id", testId);
    if (!error) {
      toast.success("Test deleted.");
    } else {
      toast.error("Failed to delete test.");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Add New Test</h3>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Test Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            placeholder="Cost"
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            required
            min={0}
          />
          <select
            name="lab_id"
            value={form.lab_id}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Select Lab (optional)</option>
            {labs.map((lab) => (
              <option value={lab.id} key={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
          <Button type="submit">Add Test</Button>
        </form>
      </Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">All Tests</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {tests.map((test) => (
              <Card key={test.id} className="p-2 flex items-start justify-between">
                <div>
                  <div className="font-bold">{test.name}</div>
                  <div className="text-xs">{test.description}</div>
                  <div className="text-xs">Cost: ₹{test.cost}</div>
                  <div className="text-xs">
                    Lab: {labs.find((l) => l.id === test.lab_id)?.name || "Unassigned"}
                  </div>
                </div>
                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(test.id, test.name)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestsManager;
