-- Insert sample data for testing
INSERT INTO public.salons (name, address, phone, email, description) VALUES 
('Elegant Beauty Spa', '123 Luxury Ave, Downtown', '+1-555-0123', 'info@elegantbeauty.com', 'Premium beauty treatments in a luxurious setting'),
('Modern Hair Studio', '456 Style Street, Uptown', '+1-555-0456', 'hello@modernhair.com', 'Contemporary hair styling and treatments'),
('Serene Wellness Center', '789 Tranquil Blvd, Midtown', '+1-555-0789', 'contact@serenewellness.com', 'Holistic beauty and wellness services');

-- Insert services for Elegant Beauty Spa
INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Women Haircut', 'Professional hair cutting and styling', 60, 80.00, 'hair'
FROM public.salons WHERE name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Hair Coloring', 'Full hair coloring service', 120, 150.00, 'hair'
FROM public.salons WHERE name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Manicure', 'Professional nail care and polish', 45, 40.00, 'nails'
FROM public.salons WHERE name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Facial Treatment', 'Deep cleansing and rejuvenating facial', 90, 100.00, 'skincare'
FROM public.salons WHERE name = 'Elegant Beauty Spa';

-- Insert services for Modern Hair Studio
INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Men Haircut', 'Modern men hair styling', 45, 60.00, 'hair'
FROM public.salons WHERE name = 'Modern Hair Studio';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Beard Trim', 'Professional beard grooming', 30, 35.00, 'hair'
FROM public.salons WHERE name = 'Modern Hair Studio';

-- Insert services for Serene Wellness Center
INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Massage Therapy', 'Relaxing full-body massage', 60, 120.00, 'wellness'
FROM public.salons WHERE name = 'Serene Wellness Center';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT id, 'Pedicure', 'Complete foot care treatment', 60, 50.00, 'nails'
FROM public.salons WHERE name = 'Serene Wellness Center';