/*
  # Fitness Assessment Schema

  1. New Tables
    - `phone_numbers`
      - `id` (uuid, primary key)
      - `phone` (text, unique)
      - `verified` (boolean)
      - `created_at` (timestamp)
    
    - `assessments`
      - `id` (uuid, primary key)
      - `phone_id` (uuid, foreign key)
      - `sex` (text)
      - `age_range` (text)
      - `objective` (text)
      - `inactive_period` (text)
      - `experience_period` (text)
      - `availability` (text)
      - `training_level` (text)
      - `chest_pain` (boolean)
      - `medical_clearance` (boolean)
      - `medical_document_url` (text)
      - `medication` (boolean)
      - `pre_existing_condition` (text)
      - `life_threatening_condition` (boolean)
      - `injury` (boolean)
      - `agreement` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phone_numbers(id) NOT NULL,
  sex text NOT NULL,
  age_range text NOT NULL,
  objective text NOT NULL,
  inactive_period text NOT NULL,
  experience_period text NOT NULL,
  availability text NOT NULL,
  training_level text NOT NULL,
  chest_pain boolean NOT NULL,
  medical_clearance boolean,
  medical_document_url text,
  medication boolean NOT NULL,
  pre_existing_condition text NOT NULL,
  life_threatening_condition boolean NOT NULL,
  injury boolean NOT NULL,
  agreement boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for medical documents if not exists
DO $$
BEGIN
    -- Ensure storage schema exists
    CREATE SCHEMA IF NOT EXISTS storage;

    -- Ensure storage tables exist
    CREATE TABLE IF NOT EXISTS storage.buckets (
        id text PRIMARY KEY,
        name text NOT NULL,
        public boolean DEFAULT false,
        avif_autodetection boolean DEFAULT false,
        file_size_limit bigint,
        allowed_mime_types text[],
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now(),
        owner uuid DEFAULT auth.uid(),
        CONSTRAINT buckets_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id)
    );

    CREATE TABLE IF NOT EXISTS storage.objects (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        bucket_id text,
        name text,
        owner uuid,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now(),
        last_accessed_at timestamp with time zone DEFAULT now(),
        metadata jsonb,
        path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
        CONSTRAINT objects_buckets_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)
    );

    -- Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'medical-documents',
        'medical-documents',
        true,
        5242880, -- 5MB in bytes
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ]
    )
    ON CONFLICT (id) DO UPDATE
    SET
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;
END $$;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public uploads to medical documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read medical documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to update medical documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to delete medical documents" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Allow public uploads to medical documents"
ON storage.objects FOR INSERT TO public
WITH CHECK (
    bucket_id = 'medical-documents'
    AND (CASE 
        WHEN metadata->>'content-type' IS NOT NULL 
        THEN metadata->>'content-type' = ANY (SELECT unnest(allowed_mime_types) FROM storage.buckets WHERE id = 'medical-documents')
        ELSE TRUE
    END)
);

CREATE POLICY "Allow public to read medical documents"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'medical-documents');

CREATE POLICY "Allow public to update medical documents"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'medical-documents')
WITH CHECK (bucket_id = 'medical-documents');

CREATE POLICY "Allow public to delete medical documents"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'medical-documents');

-- Create policies for tables
CREATE POLICY "Allow insert for all users" ON phone_numbers
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow select for verified numbers" ON phone_numbers
  FOR SELECT TO public
  USING (verified = true);

CREATE POLICY "Allow insert for verified numbers" ON assessments
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phone_numbers
      WHERE phone_numbers.id = phone_id
      AND phone_numbers.verified = true
    )
  );

CREATE POLICY "Allow select own assessment" ON assessments
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM phone_numbers
      WHERE phone_numbers.id = phone_id
      AND phone_numbers.verified = true
    )
  );