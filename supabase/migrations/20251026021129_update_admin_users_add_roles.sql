/*
  # Update Admin Users Table with Role Management

  1. Changes
    - Add `role` column to admin_users table (admin, customer, guest)
    - Add `is_active` column to enable/disable users
    - Update RLS policies to check role
  
  2. Security
    - Only admins can access admin dashboard
    - Customers can register but won't have admin access
    - You can promote users to admin from database
*/

-- Add role and is_active columns to admin_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'role'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN role text DEFAULT 'customer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Add index for role lookup
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Update RLS policies to check role
DROP POLICY IF EXISTS "Admins can view their invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can create invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can update their invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can delete their invoices" ON invoices;

-- New policies that check role
CREATE POLICY "Admins can view their invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can create invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can update their invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  )
  WITH CHECK (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can delete their invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;