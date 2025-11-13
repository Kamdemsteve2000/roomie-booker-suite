-- Create trigger to automatically update room availability when bookings change
CREATE OR REPLACE FUNCTION public.trigger_update_room_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the existing room availability update function
  PERFORM public.update_room_unit_availability();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on bookings insert
DROP TRIGGER IF EXISTS on_booking_insert_update_availability ON public.bookings;
CREATE TRIGGER on_booking_insert_update_availability
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_room_availability();

-- Create trigger on bookings update
DROP TRIGGER IF EXISTS on_booking_update_update_availability ON public.bookings;
CREATE TRIGGER on_booking_update_update_availability
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_room_availability();

-- Create trigger on bookings delete
DROP TRIGGER IF EXISTS on_booking_delete_update_availability ON public.bookings;
CREATE TRIGGER on_booking_delete_update_availability
  AFTER DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_room_availability();