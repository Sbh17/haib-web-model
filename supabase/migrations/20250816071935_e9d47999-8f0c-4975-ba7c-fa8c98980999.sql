-- Fix security issue: Restrict profiles table access to authenticated users only
-- Remove the overly permissive policy that allows public access to user personal information

drop policy if exists "Profiles are viewable by everyone" on public.profiles;

-- Create a more secure policy that only allows authenticated users to view profiles
create policy "Authenticated users can view profiles" on public.profiles
for select to authenticated
using (true);

-- Optional: Even more secure - users can only view their own profile
-- Uncomment the following and comment the above if you want maximum privacy
/*
drop policy if exists "Authenticated users can view profiles" on public.profiles;
create policy "Users can view their own profile" on public.profiles
for select to authenticated
using (auth.uid() = id);
*/