-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1 LIMIT 1;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles table to include phone
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

-- Add trigger to create user profile and assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create dashboard_metrics table for admin analytics
CREATE TABLE public.dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    metric_value DECIMAL NOT NULL,
    metric_label TEXT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view dashboard metrics" 
ON public.dashboard_metrics 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create room_pricing table for pricing management
CREATE TABLE public.room_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    base_price DECIMAL NOT NULL,
    seasonal_multiplier DECIMAL DEFAULT 1.0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.room_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view room pricing" 
ON public.room_pricing 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage room pricing" 
ON public.room_pricing 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Add room status and inventory fields
ALTER TABLE public.rooms ADD COLUMN status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'out_of_order'));
ALTER TABLE public.rooms ADD COLUMN inventory_count INTEGER DEFAULT 1;

-- Update bookings table with more fields for admin management
ALTER TABLE public.bookings ADD COLUMN guest_count INTEGER DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN special_requests TEXT;
ALTER TABLE public.bookings ADD COLUMN admin_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN total_amount DECIMAL;

-- Create content_pages table for CMS
CREATE TABLE public.content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    meta_description TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published content" 
ON public.content_pages 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all content" 
ON public.content_pages 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at columns
CREATE TRIGGER update_room_pricing_updated_at
    BEFORE UPDATE ON public.room_pricing
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at
    BEFORE UPDATE ON public.content_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample pricing data
INSERT INTO public.room_pricing (room_type_id, base_price, start_date, end_date)
SELECT id, 
       CASE 
         WHEN type = 'Standard Room' THEN 150.00
         WHEN type = 'Deluxe Room' THEN 250.00
         WHEN type = 'Executive Suite' THEN 450.00
         ELSE 200.00
       END,
       CURRENT_DATE,
       CURRENT_DATE + INTERVAL '1 year'
FROM public.rooms;

-- Insert sample dashboard metrics
INSERT INTO public.dashboard_metrics (metric_type, metric_value, metric_label, period_start, period_end)
VALUES 
    ('bookings', 156, 'Total Bookings', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE),
    ('revenue', 45230, 'Revenue ($)', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE),
    ('occupancy', 87, 'Occupancy Rate (%)', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE),
    ('satisfaction', 4.8, 'Guest Satisfaction', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);

-- Insert sample content pages
INSERT INTO public.content_pages (slug, title, content, meta_description, published)
VALUES 
    ('home', 'Welcome to Grand Luxe Hotel', 'Experience luxury and comfort at our premier hotel.', 'Luxury hotel with premium amenities and service', true),
    ('about', 'About Grand Luxe Hotel', 'Learn about our history and commitment to excellence.', 'About our luxury hotel and our story', true),
    ('amenities', 'Hotel Amenities', 'Discover our world-class facilities and services.', 'Hotel amenities and facilities', true);