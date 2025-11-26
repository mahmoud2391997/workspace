-- Simple script to promote a user to admin
-- Replace 'user@example.com' with the email of the user to promote

UPDATE public.users 
SET role = 'admin', status = 'active'
WHERE email = 'admin@example.com';

-- Verify the update
SELECT id, email, role, status FROM public.users WHERE email = 'admin@example.com';
