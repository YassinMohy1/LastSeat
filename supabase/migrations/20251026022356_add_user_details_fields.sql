/*
  # Add Additional User Details Fields

  1. Changes
    - Add first_name and last_name columns (replacing full_name)
    - Add phone column
    - Add city column
    - Keep full_name for backward compatibility
  
  2. Notes
    - All new fields are optional to maintain existing data integrity
*/

-- Add new columns to admin_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN first_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'city'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN city text;
  END IF;
END $$;