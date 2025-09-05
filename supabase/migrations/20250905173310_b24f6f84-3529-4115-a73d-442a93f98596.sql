-- =============== FUNCIÓN RPC ===============
CREATE OR REPLACE FUNCTION public.create_service_request_and_incident(
    p_type TEXT,
    p_date DATE,
    p_time_slot TEXT,
    p_hours INT,
    p_priority priority_level,
    p_maint_cat maintenance_category,
    p_description TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sr_id UUID;
    v_user_role TEXT;
BEGIN
    -- Obtener el rol del usuario
    SELECT role INTO v_user_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    
    -- Crear service_request
    INSERT INTO public.service_requests (
        user_id, 
        role, 
        type, 
        date, 
        time_slot, 
        hours, 
        priority, 
        maintenance_category, 
        description
    )
    VALUES (
        auth.uid(), 
        v_user_role, 
        p_type, 
        p_date, 
        p_time_slot, 
        p_hours, 
        p_priority, 
        p_maint_cat, 
        p_description
    )
    RETURNING id INTO v_sr_id;

    -- Si es mantenimiento, crear incidencia enlazada
    IF p_type = 'mantenimiento' THEN
        INSERT INTO public."Incidencias" (
            service_request_id, 
            descripcion, 
            estado,
            fecha_creacion
        )
        VALUES (
            v_sr_id, 
            p_description,
            'pendiente',
            NOW()
        );
    END IF;

    RETURN v_sr_id;
END;
$$;