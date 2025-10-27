/*
  # Create Audit Logs System and Main Admin Role

  ## Overview
  This migration creates a comprehensive audit logging system to track all admin activities
  and introduces a "main_admin" role with full system visibility.

  ## Changes

  ### 1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key) - Unique identifier
      - `admin_id` (uuid, foreign key) - Admin who performed the action
      - `admin_email` (text) - Email of admin for easy reference
      - `action_type` (text) - Type of action (create_invoice, update_invoice, delete_invoice, etc.)
      - `entity_type` (text) - Type of entity affected (invoice, payment, customer, etc.)
      - `entity_id` (text) - ID of affected entity
      - `details` (jsonb) - Additional details about the action
      - `ip_address` (text) - IP address of the admin
      - `created_at` (timestamptz) - When the action occurred

  ### 2. Table Modifications
    - Update `admin_users` table to support "main_admin" role
    - Add check constraint for valid roles

  ### 3. Security
    - Enable RLS on `audit_logs` table
    - Main admins can view all logs
    - Regular admins cannot view logs
    - System can insert logs for any admin action

  ### 4. Indexes
    - Index on admin_id for fast lookup
    - Index on action_type for filtering
    - Index on created_at for date-based queries
*/

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_email text NOT NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);

-- Update admin_users table to add check constraint for roles
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
  
  -- Add new constraint with main_admin role
  ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check 
    CHECK (role IN ('admin', 'customer', 'main_admin'));
END $$;

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Main admins can view all logs
CREATE POLICY "Main admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'main_admin'
      AND admin_users.is_active = true
    )
  );

-- Policy: System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update existing main admin to main_admin role
UPDATE admin_users 
SET role = 'main_admin'
WHERE email = 'abdelatyelsayed4@gmail.com';

-- Create function to automatically log invoice actions
CREATE OR REPLACE FUNCTION log_invoice_action()
RETURNS trigger AS $$
DECLARE
  admin_email_var text;
  action_type_var text;
BEGIN
  -- Get admin email
  SELECT email INTO admin_email_var
  FROM admin_users
  WHERE id = auth.uid();

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type_var := 'create_invoice';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type_var := 'update_invoice';
  ELSIF TG_OP = 'DELETE' THEN
    action_type_var := 'delete_invoice';
  END IF;

  -- Insert audit log
  INSERT INTO audit_logs (
    admin_id,
    admin_email,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    auth.uid(),
    COALESCE(admin_email_var, 'system'),
    action_type_var,
    'invoice',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'operation', TG_OP,
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for bookings table
DROP TRIGGER IF EXISTS bookings_audit_trigger ON bookings;
CREATE TRIGGER bookings_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_invoice_action();
