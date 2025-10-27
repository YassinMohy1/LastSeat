/*
  # Add Invoice Add-ons Support

  1. Changes
    - Add `travel_care_plan` column to invoices table (none, basic, premium)
    - Add `baggage_protection` column to invoices table (boolean)
    - Add `original_amount` column to track base flight cost
    - Rename existing `amount` to represent final total amount

  2. Notes
    - original_amount stores the base flight price
    - amount stores the total with all add-ons included
    - This allows tracking what extras were purchased
*/

-- Add new columns for add-ons
DO $$
BEGIN
  -- Add original_amount to track base flight cost
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'original_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN original_amount numeric(10,2);
    -- Copy current amount to original_amount for existing records
    UPDATE invoices SET original_amount = amount WHERE original_amount IS NULL;
  END IF;

  -- Add travel_care_plan column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'travel_care_plan'
  ) THEN
    ALTER TABLE invoices ADD COLUMN travel_care_plan text DEFAULT 'none';
  END IF;

  -- Add baggage_protection column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'baggage_protection'
  ) THEN
    ALTER TABLE invoices ADD COLUMN baggage_protection boolean DEFAULT false;
  END IF;
END $$;

-- Add check constraint for travel_care_plan
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'invoices_travel_care_plan_check'
  ) THEN
    ALTER TABLE invoices
      ADD CONSTRAINT invoices_travel_care_plan_check
      CHECK (travel_care_plan IN ('none', 'basic', 'premium'));
  END IF;
END $$;