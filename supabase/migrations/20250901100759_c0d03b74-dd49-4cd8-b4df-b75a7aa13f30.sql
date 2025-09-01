-- Create test users and demo properties

-- First, let's insert the two demo users directly into auth.users table
-- Note: In production, these would be created through the signup process
-- For demo purposes, we'll create basic user records and profiles

-- Insert demo profiles
INSERT INTO public."Usuarios" (id, email, nombre, rol) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'propietario@ejemplo.com', 'Usuario Propietario Demo', 'propietario'),
  ('22222222-2222-2222-2222-222222222222', 'inquilino@ejemplo.com', 'Usuario Inquilino Demo', 'inquilino')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nombre = EXCLUDED.nombre,
  rol = EXCLUDED.rol;

-- Insert demo properties owned by the demo property owner
INSERT INTO public."Propiedades" (id, usuario_id, direccion, descripcion, foto_url) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Calle Gran Vía 28, Malasaña, Madrid', 'Apartamento moderno en el centro de Madrid. Totalmente reformado con todas las comodidades. Ubicado en una de las zonas más vibrantes de la ciudad, cerca de restaurantes, bares y transporte público. Ideal para profesionales o estudiantes.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Calle Hortaleza 15, Chueca, Madrid', 'Loft industrial completamente reformado en el corazón de Chueca. Espacio diáfano con techos altos, grandes ventanales y diseño contemporáneo. Perfecto para estancias cortas o largas. Zona muy bien comunicada con metro y autobuses.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Calle Serrano 85, Salamanca, Madrid', 'Espectacular ático con terraza privada en el exclusivo barrio de Salamanca. Tres habitaciones amplias, dos baños completos y una terraza de 30m2 con vistas panorámicas. Edificio con portero y garaje opcional.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Plaza de la Paja 12, La Latina, Madrid', 'Estudio luminoso en una de las plazas más bonitas de Madrid. Completamente equipado con cocina americana y baño moderno. Ubicación inmejorable en el Madrid de los Austrias, rodeado de historia y ambiente tradicional.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop')
ON CONFLICT (id) DO UPDATE SET
  direccion = EXCLUDED.direccion,
  descripcion = EXCLUDED.descripcion,
  foto_url = EXCLUDED.foto_url;

-- Insert some demo contracts for the properties
INSERT INTO public."Contratos" (id, propiedad_id, fecha_inicio, fecha_fin, estado, pdf_url) VALUES 
  ('contract1-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-01-01', '2024-12-31', 'activo', NULL),
  ('contract2-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2024-03-01', '2025-02-28', 'activo', NULL)
ON CONFLICT (id) DO UPDATE SET
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  estado = EXCLUDED.estado;

-- Insert some demo payments
INSERT INTO public."Pagos" (id, contrato_id, fecha_pago, importe, estado) VALUES 
  ('payment1-1111-1111-1111-111111111111', 'contract1-1111-1111-1111-111111111111', '2024-01-01', 1200.00, 'pagado'),
  ('payment2-2222-2222-2222-222222222222', 'contract1-1111-1111-1111-111111111111', '2024-02-01', 1200.00, 'pagado'),
  ('payment3-3333-3333-3333-333333333333', 'contract1-1111-1111-1111-111111111111', '2024-03-01', 1200.00, 'pendiente'),
  ('payment4-4444-4444-4444-444444444444', 'contract2-2222-2222-2222-222222222222', '2024-03-01', 2500.00, 'pagado'),
  ('payment5-5555-5555-5555-555555555555', 'contract2-2222-2222-2222-222222222222', '2024-04-01', 2500.00, 'pagado')
ON CONFLICT (id) DO UPDATE SET
  fecha_pago = EXCLUDED.fecha_pago,
  importe = EXCLUDED.importe,
  estado = EXCLUDED.estado;

-- Insert some demo incidents
INSERT INTO public."Incidencias" (id, propiedad_id, descripcion, estado, fecha_creacion, fecha_resolucion) VALUES 
  ('incident1-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Goteo en el grifo de la cocina', 'resuelto', '2024-02-15 10:30:00', '2024-02-16 14:20:00'),
  ('incident2-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Problema con la calefacción', 'en_proceso', '2024-03-10 09:15:00', NULL),
  ('incident3-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Revisión anual de instalaciones', 'pendiente', '2024-03-20 16:45:00', NULL)
ON CONFLICT (id) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  estado = EXCLUDED.estado,
  fecha_creacion = EXCLUDED.fecha_creacion,
  fecha_resolucion = EXCLUDED.fecha_resolucion;

-- Insert some demo documents
INSERT INTO public."Documentos" (id, propiedad_id, nombre_archivo, tipo, url, fecha_subida) VALUES 
  ('doc1-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cedula_habitabilidad.pdf', 'cedula_habitabilidad', '/docs/cedula_apartamento_centro.pdf', '2024-01-01 12:00:00'),
  ('doc2-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seguro_hogar.pdf', 'seguro', '/docs/seguro_apartamento_centro.pdf', '2024-01-01 12:15:00'),
  ('doc3-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'escritura_propiedad.pdf', 'escritura', '/docs/escritura_atico_salamanca.pdf', '2024-03-01 10:30:00'),
  ('doc4-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ibi_2024.pdf', 'ibi', '/docs/ibi_atico_salamanca_2024.pdf', '2024-03-01 10:45:00')
ON CONFLICT (id) DO UPDATE SET
  nombre_archivo = EXCLUDED.nombre_archivo,
  tipo = EXCLUDED.tipo,
  url = EXCLUDED.url,
  fecha_subida = EXCLUDED.fecha_subida;