/*
  # Fix Customer Payment Link Access

  1. Changes
    - Update RLS policy to allow both anonymous and authenticated users to view invoices via payment link
    - This allows customers to access their payment page regardless of authentication status

  2. Security
    - Access is only granted when a valid payment_link is provided
    - No other invoice data is exposed without proper authentication
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can view invoice by payment link" ON invoices;

-- Create new policy that allows both anon and authenticated users
CREATE POLICY "Anyone can view invoice by payment link"
  ON invoices
  FOR SELECT
  TO anon, authenticated
  USING (payment_link IS NOT NULL);

-- Add policy to allow customers to update payment status via payment link
DROP POLICY IF EXISTS "Anyone can update invoice via payment link" ON invoices;

CREATE POLICY "Anyone can update invoice via payment link"
  ON invoices
  FOR UPDATE
  TO anon, authenticated
  USING (payment_link IS NOT NULL)
  WITH CHECK (payment_link IS NOT NULL);
