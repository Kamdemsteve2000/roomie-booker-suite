-- Créer un admin par défaut
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@hotel.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Hotel", "last_name": "Admin"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Créer le profil admin
INSERT INTO public.profiles (user_id, first_name, last_name, phone)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Hotel',
  'Admin',
  '+1234567890'
) ON CONFLICT (user_id) DO NOTHING;

-- Assigner le rôle admin
INSERT INTO public.user_roles (user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;