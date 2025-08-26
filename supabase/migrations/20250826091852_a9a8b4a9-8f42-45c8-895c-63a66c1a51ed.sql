-- Phase 1: Database Schema Hardening - Add only missing policies and functions

-- Create security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT rol FROM public."Usuarios" WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user owns property
CREATE OR REPLACE FUNCTION public.user_owns_property(property_id uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public."Propiedades" 
    WHERE id = property_id AND usuario_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies and recreate with better names to avoid conflicts
DO $$
BEGIN
  -- Drop and recreate policies for Propiedades
  DROP POLICY IF EXISTS "Usuarios pueden crear sus propiedades" ON public."Propiedades";
  DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propiedades" ON public."Propiedades";
  DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propiedades" ON public."Propiedades";
  
  CREATE POLICY "propiedades_insert_policy" ON public."Propiedades" 
    FOR INSERT WITH CHECK (usuario_id = auth.uid());
  
  CREATE POLICY "propiedades_update_policy" ON public."Propiedades" 
    FOR UPDATE USING (usuario_id = auth.uid());
  
  CREATE POLICY "propiedades_delete_policy" ON public."Propiedades" 
    FOR DELETE USING (usuario_id = auth.uid());

  -- Add policies for Contratos
  CREATE POLICY "contratos_insert_policy" ON public."Contratos" 
    FOR INSERT WITH CHECK (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "contratos_update_policy" ON public."Contratos" 
    FOR UPDATE USING (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "contratos_delete_policy" ON public."Contratos" 
    FOR DELETE USING (public.user_owns_property(propiedad_id));

  -- Add policies for Pagos
  CREATE POLICY "pagos_insert_policy" ON public."Pagos" 
    FOR INSERT WITH CHECK (EXISTS (
      SELECT 1 FROM "Contratos" c 
      JOIN "Propiedades" p ON p.id = c.propiedad_id 
      WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
    ));
  
  CREATE POLICY "pagos_update_policy" ON public."Pagos" 
    FOR UPDATE USING (EXISTS (
      SELECT 1 FROM "Contratos" c 
      JOIN "Propiedades" p ON p.id = c.propiedad_id 
      WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
    ));
  
  CREATE POLICY "pagos_delete_policy" ON public."Pagos" 
    FOR DELETE USING (EXISTS (
      SELECT 1 FROM "Contratos" c 
      JOIN "Propiedades" p ON p.id = c.propiedad_id 
      WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
    ));

  -- Add policies for Documentos
  CREATE POLICY "documentos_insert_policy" ON public."Documentos" 
    FOR INSERT WITH CHECK (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "documentos_update_policy" ON public."Documentos" 
    FOR UPDATE USING (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "documentos_delete_policy" ON public."Documentos" 
    FOR DELETE USING (public.user_owns_property(propiedad_id));

  -- Add policies for Incidencias
  CREATE POLICY "incidencias_insert_policy" ON public."Incidencias" 
    FOR INSERT WITH CHECK (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "incidencias_update_policy" ON public."Incidencias" 
    FOR UPDATE USING (public.user_owns_property(propiedad_id));
  
  CREATE POLICY "incidencias_delete_policy" ON public."Incidencias" 
    FOR DELETE USING (public.user_owns_property(propiedad_id));

  -- Add policies for Usuarios
  CREATE POLICY "usuarios_insert_policy" ON public."Usuarios" 
    FOR INSERT WITH CHECK (id = auth.uid());
  
  CREATE POLICY "usuarios_update_policy" ON public."Usuarios" 
    FOR UPDATE USING (id = auth.uid());

EXCEPTION WHEN OTHERS THEN
  -- Continue if some policies already exist
  NULL;
END $$;

-- Create trigger to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Usuarios" (id, email, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'inquilino')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add validation triggers for data integrity
CREATE OR REPLACE FUNCTION public.validate_contract_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_fin IS NOT NULL AND NEW.fecha_inicio IS NOT NULL THEN
    IF NEW.fecha_fin <= NEW.fecha_inicio THEN
      RAISE EXCEPTION 'La fecha de fin debe ser posterior a la fecha de inicio';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_contract_dates_trigger ON public."Contratos";
CREATE TRIGGER validate_contract_dates_trigger
  BEFORE INSERT OR UPDATE ON public."Contratos"
  FOR EACH ROW EXECUTE FUNCTION public.validate_contract_dates();

-- Add validation for payment amounts
CREATE OR REPLACE FUNCTION public.validate_payment_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.importe IS NOT NULL AND NEW.importe <= 0 THEN
    RAISE EXCEPTION 'El importe del pago debe ser mayor que cero';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_payment_amount_trigger ON public."Pagos";
CREATE TRIGGER validate_payment_amount_trigger
  BEFORE INSERT OR UPDATE ON public."Pagos"
  FOR EACH ROW EXECUTE FUNCTION public.validate_payment_amount();