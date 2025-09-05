-- Security Enhancement: Strengthen data validation and add cleanup policies (Fixed)

-- 1. Add email format validation function
CREATE OR REPLACE FUNCTION validate_email_format(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Add email validation constraint for leads
ALTER TABLE public.leads 
ADD CONSTRAINT valid_email_format 
CHECK (validate_email_format(email));

-- 3. Add cleanup function for anonymous calculator results (auto-delete after 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_results()
RETURNS void AS $$
BEGIN
  DELETE FROM public.calculadora_resultados 
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add cleanup for old anonymous chatbot conversations (delete after 7 days)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;