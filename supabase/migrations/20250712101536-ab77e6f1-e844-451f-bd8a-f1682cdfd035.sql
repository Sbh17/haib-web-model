-- Enable the required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to check for appointment reminders every 5 minutes
-- This will call our edge function to send notifications
SELECT cron.schedule(
  'send-appointment-reminders',
  '*/5 * * * *', -- every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://pruhplqrmepvrbkzdomx.supabase.co/functions/v1/send-appointment-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydWhwbHFybWVwdnJia3pkb214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjE2MzMsImV4cCI6MjA2NjUzNzYzM30.kO5iTnYmDiPfrPFkpr3Bt8KBB0fbrM9DW1aIR_9X_WQ"}'::jsonb,
        body:=concat('{"scheduled_run": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create a table to store user push tokens
CREATE TABLE IF NOT EXISTS public.user_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  push_token TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'ios' or 'android'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the push tokens table
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for push tokens
CREATE POLICY "Users can view their own push tokens" 
ON public.user_push_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push tokens" 
ON public.user_push_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push tokens" 
ON public.user_push_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all push tokens" 
ON public.user_push_tokens 
FOR ALL 
USING (current_setting('role', true) = 'service_role');

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_push_tokens_user_id ON public.user_push_tokens(user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_push_tokens_updated_at
  BEFORE UPDATE ON public.user_push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();