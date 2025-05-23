
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to check if the current user has the 'admin' role.
 * Returns { isAdmin: boolean, loading: boolean }
 */
export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkRole() {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      const user_id = session.session?.user?.id;
      if (!user_id) {
        isMounted && setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user_id);

      if (!error && data && data.some((r) => r.role === "admin")) {
        isMounted && setIsAdmin(true);
      } else {
        isMounted && setIsAdmin(false);
      }
      setLoading(false);
    }

    checkRole();
    return () => {
      isMounted = false;
    };
  }, []);

  return { isAdmin, loading };
}
