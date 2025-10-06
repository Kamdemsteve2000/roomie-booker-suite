-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for room-images bucket
CREATE POLICY "Admins can upload room images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update room images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'room-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete room images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'room-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view room images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-images');

-- Add RLS policies for rooms table to allow admin CRUD
CREATE POLICY "Admins can insert rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update rooms"
ON public.rooms
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete rooms"
ON public.rooms
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to check room availability based on bookings
CREATE OR REPLACE FUNCTION public.update_room_unit_availability()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark units as occupied if they have active bookings
  UPDATE public.room_units
  SET status = 'occupied'
  WHERE id IN (
    SELECT DISTINCT ru.id
    FROM public.room_units ru
    INNER JOIN public.bookings b ON b.room_id = ru.room_id
    WHERE b.status IN ('confirmed', 'checked_in')
      AND CURRENT_DATE BETWEEN b.check_in_date AND b.check_out_date
  );
  
  -- Mark units as available if they have no active bookings
  UPDATE public.room_units
  SET status = 'available'
  WHERE id NOT IN (
    SELECT DISTINCT ru.id
    FROM public.room_units ru
    INNER JOIN public.bookings b ON b.room_id = ru.room_id
    WHERE b.status IN ('confirmed', 'checked_in')
      AND CURRENT_DATE BETWEEN b.check_in_date AND b.check_out_date
  );
END;
$$;