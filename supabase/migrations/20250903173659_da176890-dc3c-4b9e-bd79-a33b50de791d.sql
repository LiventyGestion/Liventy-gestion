-- Create test users for demo purposes
-- First, insert users into auth.users table (this requires special permissions)
-- We'll create profiles for these users in our Usuarios table

-- Insert demo users into Usuarios table with test data
INSERT INTO public."Usuarios" (id, email, nombre, rol) VALUES 
('11111111-1111-1111-1111-111111111111', 'propietario@ejemplo.com', 'Usuario Propietario Demo', 'propietario'),
('22222222-2222-2222-2222-222222222222', 'inquilino@ejemplo.com', 'Usuario Inquilino Demo', 'inquilino')
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  rol = EXCLUDED.rol;