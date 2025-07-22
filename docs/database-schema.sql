-- =====================================================
-- HAIB Beauty Salon Booking Platform - Database Schema
-- Google Cloud SQL (PostgreSQL)
-- Professional Production-Ready Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('customer', 'salon_owner', 'admin', 'super_admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partial');
CREATE TYPE salon_status AS ENUM ('pending', 'active', 'suspended', 'closed');
CREATE TYPE promotion_type AS ENUM ('percentage', 'fixed_amount', 'buy_one_get_one');
CREATE TYPE notification_type AS ENUM ('appointment_reminder', 'promotion', 'news', 'system');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'home', -- home, work, other
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Salons table
CREATE TABLE salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status salon_status DEFAULT 'pending',
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    logo_url TEXT,
    cover_image_url TEXT,
    social_media JSONB, -- {instagram: "", facebook: "", twitter: ""}
    amenities TEXT[], -- ["wifi", "parking", "wheelchair_accessible"]
    payment_methods TEXT[], -- ["cash", "card", "digital_wallet"]
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Salon working hours
CREATE TABLE salon_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(salon_id, day_of_week)
);

-- Salon images/gallery
CREATE TABLE salon_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    booking_buffer INTEGER DEFAULT 0, -- buffer time in minutes after service
    max_advance_booking INTEGER DEFAULT 30, -- days
    requires_consultation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Salon staff/workers
CREATE TABLE salon_workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    specialties TEXT[], -- array of service names or categories
    bio TEXT,
    avatar_url TEXT,
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Worker working hours
CREATE TABLE worker_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES salon_workers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(worker_id, day_of_week)
);

-- Worker service assignments
CREATE TABLE worker_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES salon_workers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(worker_id, service_id)
);

-- =====================================================
-- BOOKING & APPOINTMENTS
-- =====================================================

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES salon_workers(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointment payments
CREATE TABLE appointment_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- stripe, paypal, cash, etc.
    payment_status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVIEWS & RATINGS
-- =====================================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES salon_workers(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[], -- array of image URLs
    is_verified BOOLEAN DEFAULT FALSE, -- verified purchase/appointment
    response_from_salon TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROMOTIONS & DISCOUNTS
-- =====================================================

-- Promotions
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE, -- NULL for system-wide promotions
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type promotion_type NOT NULL,
    value DECIMAL(10, 2) NOT NULL, -- percentage or fixed amount
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER, -- total usage limit
    usage_per_customer INTEGER DEFAULT 1,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    promo_code VARCHAR(50) UNIQUE,
    applicable_services UUID[], -- array of service IDs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promotion usage tracking
CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FAVORITES & PREFERENCES
-- =====================================================

-- User favorite salons
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, salon_id)
);

-- =====================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

-- Push notification tokens
CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    platform VARCHAR(20) NOT NULL, -- ios, android, web
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    data JSONB, -- additional data for the notification
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- News/Blog articles
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category VARCHAR(100),
    tags TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

-- Salon analytics
CREATE TABLE salon_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_appointments INTEGER DEFAULT 0,
    completed_appointments INTEGER DEFAULT 0,
    cancelled_appointments INTEGER DEFAULT 0,
    no_show_appointments INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    average_rating DECIMAL(2, 1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(salon_id, date)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Salons indexes
CREATE INDEX idx_salons_owner_id ON salons(owner_id);
CREATE INDEX idx_salons_status ON salons(status);
CREATE INDEX idx_salons_city ON salons(city);
CREATE INDEX idx_salons_rating ON salons(rating DESC);
CREATE INDEX idx_salons_location ON salons USING GIST(ST_MakePoint(longitude, latitude));
CREATE INDEX idx_salons_name_search ON salons USING GIN(to_tsvector('english', name));

-- Services indexes
CREATE INDEX idx_services_salon_id ON services(salon_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_active ON services(is_active);

-- Appointments indexes
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_salon_id ON appointments(salon_id);
CREATE INDEX idx_appointments_worker_id ON appointments(worker_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, start_time);

-- Reviews indexes
CREATE INDEX idx_reviews_salon_id ON reviews(salon_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Promotions indexes
CREATE INDEX idx_promotions_salon_id ON promotions(salon_id);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_code ON promotions(promo_code);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON salons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update salon rating when review is added/updated
CREATE OR REPLACE FUNCTION update_salon_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE salons 
    SET 
        rating = (
            SELECT ROUND(AVG(rating), 1) 
            FROM reviews 
            WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id)
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE salon_id = COALESCE(NEW.salon_id, OLD.salon_id)
        )
    WHERE id = COALESCE(NEW.salon_id, OLD.salon_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_salon_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_salon_rating();

-- Function to prevent double booking
CREATE OR REPLACE FUNCTION check_appointment_conflict()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM appointments 
        WHERE worker_id = NEW.worker_id 
        AND appointment_date = NEW.appointment_date
        AND status NOT IN ('cancelled', 'no_show')
        AND (
            (start_time <= NEW.start_time AND end_time > NEW.start_time) OR
            (start_time < NEW.end_time AND end_time >= NEW.end_time) OR
            (start_time >= NEW.start_time AND end_time <= NEW.end_time)
        )
        AND (TG_OP = 'INSERT' OR id != NEW.id)
    ) THEN
        RAISE EXCEPTION 'Worker is not available at this time slot';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_appointment_conflict_trigger 
    BEFORE INSERT OR UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION check_appointment_conflict();

-- =====================================================
-- SAMPLE DATA INSERTS (Optional)
-- =====================================================

-- Insert sample service categories
INSERT INTO service_categories (name, description, display_order) VALUES
('Hair Care', 'All hair related services including cuts, styling, and treatments', 1),
('Nail Care', 'Manicure, pedicure, and nail art services', 2),
('Facial Treatments', 'Skincare and facial beauty treatments', 3),
('Body Treatments', 'Massage and body care services', 4),
('Makeup Services', 'Professional makeup application', 5);

-- Insert admin user (remember to hash the password properly in your application)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@haib.com', '$2b$12$hashedpassword', 'Admin', 'User', 'admin');

-- =====================================================
-- SECURITY & RLS (Row Level Security) - Optional
-- =====================================================

-- Enable RLS on sensitive tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth system)
-- CREATE POLICY users_own_data ON users FOR ALL USING (id = current_user_id());
-- CREATE POLICY salon_owner_data ON salons FOR ALL USING (owner_id = current_user_id());

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- Remember to:
-- 1. Set up proper backup strategies
-- 2. Monitor query performance and adjust indexes as needed
-- 3. Implement proper authentication and authorization
-- 4. Set up database monitoring and alerting
-- 5. Regular maintenance and optimization
-- 6. Consider partitioning for large tables (appointments, analytics)
-- 7. Implement proper error handling and logging
-- 8. Set up connection pooling for better performance