-- Create salon partnership requests table
CREATE TABLE public.salon_partnership_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic salon information
    salon_name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    business_id TEXT,
    
    -- Owner information
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_phone TEXT,
    
    -- Social media links
    social_media JSONB DEFAULT '{}',
    
    -- Images and media
    images TEXT[] DEFAULT '{}',
    cover_image TEXT,
    
    -- Partnership status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    review_progress INTEGER DEFAULT 0 CHECK (review_progress >= 0 AND review_progress <= 100),
    
    -- Admin notes
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create services for partnership requests
CREATE TABLE public.partnership_request_services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    partnership_request_id UUID NOT NULL REFERENCES public.salon_partnership_requests(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    category TEXT DEFAULT 'general',
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.salon_partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_request_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for salon_partnership_requests
CREATE POLICY "Users can view their own partnership requests" 
ON public.salon_partnership_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own partnership requests" 
ON public.salon_partnership_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own partnership requests" 
ON public.salon_partnership_requests 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- Admin access policy (for future admin dashboard)
CREATE POLICY "Admin can access all partnership requests" 
ON public.salon_partnership_requests 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- RLS Policies for partnership_request_services
CREATE POLICY "Users can view services for their partnership requests" 
ON public.partnership_request_services 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.salon_partnership_requests 
        WHERE salon_partnership_requests.id = partnership_request_id 
        AND salon_partnership_requests.user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage services for their partnership requests" 
ON public.partnership_request_services 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.salon_partnership_requests 
        WHERE salon_partnership_requests.id = partnership_request_id 
        AND salon_partnership_requests.user_id = auth.uid()
        AND salon_partnership_requests.status = partnershipREQUEST_id 'pending'
    )
);

-- Admin access for services
CREATE POLICY "Admin can access all partnership request services" 
ON public.partnership_request_services 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Create storage bucket for partnership application media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'partnership-media', 
    'partnership-media', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies for partnership media
CREATE POLICY "Users can upload their own partnership media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'partnership-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own partnership media" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'partnership-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own partnership media" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'partnership-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own partnership media" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'partnership-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public access for approved partnership media (for display purposes)
CREATE POLICY "Partnership media is publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partnership-media');

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_partnership_requests_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partnership_requests_updated_at
    BEFORE UPDATE ON public.salon_partnership_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_partnership_requests_updated_at_column();