-- Create salons table
CREATE TABLE public.salons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  description TEXT,
  opening_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "17:00"}, "sunday": {"closed": true}}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for salons
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent double booking at same time
  UNIQUE(salon_id, appointment_date, appointment_time)
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create staff table for salon workers
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialties TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for salons (public read)
CREATE POLICY "Salons are viewable by everyone" 
ON public.salons 
FOR SELECT 
USING (true);

CREATE POLICY "Only salon owners can modify salons" 
ON public.salons 
FOR ALL 
USING (false);

-- Create RLS policies for services (public read)
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Only salon owners can modify services" 
ON public.services 
FOR ALL 
USING (false);

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all appointments" 
ON public.appointments 
FOR ALL 
USING (current_setting('role'::text, true) = 'service_role'::text);

-- Create RLS policies for staff (public read)
CREATE POLICY "Staff are viewable by everyone" 
ON public.staff 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_date ON public.appointments(user_id, appointment_date);
CREATE INDEX idx_appointments_salon_date ON public.appointments(salon_id, appointment_date, appointment_time);
CREATE INDEX idx_services_salon ON public.services(salon_id);
CREATE INDEX idx_staff_salon ON public.staff(salon_id);

-- Create function to update timestamps
CREATE TRIGGER update_salons_updated_at
BEFORE UPDATE ON public.salons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.salons (name, address, phone, email, description) VALUES 
('Elegant Beauty Spa', '123 Luxury Ave, Downtown', '+1-555-0123', 'info@elegantbeauty.com', 'Premium beauty treatments in a luxurious setting'),
('Modern Hair Studio', '456 Style Street, Uptown', '+1-555-0456', 'hello@modernhair.com', 'Contemporary hair styling and treatments'),
('Serene Wellness Center', '789 Tranquil Blvd, Midtown', '+1-555-0789', 'contact@serenewellness.com', 'Holistic beauty and wellness services');

-- Get salon IDs for inserting services
INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category) 
SELECT s.id, 'Women\'s Haircut', 'Professional hair cutting and styling', 60, 80.00, 'hair'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa'
UNION ALL
SELECT s.id, 'Hair Coloring', 'Full hair coloring service', 120, 150.00, 'hair'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa'
UNION ALL
SELECT s.id, 'Manicure', 'Professional nail care and polish', 45, 40.00, 'nails'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa'
UNION ALL
SELECT s.id, 'Facial Treatment', 'Deep cleansing and rejuvenating facial', 90, 100.00, 'skincare'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa'
UNION ALL
SELECT s.id, 'Men\'s Haircut', 'Modern men\'s hair styling', 45, 60.00, 'hair'
FROM public.salons s WHERE s.name = 'Modern Hair Studio'
UNION ALL
SELECT s.id, 'Beard Trim', 'Professional beard grooming', 30, 35.00, 'hair'
FROM public.salons s WHERE s.name = 'Modern Hair Studio'
UNION ALL
SELECT s.id, 'Massage Therapy', 'Relaxing full-body massage', 60, 120.00, 'wellness'
FROM public.salons s WHERE s.name = 'Serene Wellness Center'
UNION ALL
SELECT s.id, 'Pedicure', 'Complete foot care treatment', 60, 50.00, 'nails'
FROM public.salons s WHERE s.name = 'Serene Wellness Center';