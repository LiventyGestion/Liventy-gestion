-- Fix security warnings: Set search_path for functions

-- 1. Update validate_email_format function with proper search_path
CREATE OR REPLACE FUNCTION validate_email_format(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public;

-- 2. Update cleanup functions with proper search_path
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_results()
RETURNS void AS $$
BEGIN
  DELETE FROM public.calculadora_resultados 
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION cleanup_old_anonymous_conversations()
RETURNS void AS $$
BEGIN
  -- Delete old anonymous conversations and their messages
  DELETE FROM public.chatbot_messages 
  WHERE conversation_id IN (
    SELECT id FROM public.chatbot_conversations 
    WHERE user_id IS NULL 
    AND created_at < NOW() - INTERVAL '7 days'
  );
  
  DELETE FROM public.chatbot_conversations 
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;