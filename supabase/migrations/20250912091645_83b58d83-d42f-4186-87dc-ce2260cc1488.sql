-- Security Enhancement Phase 1 & 2: Critical and Medium Priority Fixes (CORRECTED)

-- =============================================
-- PHASE 1: STRENGTHEN USER DATA POLICIES (CRITICAL)
-- =============================================

-- Enhanced logging for Usuarios table access attempts (using AFTER triggers)
CREATE OR REPLACE FUNCTION public.log_usuarios_access_detailed()
RETURNS TRIGGER AS $$
BEGIN
    -- Log authenticated access for monitoring
    IF TG_OP = 'UPDATE' AND auth.uid() IS NOT NULL THEN
        -- Log cross-user access attempts
        IF OLD.id != auth.uid() THEN
            PERFORM public.log_security_event(
                'cross_user_data_access_attempt',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object(
                    'attempted_user_id', OLD.id,
                    'operation', TG_OP,
                    'timestamp', NOW()
                ),
                'high'
            );
        END IF;
    END IF;
    
    -- Log any modifications to user data
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_security_event(
            'user_data_created',
            NEW.id,
            NULL,
            NULL,
            jsonb_build_object(
                'user_id', NEW.id,
                'email', NEW.email,
                'timestamp', NOW()
            ),
            'low'
        );
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        -- Log significant changes
        IF OLD.email != NEW.email OR OLD.rol != NEW.rol THEN
            PERFORM public.log_security_event(
                'user_data_modified',
                NEW.id,
                NULL,
                NULL,
                jsonb_build_object(
                    'user_id', NEW.id,
                    'old_email', OLD.email,
                    'new_email', NEW.email,
                    'old_role', OLD.rol,
                    'new_role', NEW.rol,
                    'timestamp', NOW()
                ),
                'medium'
            );
        END IF;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        PERFORM public.log_security_event(
            'user_data_deleted',
            OLD.id,
            NULL,
            NULL,
            jsonb_build_object(
                'deleted_user_id', OLD.id,
                'deleted_email', OLD.email,
                'timestamp', NOW()
            ),
            'high'
        );
        RETURN OLD;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for Usuarios access logging
DROP TRIGGER IF EXISTS usuarios_access_detailed_monitor ON public."Usuarios";
CREATE TRIGGER usuarios_access_detailed_monitor
    AFTER INSERT OR UPDATE OR DELETE ON public."Usuarios"
    FOR EACH ROW
    EXECUTE FUNCTION public.log_usuarios_access_detailed();

-- =============================================
-- PHASE 2: ENHANCE FINANCIAL DATA PROTECTION (MEDIUM PRIORITY)
-- =============================================

-- Comprehensive audit logging for Pagos table
CREATE OR REPLACE FUNCTION public.log_pagos_audit()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get user role for context
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_security_event(
            'payment_data_created',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'payment_id', NEW.id,
                'contract_id', NEW.contrato_id,
                'amount', NEW.importe,
                'status', NEW.estado,
                'user_role', user_role,
                'timestamp', NOW()
            ),
            'medium'
        );
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        PERFORM public.log_security_event(
            'payment_data_modified',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'payment_id', NEW.id,
                'contract_id', NEW.contrato_id,
                'old_amount', OLD.importe,
                'new_amount', NEW.importe,
                'old_status', OLD.estado,
                'new_status', NEW.estado,
                'user_role', user_role,
                'timestamp', NOW()
            ),
            'medium'
        );
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        PERFORM public.log_security_event(
            'payment_data_deleted',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'payment_id', OLD.id,
                'contract_id', OLD.contrato_id,
                'amount', OLD.importe,
                'user_role', user_role,
                'timestamp', NOW()
            ),
            'high'
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create audit trigger for Pagos table
DROP TRIGGER IF EXISTS pagos_audit_log ON public."Pagos";
CREATE TRIGGER pagos_audit_log
    AFTER INSERT OR UPDATE OR DELETE ON public."Pagos"
    FOR EACH ROW
    EXECUTE FUNCTION public.log_pagos_audit();

