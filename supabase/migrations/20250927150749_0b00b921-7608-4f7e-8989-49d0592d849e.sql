-- Enable RLS and add user-scoped policies for bookings
-- This migration is idempotent: it checks for existing policies before creating them

-- Enable Row Level Security on bookings table
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'bookings' 
      AND policyname = 'Users can view their own bookings'
  ) THEN
    CREATE POLICY "Users can view their own bookings"
    ON public.bookings
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END$$;

-- Allow users to create their own bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'bookings' 
      AND policyname = 'Users can create their own bookings'
  ) THEN
    CREATE POLICY "Users can create their own bookings"
    ON public.bookings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

-- Allow users to update their own bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'bookings' 
      AND policyname = 'Users can update their own bookings'
  ) THEN
    CREATE POLICY "Users can update their own bookings"
    ON public.bookings
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END$$;

-- Optional: Allow users to delete their own bookings (only if needed by the app)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'bookings' 
      AND policyname = 'Users can delete their own bookings'
  ) THEN
    CREATE POLICY "Users can delete their own bookings"
    ON public.bookings
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END$$;