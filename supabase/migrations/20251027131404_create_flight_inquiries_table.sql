/*
  # Create Flight Inquiries Table

  1. New Tables
    - `flight_inquiries`
      - `id` (uuid, primary key)
      - `flight_from` (text) - Departure location
      - `flight_to` (text) - Destination location
      - `departure_date` (date) - Departure date
      - `return_date` (date, nullable) - Return date for round trips
      - `passengers` (integer) - Number of passengers
      - `cabin_class` (text) - Economy, Business, or First Class
      - `trip_type` (text) - roundtrip or oneway
      - `customer_name` (text) - Customer full name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone number
      - `message` (text, nullable) - Additional customer message
      - `status` (text) - pending, contacted, completed (default: pending)
      - `source` (text) - Source of inquiry (default: landing_page)
      - `created_at` (timestamptz) - When inquiry was created

  2. Security
    - Enable RLS on `flight_inquiries` table
    - Add policy for admins to read all inquiries
    - Add policy for authenticated users to insert inquiries
*/

CREATE TABLE IF NOT EXISTS flight_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_from text NOT NULL,
  flight_to text NOT NULL,
  departure_date date NOT NULL,
  return_date date,
  passengers integer NOT NULL DEFAULT 1,
  cabin_class text NOT NULL DEFAULT 'Economy',
  trip_type text NOT NULL DEFAULT 'roundtrip',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'landing_page',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flight_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all flight inquiries"
  ON flight_inquiries
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

CREATE POLICY "Anyone can insert flight inquiries"
  ON flight_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update flight inquiries"
  ON flight_inquiries
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