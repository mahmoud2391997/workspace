-- Complete cleanup to remove infinite recursion
-- This script will:
-- 1. Enable RLS on all tables first (in case they're disabled)
-- 2. Drop ALL existing policies systematically
-- 3. Then DISABLE RLS on all tables for the preview environment

-- First, enable RLS so we can drop policies
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gadgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop ALL policies on users table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on rooms table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'rooms' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rooms', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on devices table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'devices' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON devices', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on gadgets table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'gadgets' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON gadgets', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on bookings table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'bookings' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON bookings', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on maintenance table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'maintenance' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON maintenance', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on notifications table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'notifications' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON notifications', pol.policyname);
    END LOOP;
END $$;

-- Drop ALL policies on audit_logs table
DO $$ DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'audit_logs' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON audit_logs', pol.policyname);
    END LOOP;
END $$;

-- Now disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE gadgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
