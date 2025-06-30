
-- Create the labs table
CREATE TABLE public.labs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  rating DECIMAL(2,1),
  hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the tests table
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  lab_id UUID REFERENCES public.labs(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  test_id UUID REFERENCES public.tests(id) NOT NULL,
  test_name TEXT NOT NULL,
  lab_id UUID REFERENCES public.labs(id),
  lab_name TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_time TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  sample_type TEXT NOT NULL CHECK (sample_type IN ('home', 'lab')),
  address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the partner applications table
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for labs (public read, admin write)
CREATE POLICY "Anyone can view labs" ON public.labs FOR SELECT USING (true);
CREATE POLICY "Only admins can manage labs" ON public.labs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for tests (public read, admin write)
CREATE POLICY "Anyone can view tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Only admins can manage tests" ON public.tests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete bookings" ON public.bookings FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for partner applications
CREATE POLICY "Anyone can create partner applications" ON public.partner_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and manage partner applications" ON public.partner_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for user roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only admins can manage user roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert some sample data
INSERT INTO public.labs (name, address, phone, rating, hours) VALUES
('City Lab', '123 Main St, City Center', '+1-555-0101', 4.5, '9:00 AM - 6:00 PM'),
('Metro Diagnostics', '456 Health Ave, Metro District', '+1-555-0102', 4.2, '8:00 AM - 8:00 PM'),
('Quick Test Center', '789 Express Blvd, Downtown', '+1-555-0103', 4.0, '24/7'),
('Premium Lab Services', '321 Premium St, Uptown', '+1-555-0104', 4.8, '7:00 AM - 9:00 PM'),
('Community Health Lab', '654 Community Rd, Suburbs', '+1-555-0105', 4.3, '8:00 AM - 5:00 PM'),
('Advanced Diagnostics', '987 Science Park, Tech District', '+1-555-0106', 4.6, '9:00 AM - 7:00 PM');

INSERT INTO public.tests (name, description, cost) VALUES
('Complete Blood Count (CBC)', 'Comprehensive blood analysis including RBC, WBC, platelets', 25.00),
('Lipid Profile', 'Cholesterol and triglyceride levels assessment', 30.00),
('Liver Function Test', 'Assessment of liver health and function', 35.00),
('Kidney Function Test', 'Creatinine, BUN, and other kidney markers', 32.00),
('Thyroid Function Test', 'TSH, T3, T4 hormone levels', 40.00),
('Diabetes Panel', 'Fasting glucose, HbA1c, and related markers', 28.00),
('Vitamin D Test', 'Vitamin D3 levels in blood', 45.00),
('Iron Studies', 'Iron, ferritin, and TIBC levels', 38.00),
('Cardiac Markers', 'Heart health assessment including troponin', 50.00),
('Inflammatory Markers', 'CRP, ESR, and other inflammation indicators', 33.00),
('Hepatitis Panel', 'Hepatitis A, B, C screening', 55.00),
('HIV Test', 'HIV antibody and antigen detection', 42.00),
('Urine Analysis', 'Complete urine examination', 20.00),
('Pregnancy Test', 'Beta hCG levels in blood/urine', 18.00);
