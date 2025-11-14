-- Fix search_path for functions that don't have it

-- Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1 LIMIT 1;
$$;

-- Fix update_room_unit_availability function
CREATE OR REPLACE FUNCTION public.update_room_unit_availability()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;