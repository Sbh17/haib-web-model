-- Create reviews table with support for salon and staff reviews
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  salon_id uuid NOT NULL,
  staff_id uuid NULL, -- Optional: for reviewing specific barber/staff member
  appointment_id uuid NULL, -- Optional: link to specific appointment
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_reviews_salon_id ON public.reviews(salon_id);
CREATE INDEX idx_reviews_staff_id ON public.reviews(staff_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Add trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create helpful votes table for review helpfulness
CREATE TABLE public.review_helpful_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_helpful boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS on helpful votes
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Policies for helpful votes
CREATE POLICY "Anyone can view helpful votes" 
ON public.review_helpful_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create helpful votes" 
ON public.review_helpful_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their helpful votes" 
ON public.review_helpful_votes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to update helpful count
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the helpful count in reviews table
  UPDATE public.reviews 
  SET helpful_count = (
    SELECT COUNT(*) 
    FROM public.review_helpful_votes 
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) 
    AND is_helpful = true
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update helpful count
CREATE TRIGGER update_helpful_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.review_helpful_votes
FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_count();