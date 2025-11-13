-- Fix search_path security issue for trigger function
CREATE OR REPLACE FUNCTION public.trigger_update_room_availability()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the existing room availability update function
  PERFORM public.update_room_unit_availability();
  RETURN NEW;
END;
$$;