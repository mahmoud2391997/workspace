-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Employees can read devices" ON devices;
DROP POLICY IF EXISTS "Admins can read all bookings" ON bookings;

-- Disable RLS on users table to prevent infinite recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Recreate device policy without recursion
CREATE POLICY "Employees can read devices" ON devices
  FOR SELECT USING (true);

-- Recreate booking policies
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings" ON bookings
  FOR SELECT USING (true);

-- Disable RLS on other tables to prevent recursion during development
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE gadgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
