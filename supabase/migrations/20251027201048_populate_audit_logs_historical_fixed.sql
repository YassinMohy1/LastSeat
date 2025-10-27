/*
  # Populate Audit Logs with Historical Invoice Data

  ## Overview
  This migration populates the audit_logs table with historical data from existing invoices
  so that Main Admins can see all past activities and invoice creation history.

  ## Changes
  1. Insert audit logs for all existing invoices (creation events)
  2. Insert audit logs for all paid invoices (payment events)
  3. Insert audit logs for all cancelled invoices (cancellation events)

  ## Notes
  - Uses the first Main Admin as the admin for historical entries
  - Historical data will show when invoices were created, paid, or cancelled
  - Marked with 'historical_import' flag in details
*/

DO $$
DECLARE
  main_admin_id uuid;
  main_admin_email text;
BEGIN
  -- Get the first main admin
  SELECT id, email INTO main_admin_id, main_admin_email
  FROM admin_users 
  WHERE role = 'main_admin' 
  LIMIT 1;

  -- Insert creation logs for all existing invoices
  INSERT INTO audit_logs (admin_id, admin_email, action_type, entity_type, entity_id, details, created_at)
  SELECT 
    main_admin_id,
    'system',
    'create_invoice',
    'invoice',
    i.id::text,
    jsonb_build_object(
      'invoice_number', i.invoice_number,
      'customer_name', i.customer_name,
      'customer_email', i.customer_email,
      'amount', i.amount,
      'currency', i.currency,
      'flight_from', i.flight_from,
      'flight_to', i.flight_to,
      'historical_import', true
    ),
    i.created_at
  FROM invoices i
  WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs al 
    WHERE al.entity_id = i.id::text 
    AND al.action_type = 'create_invoice'
  );

  -- Insert payment logs for all paid invoices
  INSERT INTO audit_logs (admin_id, admin_email, action_type, entity_type, entity_id, details, created_at)
  SELECT 
    main_admin_id,
    'system',
    'update_invoice_status',
    'invoice',
    i.id::text,
    jsonb_build_object(
      'invoice_number', i.invoice_number,
      'customer_name', i.customer_name,
      'old_status', 'pending',
      'new_status', 'paid',
      'payment_method', i.payment_method,
      'amount', i.amount,
      'historical_import', true
    ),
    COALESCE(i.paid_at, i.created_at)
  FROM invoices i
  WHERE i.payment_status = 'paid'
  AND NOT EXISTS (
    SELECT 1 FROM audit_logs al 
    WHERE al.entity_id = i.id::text 
    AND al.action_type = 'update_invoice_status'
    AND al.details->>'new_status' = 'paid'
  );

  -- Insert cancellation logs for all cancelled invoices
  INSERT INTO audit_logs (admin_id, admin_email, action_type, entity_type, entity_id, details, created_at)
  SELECT 
    main_admin_id,
    'system',
    'update_invoice_status',
    'invoice',
    i.id::text,
    jsonb_build_object(
      'invoice_number', i.invoice_number,
      'customer_name', i.customer_name,
      'old_status', 'pending',
      'new_status', 'cancelled',
      'historical_import', true
    ),
    i.created_at
  FROM invoices i
  WHERE i.payment_status = 'cancelled'
  AND NOT EXISTS (
    SELECT 1 FROM audit_logs al 
    WHERE al.entity_id = i.id::text 
    AND al.action_type = 'update_invoice_status'
    AND al.details->>'new_status' = 'cancelled'
  );

END $$;
