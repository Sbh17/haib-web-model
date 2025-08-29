-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;