-- Create admin test user
-- Replace 'admin@example.com' with your desired admin email
-- Replace 'test-user-id' with an actual UUID or let the system generate it

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token,
  email_change,
  email_change_confirm_token,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_new,
  email_change_token_new_token_sent_at,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  now(),
  '',
  '',
  '',
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  now(),
  '',
  now(),
  null,
  '',
  now(),
  false
) ON CONFLICT DO NOTHING;

-- Get the user ID and insert into public.users table with admin role
WITH user_id AS (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
)
INSERT INTO public.users (id, name, email, role, status, created_at, updated_at)
SELECT 
  u.id,
  'Admin User',
  'admin@example.com',
  'admin',
  'active',
  now(),
  now()
FROM user_id u
ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'active';
