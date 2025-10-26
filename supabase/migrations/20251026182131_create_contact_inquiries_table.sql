/*
  # Create Contact Inquiries Table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `full_name` (text) - Name of the person submitting the inquiry
      - `email` (text) - Email address
      - `phone` (text) - Phone number
      - `destination` (text) - Preferred destination
      - `message` (text) - Additional details/message
      - `status` (text) - Status of inquiry (new, contacted, completed)
      - `created_at` (timestamptz) - When inquiry was submitted
      - `updated_at` (timestamptz) - Last update time
      - `notes` (text) - Admin notes about the inquiry

  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy for authenticated admin users to read all inquiries
    - Add policy for authenticated admin users to update inquiries
    - Add policy to allow anyone to insert inquiries (public form submission)
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  destination text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries (public form submission)
CREATE POLICY "Anyone can submit contact inquiry"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert inquiries
CREATE POLICY "Authenticated users can submit contact inquiry"
  ON contact_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin users can view all inquiries
CREATE POLICY "Admin users can view all inquiries"
  ON contact_inquiries
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

-- Admin users can update inquiries
CREATE POLICY "Admin users can update inquiries"
  ON contact_inquiries
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);