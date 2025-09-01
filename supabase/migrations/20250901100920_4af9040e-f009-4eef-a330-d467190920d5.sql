-- Create test users and demo properties using gen_random_uuid()

-- Create specific UUIDs for demo users
DO $$
DECLARE
    propietario_id UUID := '11111111-1111-1111-1111-111111111111'::uuid;
    inquilino_id UUID := '22222222-2222-2222-2222-222222222222'::uuid;
    prop1_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;
    prop2_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;
    prop3_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid;
    prop4_id UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid;
    contract1_id UUID := 'c1111111-1111-1111-1111-111111111111'::uuid;
    contract2_id UUID := 'c2222222-2222-2222-2222-222222222222'::uuid;
BEGIN
    -- Insert demo profiles
    INSERT INTO public."Usuarios" (id, email, nombre, rol) VALUES 
      (propietario_id, 'propietario@ejemplo.com', 'Usuario Propietario Demo', 'propietario'),
      (inquilino_id, 'inquilino@ejemplo.com', 'Usuario Inquilino Demo', 'inquilino')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      nombre = EXCLUDED.nombre,
      rol = EXCLUDED.rol;

    -- Insert demo properties owned by the demo property owner
    INSERT INTO public."Propiedades" (id, usuario_id, direccion, descripcion, foto_url) VALUES 
      (prop1_id, propietario_id, 'Calle Gran Vía 28, Malasaña, Madrid', 'Apartamento moderno en el centro de Madrid. Totalmente reformado con todas las comodidades. Ubicado en una de las zonas más vibrantes de la ciudad, cerca de restaurantes, bares y transporte público. Ideal para profesionales o estudiantes.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'),
      (prop2_id, propietario_id, 'Calle Hortaleza 15, Chueca, Madrid', 'Loft industrial completamente reformado en el corazón de Chueca. Espacio diáfano con techos altos, grandes ventanales y diseño contemporáneo. Perfecto para estancias cortas o largas. Zona muy bien comunicada con metro y autobuses.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'),
      (prop3_id, propietario_id, 'Calle Serrano 85, Salamanca, Madrid', 'Espectacular ático con terraza privada en el exclusivo barrio de Salamanca. Tres habitaciones amplias, dos baños completos y una terraza de 30m2 con vistas panorámicas. Edificio con portero y garaje opcional.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'),
      (prop4_id, propietario_id, 'Plaza de la Paja 12, La Latina, Madrid', 'Estudio luminoso en una de las plazas más bonitas de Madrid. Completamente equipado con cocina americana y baño moderno. Ubicación inmejorable en el Madrid de los Austrias, rodeado de historia y ambiente tradicional.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop')
    ON CONFLICT (id) DO UPDATE SET
      direccion = EXCLUDED.direccion,
      descripcion = EXCLUDED.descripcion,
      foto_url = EXCLUDED.foto_url;

    -- Insert some demo contracts for the properties
    INSERT INTO public."Contratos" (id, propiedad_id, fecha_inicio, fecha_fin, estado, pdf_url) VALUES 
      (contract1_id, prop1_id, '2024-01-01', '2024-12-31', 'activo', NULL),
      (contract2_id, prop3_id, '2024-03-01', '2025-02-28', 'activo', NULL)
    ON CONFLICT (id) DO UPDATE SET
      fecha_inicio = EXCLUDED.fecha_inicio,
      fecha_fin = EXCLUDED.fecha_fin,
      estado = EXCLUDED.estado;

    -- Insert some demo payments
    INSERT INTO public."Pagos" (id, contrato_id, fecha_pago, importe, estado) VALUES 
      (gen_random_uuid(), contract1_id, '2024-01-01', 1200.00, 'pagado'),
      (gen_random_uuid(), contract1_id, '2024-02-01', 1200.00, 'pagado'),
      (gen_random_uuid(), contract1_id, '2024-03-01', 1200.00, 'pendiente'),
      (gen_random_uuid(), contract2_id, '2024-03-01', 2500.00, 'pagado'),
      (gen_random_uuid(), contract2_id, '2024-04-01', 2500.00, 'pagado');

    -- Insert some demo incidents
    INSERT INTO public."Incidencias" (id, propiedad_id, descripcion, estado, fecha_creacion, fecha_resolucion) VALUES 
      (gen_random_uuid(), prop1_id, 'Goteo en el grifo de la cocina', 'resuelto', '2024-02-15 10:30:00', '2024-02-16 14:20:00'),
      (gen_random_uuid(), prop2_id, 'Problema con la calefacción', 'en_proceso', '2024-03-10 09:15:00', NULL),
      (gen_random_uuid(), prop3_id, 'Revisión anual de instalaciones', 'pendiente', '2024-03-20 16:45:00', NULL);

    -- Insert some demo documents
    INSERT INTO public."Documentos" (id, propiedad_id, nombre_archivo, tipo, url, fecha_subida) VALUES 
      (gen_random_uuid(), prop1_id, 'cedula_habitabilidad.pdf', 'cedula_habitabilidad', '/docs/cedula_apartamento_centro.pdf', '2024-01-01 12:00:00'),
      (gen_random_uuid(), prop1_id, 'seguro_hogar.pdf', 'seguro', '/docs/seguro_apartamento_centro.pdf', '2024-01-01 12:15:00'),
      (gen_random_uuid(), prop3_id, 'escritura_propiedad.pdf', 'escritura', '/docs/escritura_atico_salamanca.pdf', '2024-03-01 10:30:00'),
      (gen_random_uuid(), prop3_id, 'ibi_2024.pdf', 'ibi', '/docs/ibi_atico_salamanca_2024.pdf', '2024-03-01 10:45:00');
END $$;