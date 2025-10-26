/*
  # Create Customers Table for Regular Users

  ## Overview
  This migration creates a separate `customers` table for regular user accounts.
  Admins stay in `admin_users` table, while regular users go to `customers` table.

  ## New Tables
  
  ### `customers`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text, unique, not null) - User's email address
  - `first_name` (text) - Customer's first name
  - `last_name` (text) - Customer's last name
  - `full_name` (text) - Full name for display
  - `phone` (text) - Contact phone number
  - `city` (text) - City of residence
  - `is_active` (boolean) - Account active status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### RLS Policies
  1. Customers can view their own data (SELECT)
  2. Customers can insert their own data during registration (INSERT)
  3. Customers can update their own data (UPDATE)
  4. Admins can view all customers (SELECT)
  5. Admins can update customer status (UPDATE)

  ## Notes
  - Customers table is separate from admin_users for better organization
  - Only admins can promote customers to admin status
  - RLS ensures customers can only access their own data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  full_name text,
  phone text,
  city text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy 1: Customers can view their own data
CREATE POLICY "Customers can view own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Customers can insert their own data during registration
CREATE POLICY "Customers can insert own data"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 3: Customers can update their own data
CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Admins can view all customers
CREATE POLICY "Admins can view all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Policy 5: Admins can update customers
CREATE POLICY "Admins can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);
