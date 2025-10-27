/*
  # Fix Invoices RLS Policies

  1. Updates
    - Update all invoices RLS policies to include 'main_admin' role
    - Allow both 'admin' and 'main_admin' to perform CRUD operations
  
  2. Security
    - Maintain secure access control
    - Only active admins and main_admins can manage invoices
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view their invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can create invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can update their invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can delete their invoices" ON invoices;

-- New policies that check for both admin and main_admin roles
CREATE POLICY "Admins can view their invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'main_admin')
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
      AND role IN ('admin', 'main_admin')
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
      AND role IN ('admin', 'main_admin')
      AND is_active = true
    )
  )
  WITH CHECK (
    admin_id IN (
      SELECT id FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'main_admin')
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
      AND role IN ('admin', 'main_admin')
      AND is_active = true
    )
  );

-- Update the is_admin function to include main_admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role IN ('admin', 'main_admin')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;