/*
  # Add Invoice Edit Tracking

  ## Overview
  This migration adds fields to track when invoices are edited and by whom,
  enabling full audit trail for invoice modifications.

  ## Changes Made
  1. **Add Edit Tracking Columns to Invoices:**
     - `last_edited_by_admin_id` - UUID reference to admin who last edited
     - `last_edited_by_admin_email` - Email of admin who last edited
     - `last_edited_at` - Timestamp of last edit

  2. **Security:**
     - RLS policies already cover these fields through existing invoice policies
     - Foreign key constraint ensures data integrity

  ## Notes
  - These fields will be NULL for invoices that haven't been edited yet
  - The `updated_at` field continues to track all updates (including payment status)
  - The `last_edited_at` field specifically tracks manual edits by admins
*/

-- Add edit tracking columns to invoices table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'last_edited_by_admin_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN last_edited_by_admin_id uuid REFERENCES admin_users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'last_edited_by_admin_email'
  ) THEN
    ALTER TABLE invoices ADD COLUMN last_edited_by_admin_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'last_edited_at'
  ) THEN
    ALTER TABLE invoices ADD COLUMN last_edited_at timestamptz;
  END IF;
END $$;