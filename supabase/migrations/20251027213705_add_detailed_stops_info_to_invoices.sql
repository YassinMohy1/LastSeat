/*
  # Add Detailed Stops Information to Invoices

  1. Changes
    - Replace simple stops info with detailed JSON data for each stop
    - Store layover duration, city, and airport code for each stop

  2. New Columns
    - `outbound_stops_details` (jsonb): Array of stop details for outbound flight
      Example: [{"city": "Dubai", "airport": "DXB", "duration": "2h 30m"}]
    - `return_stops_details` (jsonb): Array of stop details for return flight
      Example: [{"city": "London", "airport": "LHR", "duration": "1h 45m"}]

  3. Notes
    - Each stop object contains: city, airport code, and layover duration
    - Fields are optional (nullable)
    - JSON format allows flexible storage of multiple stops
*/

-- Add detailed stops information for outbound flight
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'outbound_stops_details'
  ) THEN
    ALTER TABLE invoices ADD COLUMN outbound_stops_details jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add detailed stops information for return flight
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'return_stops_details'
  ) THEN
    ALTER TABLE invoices ADD COLUMN return_stops_details jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
