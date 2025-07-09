
-- Insert admin role for the user admin22@gmail.com
-- First, we need to get the user_id for admin22@gmail.com from auth.users
-- Since we can't directly query auth.users, we'll use the user_id that was created
-- Based on the auth logs, the user_id for admin22@gmail.com is: 7fad642b-1fb1-4a9e-b9cc-8c8417814cb3

INSERT INTO public.user_roles (user_id, role) 
VALUES ('7fad642b-1fb1-4a9e-b9cc-8c8417814cb3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
