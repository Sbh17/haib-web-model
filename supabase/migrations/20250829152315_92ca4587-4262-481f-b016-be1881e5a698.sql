-- Insert test salon data
INSERT INTO salons (name, address, phone, email, description) VALUES 
('DIOR Beauty Salon', '123 Luxury Street, Paris', '+33 1 23 45 67 89', 'contact@diorbeauty.com', 'Luxury beauty salon offering premium services'),
('Elegance Spa', '456 Fashion Avenue, Milan', '+39 02 1234 5678', 'info@elegancespa.com', 'Modern spa with sophisticated treatments');

-- Insert test services
INSERT INTO services (salon_id, name, description, category, price, duration_minutes) VALUES 
((SELECT id FROM salons WHERE name = 'DIOR Beauty Salon' LIMIT 1), 'Luxury Facial', 'Premium anti-aging facial treatment', 'facial', 150.00, 90),
((SELECT id FROM salons WHERE name = 'DIOR Beauty Salon' LIMIT 1), 'Manicure & Pedicure', 'Complete nail care service', 'nails', 80.00, 60),
((SELECT id FROM salons WHERE name = 'Elegance Spa' LIMIT 1), 'Deep Cleansing Facial', 'Purifying facial for all skin types', 'facial', 120.00, 75);

-- Insert test staff
INSERT INTO staff (salon_id, name, specialties) VALUES 
((SELECT id FROM salons WHERE name = 'DIOR Beauty Salon' LIMIT 1), 'Marie Dubois', ARRAY['facial', 'skincare']),
((SELECT id FROM salons WHERE name = 'Elegance Spa' LIMIT 1), 'Sofia Romano', ARRAY['nails', 'massage']);

-- Insert test reviews (using the existing user profile)
INSERT INTO reviews (user_id, salon_id, rating, comment) VALUES 
((SELECT id FROM profiles WHERE full_name = 'sabri boshnak' LIMIT 1), (SELECT id FROM salons WHERE name = 'DIOR Beauty Salon' LIMIT 1), 5, 'Absolutely amazing service! The luxury facial was incredible and the staff was so professional. Highly recommend!'),
((SELECT id FROM profiles WHERE full_name = 'sabri boshnak' LIMIT 1), (SELECT id FROM salons WHERE name = 'Elegance Spa' LIMIT 1), 4, 'Great experience overall. The spa is beautiful and the treatments are relaxing. Will definitely come back.');