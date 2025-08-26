-- Phase 1: Database Schema Hardening and Complete RLS Implementation (Fixed)

-- First, make critical columns non-nullable where they should be
ALTER TABLE "Propiedades" ALTER COLUMN usuario_id SET NOT NULL;
ALTER TABLE "Contratos" ALTER COLUMN propiedad_id SET NOT NULL;
ALTER TABLE "Pagos" ALTER COLUMN contrato_id SET NOT NULL;
ALTER TABLE "Documentos" ALTER COLUMN propiedad_id SET NOT NULL;
ALTER TABLE "Incidencias" ALTER COLUMN propiedad_id SET NOT NULL;

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

-- Add missing INSERT, UPDATE, DELETE policies for Propiedades
CREATE POLICY "Usuarios pueden crear sus propiedades" 
ON public."Propiedades" 
FOR INSERT 
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuarios pueden actualizar sus propiedades" 
ON public."Propiedades" 
FOR UPDATE 
USING (usuario_id = auth.uid());

CREATE POLICY "Usuarios pueden eliminar sus propiedades" 
ON public."Propiedades" 
FOR DELETE 
USING (usuario_id = auth.uid());

-- Add missing policies for Contratos
CREATE POLICY "Crear contratos para propiedades propias" 
ON public."Contratos" 
FOR INSERT 
WITH CHECK (public.user_owns_property(propiedad_id));

CREATE POLICY "Actualizar contratos propios" 
ON public."Contratos" 
FOR UPDATE 
USING (public.user_owns_property(propiedad_id));

CREATE POLICY "Eliminar contratos propios" 
ON public."Contratos" 
FOR DELETE 
USING (public.user_owns_property(propiedad_id));

-- Add missing policies for Pagos
CREATE POLICY "Crear pagos para contratos propios" 
ON public."Pagos" 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM "Contratos" c 
  JOIN "Propiedades" p ON p.id = c.propiedad_id 
  WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
));

CREATE POLICY "Actualizar pagos propios" 
ON public."Pagos" 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM "Contratos" c 
  JOIN "Propiedades" p ON p.id = c.propiedad_id 
  WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
));

CREATE POLICY "Eliminar pagos propios" 
ON public."Pagos" 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM "Contratos" c 
  JOIN "Propiedades" p ON p.id = c.propiedad_id 
  WHERE c.id = contrato_id AND p.usuario_id = auth.uid()
));

-- Add missing policies for Documentos
CREATE POLICY "Crear documentos para propiedades propias" 
ON public."Documentos" 
FOR INSERT 
WITH CHECK (public.user_owns_property(propiedad_id));

CREATE POLICY "Actualizar documentos propios" 
ON public."Documentos" 
FOR UPDATE 
USING (public.user_owns_property(propiedad_id));

CREATE POLICY "Eliminar documentos propios" 
ON public."Documentos" 
FOR DELETE 
USING (public.user_owns_property(propiedad_id));

-- Add missing policies for Incidencias
CREATE POLICY "Crear incidencias para propiedades propias" 
ON public."Incidencias" 
FOR INSERT 
WITH CHECK (public.user_owns_property(propiedad_id));

CREATE POLICY "Actualizar incidencias propias" 
ON public."Incidencias" 
FOR UPDATE 
USING (public.user_owns_property(propiedad_id));

CREATE POLICY "Eliminar incidencias propias" 
ON public."Incidencias" 
FOR DELETE 
USING (public.user_owns_property(propiedad_id));

-- Add missing policies for Usuarios
CREATE POLICY "Usuarios pueden crear su perfil" 
ON public."Usuarios" 
FOR INSERT 
WITH CHECK (id = auth.uid());

CREATE POLICY "Usuarios pueden actualizar su perfil" 
ON public."Usuarios" 
FOR UPDATE 
USING (id = auth.uid());

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

CREATE TRIGGER validate_payment_amount_trigger
  BEFORE INSERT OR UPDATE ON public."Pagos"
  FOR EACH ROW EXECUTE FUNCTION public.validate_payment_amount();