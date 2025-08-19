-- Fix signup failure: ensure profile creation logic matches current schema and is triggered on new users
-- 1) Replace handle_new_user to insert into profiles.user_id (not id)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  -- Ensure a default role exists for the new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 2) Ensure trigger exists on auth.users to call handle_new_user
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    -- drop and recreate to ensure latest function version
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3) Ensure profiles has updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create sub-rooms (room units) and room images support
-- 4) room_units table
CREATE TABLE IF NOT EXISTS public.room_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (code)
);

-- Enable RLS and policies for room_units
ALTER TABLE public.room_units ENABLE ROW LEVEL SECURITY;
-- Public can view units (for availability display)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'room_units' AND policyname = 'Public can view room units'
  ) THEN
    CREATE POLICY "Public can view room units"
      ON public.room_units
      FOR SELECT
      USING (true);
  END IF;
END $$;
-- Admins can manage units
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'room_units' AND policyname = 'Admins can manage room units'
  ) THEN
    CREATE POLICY "Admins can manage room units"
      ON public.room_units
      FOR ALL
      USING (has_role(auth.uid(), 'admin'))
      WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- updated_at trigger for room_units
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_room_units_updated_at'
  ) THEN
    CREATE TRIGGER update_room_units_updated_at
    BEFORE UPDATE ON public.room_units
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 5) room_images table to support multiple images per room
CREATE TABLE IF NOT EXISTS public.room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON public.room_images(room_id);
CREATE INDEX IF NOT EXISTS idx_room_units_room_id ON public.room_units(room_id);

-- Enable RLS and policies for room_images
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'room_images' AND policyname = 'Public can view room images'
  ) THEN
    CREATE POLICY "Public can view room images"
      ON public.room_images
      FOR SELECT
      USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'room_images' AND policyname = 'Admins can manage room images'
  ) THEN
    CREATE POLICY "Admins can manage room images"
      ON public.room_images
      FOR ALL
      USING (has_role(auth.uid(), 'admin'))
      WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- updated_at trigger for room_images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_room_images_updated_at'
  ) THEN
    CREATE TRIGGER update_room_images_updated_at
    BEFORE UPDATE ON public.room_images
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
