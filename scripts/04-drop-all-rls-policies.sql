-- Drop all existing RLS policies to prevent infinite recursion
-- This script comprehensively removes all policies from all tables

-- Drop policies on users table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;

-- Drop policies on rooms table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Admins can read all rooms" ON rooms;
DROP POLICY IF EXISTS "Admins can manage rooms" ON rooms;

-- Drop policies on devices table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON devices;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON devices;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON devices;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON devices;
DROP POLICY IF EXISTS "Admins can read all devices" ON devices;
DROP POLICY IF EXISTS "Admins can manage devices" ON devices;

-- Drop policies on gadgets table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON gadgets;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON gadgets;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON gadgets;
DROP POLICY IF EXISTS "Admins can read all gadgets" ON gadgets;
DROP POLICY IF EXISTS "Admins can manage gadgets" ON gadgets;

-- Drop policies on bookings table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can read all bookings" ON bookings;

-- Drop policies on maintenance table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON maintenance;
DROP POLICY IF EXISTS "Admins can read all maintenance" ON maintenance;

-- Drop policies on notifications table
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON notifications;

-- Drop policies on audit_logs table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "Admins can read all audit logs" ON audit_logs;

-- Now disable RLS on all tables to prevent any policy checks
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE gadgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
