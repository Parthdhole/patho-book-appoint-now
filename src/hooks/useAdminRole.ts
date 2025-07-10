
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
      try {
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();
        const user_id = session.session?.user?.id;
        
        if (!user_id) {
          console.log("No user found in session");
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        console.log("Checking admin role for user:", user_id);

        // Use RPC call to check user role with explicit typing
        const { data, error } = await supabase.rpc('check_user_role' as any, {
          user_id: user_id,
          role_name: 'admin'
        } as any);

        console.log("Role check result:", { data, error });

        if (error) {
          console.error("Error checking user role:", error);
          // Fallback to direct query if RPC fails
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user_id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleError) {
            console.error("Fallback role check failed:", roleError);
            // Final fallback - check hardcoded admin
            const isHardcodedAdmin = session.session?.user?.email === 'admin22@gmail.com';
            if (isMounted) {
              setIsAdmin(isHardcodedAdmin);
            }
          } else {
            if (isMounted) {
              setIsAdmin(!!roleData);
            }
          }
        } else {
          if (isMounted) {
            setIsAdmin(!!data);
          }
        }
      } catch (error) {
        console.error("Admin role check error:", error);
        if (isMounted) {
          // Final fallback for any unexpected errors
          const { data: session } = await supabase.auth.getSession();
          const isHardcodedAdmin = session.session?.user?.email === 'admin22@gmail.com';
          setIsAdmin(isHardcodedAdmin);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkRole();
    return () => {
      isMounted = false;
    };
  }, []);

  return { isAdmin, loading };
}
