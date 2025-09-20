-- Add admin access policies for bookings table
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all bookings" 
ON public.bookings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin access policies for contact messages table
CREATE POLICY "Admins can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));