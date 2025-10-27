/*
  # Create Flight Prices Management Table

  1. New Tables
    - `flight_prices`
      - `id` (uuid, primary key) - Unique identifier
      - `route_from` (text) - Departure city/airport code
      - `route_to` (text) - Arrival city/airport code
      - `cabin_class` (text) - Economy, Business, or First Class
      - `trip_type` (text) - oneway or roundtrip
      - `original_price` (numeric) - Original price before discount
      - `discount_percentage` (numeric) - Discount percentage (0-100)
      - `final_price` (numeric) - Final price after discount
      - `is_active` (boolean) - Whether this price is currently active
      - `created_at` (timestamptz) - When the price was created
      - `updated_at` (timestamptz) - When the price was last updated

  2. Security
    - Enable RLS on `flight_prices` table
    - Add policy for public to read active prices
    - Add policy for authenticated admins to manage all prices

  3. Indexes
    - Index on route_from and route_to for fast lookups
    - Index on is_active for filtering active prices
*/

CREATE TABLE IF NOT EXISTS flight_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_from text NOT NULL,
  route_to text NOT NULL,
  cabin_class text NOT NULL DEFAULT 'Economy',
  trip_type text NOT NULL DEFAULT 'roundtrip',
  original_price numeric NOT NULL,
  discount_percentage numeric NOT NULL DEFAULT 60,
  final_price numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_cabin_class CHECK (cabin_class IN ('Economy', 'Business', 'First Class')),
  CONSTRAINT valid_trip_type CHECK (trip_type IN ('oneway', 'roundtrip')),
  CONSTRAINT valid_discount CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

ALTER TABLE flight_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active flight prices"
  ON flight_prices
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all flight prices"
  ON flight_prices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert flight prices"
  ON flight_prices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update flight prices"
  ON flight_prices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete flight prices"
  ON flight_prices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_flight_prices_route ON flight_prices(route_from, route_to);
CREATE INDEX IF NOT EXISTS idx_flight_prices_active ON flight_prices(is_active);
CREATE INDEX IF NOT EXISTS idx_flight_prices_lookup ON flight_prices(route_from, route_to, cabin_class, trip_type, is_active);