-- Enhanced validation for payment operations
CREATE OR REPLACE FUNCTION public.validate_payment_security()
RETURNS TRIGGER AS $$
DECLARE
    property_owner_id UUID;
    user_role TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    
    -- For non-admin users, ensure they own the property
    IF user_role != 'admin' THEN
        -- Get property owner through contract relationship
        SELECT p.usuario_id INTO property_owner_id
        FROM public."Propiedades" p
        JOIN public."Contratos" c ON c.propiedad_id = p.id
        WHERE c.id = NEW.contrato_id;
        
        -- Ensure user owns the property
        IF property_owner_id != auth.uid() THEN
            PERFORM public.log_security_event(
                'unauthorized_payment_operation',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object(
                    'attempted_contract_id', NEW.contrato_id,
                    'property_owner', property_owner_id,
                    'operation', TG_OP,
                    'timestamp', NOW()
                ),
                'critical'
            );
            RAISE EXCEPTION 'No tiene permisos para realizar esta operación en este pago';
        END IF;
    END IF;
    
    -- Additional validation for payment amounts
    IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.importe IS NOT NULL THEN
        IF NEW.importe <= 0 THEN
            PERFORM public.log_security_event(
                'invalid_payment_amount',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object(
                    'invalid_amount', NEW.importe,
                    'contract_id', NEW.contrato_id,
                    'timestamp', NOW()
                ),
                'medium'
            );
            RAISE EXCEPTION 'El importe del pago debe ser mayor que cero';
        END IF;
        
        -- Log large payment amounts for review
        IF NEW.importe > 10000 THEN
            PERFORM public.log_security_event(
                'large_payment_amount',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object(
                    'amount', NEW.importe,
                    'contract_id', NEW.contrato_id,
                    'requires_review', true,
                    'timestamp', NOW()
                ),
                'medium'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create security validation trigger for Pagos
DROP TRIGGER IF EXISTS pagos_security_validation ON public."Pagos";
CREATE TRIGGER pagos_security_validation
    BEFORE INSERT OR UPDATE ON public."Pagos"
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_payment_security();

-- =============================================
-- SECURITY MONITORING ENHANCEMENTS
-- =============================================

-- Enhanced suspicious activity detection with more granular analysis
CREATE OR REPLACE FUNCTION public.detect_advanced_security_threats(check_window_minutes INTEGER DEFAULT 60)
RETURNS TABLE(
    threat_type TEXT,
    threat_level TEXT,
    identifier TEXT,
    event_count BIGINT,
    first_occurrence TIMESTAMP WITH TIME ZONE,
    last_occurrence TIMESTAMP WITH TIME ZONE,
    recommendation TEXT,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    -- Critical: Multiple unauthorized access attempts
    SELECT 
        'unauthorized_access_pattern'::TEXT,
        'critical'::TEXT,
        COALESCE(sal.user_id::TEXT, sal.ip_address, 'unknown'),
        COUNT(*)::BIGINT,
        MIN(sal.created_at),
        MAX(sal.created_at),
        'Immediately investigate and consider account suspension/IP blocking'::TEXT,
        jsonb_build_object(
            'event_types', array_agg(DISTINCT sal.event_type),
            'severity_levels', array_agg(DISTINCT sal.severity)
        )
    FROM public.security_audit_log sal
    WHERE sal.event_type IN (
        'unauthorized_lead_access_attempt',
        'non_admin_lead_access_attempt', 
        'cross_user_data_access_attempt',
        'unauthorized_payment_operation'
    )
    AND sal.created_at >= NOW() - (check_window_minutes || ' minutes')::INTERVAL
    GROUP BY COALESCE(sal.user_id::TEXT, sal.ip_address, 'unknown')
    HAVING COUNT(*) >= 3
    
    UNION ALL
    
    -- High: Financial data manipulation patterns
    SELECT 
        'financial_manipulation_pattern'::TEXT,
        'high'::TEXT,
        sal.user_id::TEXT,
        COUNT(*)::BIGINT,
        MIN(sal.created_at),
        MAX(sal.created_at),
        'Review all financial operations and validate legitimacy'::TEXT,
        jsonb_build_object(
            'operations', array_agg(sal.event_type),
            'details', array_agg(sal.details)
        )
    FROM public.security_audit_log sal
    WHERE sal.event_type IN (
        'payment_data_modified',
        'payment_data_deleted',
        'large_payment_amount'
    )
    AND sal.created_at >= NOW() - (check_window_minutes || ' minutes')::INTERVAL
    AND sal.user_id IS NOT NULL
    GROUP BY sal.user_id
    HAVING COUNT(*) >= 2
    
    UNION ALL
    
    -- Medium: Excessive rate limit violations
    SELECT 
        'rate_limit_abuse'::TEXT,
        'medium'::TEXT,
        lr.email,
        lr.attempt_count::BIGINT,
        lr.first_attempt,
        lr.last_attempt,
        'Monitor for bot activity and consider temporary restrictions'::TEXT,
        jsonb_build_object('email_domain', split_part(lr.email, '@', 2))
    FROM public.lead_rate_limits lr
    WHERE lr.attempt_count >= 5
    AND lr.last_attempt >= NOW() - (check_window_minutes || ' minutes')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Automated security report generation
CREATE OR REPLACE FUNCTION public.generate_security_summary_report()
RETURNS JSONB AS $$
DECLARE
    report JSONB;
    threat_count INTEGER;
    critical_events INTEGER;
    recent_activity INTEGER;
BEGIN
    -- Count recent security threats
    SELECT COUNT(*) INTO threat_count
    FROM public.detect_advanced_security_threats(1440); -- Last 24 hours
    
    -- Count critical events in last 24 hours
    SELECT COUNT(*) INTO critical_events
    FROM public.security_audit_log
    WHERE severity = 'critical'
    AND created_at >= NOW() - INTERVAL '24 hours';
    
    -- Count total recent activity
    SELECT COUNT(*) INTO recent_activity
    FROM public.security_audit_log
    WHERE created_at >= NOW() - INTERVAL '24 hours';
    
    -- Build comprehensive report
    report := jsonb_build_object(
        'generated_at', NOW(),
        'period', '24 hours',
        'summary', jsonb_build_object(
            'total_security_events', recent_activity,
            'critical_events', critical_events,
            'detected_threats', threat_count,
            'security_status', CASE 
                WHEN critical_events > 5 THEN 'CRITICAL'
                WHEN critical_events > 2 THEN 'HIGH_RISK'
                WHEN threat_count > 0 THEN 'MEDIUM_RISK'
                ELSE 'SECURE'
            END
        ),
        'recent_threats', (
            SELECT jsonb_agg(jsonb_build_object(
                'type', threat_type,
                'level', threat_level,
                'identifier', identifier,
                'count', event_count,
                'recommendation', recommendation
            ))
            FROM public.detect_advanced_security_threats(1440)
        ),
        'recommendations', CASE 
            WHEN critical_events > 5 THEN jsonb_build_array(
                'IMMEDIATE ACTION REQUIRED: Multiple critical security events detected',
                'Review all user accounts and access patterns',
                'Consider implementing temporary access restrictions'
            )
            WHEN critical_events > 2 THEN jsonb_build_array(
                'High priority review recommended',
                'Investigate critical security events',
                'Monitor user activity closely'
            )
            WHEN threat_count > 0 THEN jsonb_build_array(
                'Regular security monitoring recommended',
                'Review detected threats and take preventive action'
            )
            ELSE jsonb_build_array(
                'Security status is good',
                'Continue regular monitoring'
            )
        END
    );
    
    -- Log report generation
    PERFORM public.log_security_event(
        'security_report_generated',
        NULL,
        NULL,
        NULL,
        jsonb_build_object(
            'report_summary', report->'summary',
            'generated_at', NOW()
        ),
        'low'
    );
    
    RETURN report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;