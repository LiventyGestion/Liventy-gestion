-- Fix security warnings: Set search_path for all functions

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT rol FROM public."Usuarios" WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fix user_owns_property function  
CREATE OR REPLACE FUNCTION public.user_owns_property(property_id uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public."Propiedades" 
    WHERE id = property_id AND usuario_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fix handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix validate_contract_dates function
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
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix validate_payment_amount function
CREATE OR REPLACE FUNCTION public.validate_payment_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.importe IS NOT NULL AND NEW.importe <= 0 THEN
    RAISE EXCEPTION 'El importe del pago debe ser mayor que cero';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;