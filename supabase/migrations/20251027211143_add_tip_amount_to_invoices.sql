/*
  # Add Tip Amount to Invoices

  1. Changes
    - Add `tip_amount` column to invoices table to track service tips
    - This amount will be included in the final total amount charged

  2. Notes
    - tip_amount stores the optional service tip
    - Default value is 0 (no tip)
    - Tips are calculated dynamically based on flight price ranges
*/

-- Add tip_amount column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'tip_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN tip_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;
