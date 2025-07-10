
-- Create the check_user_role function that's being called in the code
CREATE OR REPLACE FUNCTION public.check_user_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
$$;
