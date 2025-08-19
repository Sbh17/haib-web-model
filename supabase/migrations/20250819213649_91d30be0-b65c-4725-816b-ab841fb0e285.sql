-- Add more women's beauty services
INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Makeup Application', 'Professional makeup for special events', 90, 120.00, 'makeup'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Bridal Makeup', 'Complete bridal makeup package', 120, 200.00, 'makeup'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Eyebrow Shaping', 'Professional eyebrow threading and shaping', 30, 45.00, 'brows'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Eyelash Extensions', 'Semi-permanent eyelash extensions', 120, 180.00, 'lashes'
FROM public.salons s WHERE s.name = 'Elegant Beauty Spa';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Highlights & Lowlights', 'Partial hair coloring with highlights', 150, 180.00, 'hair'
FROM public.salons s WHERE s.name = 'Modern Hair Studio';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Blowout Styling', 'Professional hair washing and styling', 45, 65.00, 'hair'
FROM public.salons s WHERE s.name = 'Modern Hair Studio';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Deep Conditioning Treatment', 'Intensive hair moisturizing treatment', 60, 85.00, 'hair'
FROM public.salons s WHERE s.name = 'Modern Hair Studio';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Anti-Aging Facial', 'Advanced anti-aging skincare treatment', 75, 140.00, 'skincare'
FROM public.salons s WHERE s.name = 'Serene Wellness Center';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'Gel Manicure', 'Long-lasting gel nail polish', 60, 55.00, 'nails'
FROM public.salons s WHERE s.name = 'Serene Wellness Center';

INSERT INTO public.services (salon_id, name, description, duration_minutes, price, category)
SELECT s.id, 'French Manicure', 'Classic French manicure style', 50, 48.00, 'nails'
FROM public.salons s WHERE s.name = 'Serene Wellness Center';

-- Update salon descriptions to focus on women beauty
UPDATE public.salons 
SET description = 'Premier destination for women beauty treatments including hair, makeup, and skincare'
WHERE name = 'Elegant Beauty Spa';

UPDATE public.salons 
SET description = 'Specialized women hair salon offering cutting, coloring, and styling services'
WHERE name = 'Modern Hair Studio';

UPDATE public.salons 
SET description = 'Luxury spa focused on women wellness, skincare, and nail treatments'
WHERE name = 'Serene Wellness Center';

-- Remove men-specific services
DELETE FROM public.services WHERE name IN ('Men Haircut', 'Beard Trim');