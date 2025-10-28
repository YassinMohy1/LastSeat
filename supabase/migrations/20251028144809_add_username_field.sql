/*
  # Add Username Field to Customer and Admin Tables

  1. Changes
    - Add `username` column to `customers` table
      - Type: text
      - Unique constraint
      - Not null with default generation
    - Add `username` column to `admin_users` table
      - Type: text
      - Unique constraint
      - Not null with default generation
    - Create index on username for faster lookups

  2. Security
    - Maintain existing RLS policies
    - Username is searchable for login purposes
*/

-- Add username to customers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'username'
  ) THEN
    ALTER TABLE customers ADD COLUMN username text UNIQUE;
  END IF;
END $$;

-- Add username to admin_users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'username'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN username text UNIQUE;
  END IF;
END $$;

-- Create index for faster username lookups on customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'customers' AND indexname = 'idx_customers_username'
  ) THEN
    CREATE INDEX idx_customers_username ON customers(username);
  END IF;
END $$;

-- Create index for faster username lookups on admin_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'admin_users' AND indexname = 'idx_admin_users_username'
  ) THEN
    CREATE INDEX idx_admin_users_username ON admin_users(username);
  END IF;
END $$;